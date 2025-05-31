'use server'

import { db } from '@/configs/db'
import { chats, users } from '@/configs/schema'
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { taskManager, researcher, querySuggestor, inquire } from '@/lib/agents'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export async function createNewChat() {
  try {
    const user = await currentUser()
    if (!user?.id) {
      throw new Error('Not authenticated')
    }

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, user.id))

    if (!dbUser) {
      throw new Error('User not found in database')
    }

    const [newChat] = await db
      .insert(chats)
      .values({
        userId: dbUser.id, 
        name: 'New Conversation',
      })
      .returning()

    return { success: true, chat: newChat }
  } catch (error) {
    console.error('Error creating new chat:', error)
    return { success: false, error: 'Failed to create new chat' }
  }
}

export async function getUserChats() {
  try {
    const user = await currentUser()
    if (!user?.id) {
      throw new Error('Not authenticated')
    }

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, user.id))

    if (!dbUser) {
      throw new Error('User not found in database')
    }

    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, dbUser.id))
      .orderBy(chats.created_at)

    return { success: true, chats: userChats }
  } catch (error) {
    console.error('Error fetching user chats:', error)
    return { success: false, error: 'Failed to fetch chats' }
  }
}

export async function submit(formData?: FormData, skip?: boolean) {
  const messages: ChatCompletionMessageParam[] = []
  const userInput = skip ? `{"action": "skip"}` : (formData?.get('input') as string)
  const content = skip ? userInput : formData ? JSON.stringify(Object.fromEntries(formData)) : null

  const messageHistory = formData?.get('messageHistory') as string
  let previousMessages: ChatCompletionMessageParam[] = []
  if (messageHistory) {
    try {
      previousMessages = JSON.parse(messageHistory)
    } catch (error) {
      console.error('Error parsing message history:', error)
    }
  }

  if (content) {
    const message: ChatCompletionMessageParam = { role: 'user', content }
    messages.push(message)
  }

  const allMessages = [...previousMessages, ...messages]

  async function processEvents() {
    let action: any = { object: { next: 'proceed' } }
    if (!skip) {
      action = await taskManager(allMessages)
    }

    if (action.object.next === 'inquire') {
      console.log("Inquire agent was triggered")
      const inquiry = await inquire(allMessages)
      console.log("Inquire agent output:", JSON.stringify(inquiry, null, 2))
      return {
        type: 'inquiry',
        ...inquiry
      }
    }

    let answer = ''
    while (answer.length === 0) {
      const { fullResponse } = await researcher(null, null, allMessages)
      console.log("Researcher agent was triggered")
      answer = fullResponse
      console.log("Researcher agent response:", answer)
    }

    console.log("Query suggestor agent was triggered")
    const relatedQueries = await querySuggestor(null, allMessages)
    console.log("Query suggestor response:", relatedQueries)

    const updatedHistory = [
      ...previousMessages,
      { role: 'user', content },
      { role: 'assistant', content: answer }
    ].slice(-4)

    return {
      type: 'response',
      content: answer,
      relatedQueries,
      messageHistory: JSON.stringify(updatedHistory)
    }
  }

  const result = await processEvents()
  return result
}

export async function* streamSubmit(formData?: FormData, skip?: boolean) {
  const messages: ChatCompletionMessageParam[] = []
  const userInput = skip ? `{"action": "skip"}` : (formData?.get('input') as string)
  const content = skip ? userInput : formData ? JSON.stringify(Object.fromEntries(formData)) : null

  const messageHistory = formData?.get('messageHistory') as string
  let previousMessages: ChatCompletionMessageParam[] = []
  if (messageHistory) {
    try {
      previousMessages = JSON.parse(messageHistory)
    } catch (error) {
      console.error('Error parsing message history:', error)
    }
  }

  if (content) {
    const message: ChatCompletionMessageParam = { role: 'user', content }
    messages.push(message)
  }

  const allMessages = [...previousMessages, ...messages]

  let action: any = { object: { next: 'proceed' } }
  if (!skip) {
    action = await taskManager(allMessages)
  }

  if (action.object.next === 'inquire') {
    console.log("Inquire agent was triggered")
    const inquiry = await inquire(allMessages)
    console.log("Inquire agent output:", JSON.stringify(inquiry, null, 2))
    yield {
      type: 'inquiry',
      ...inquiry
    }
    return
  }

  let searchResult = null
  let llmResponse = ''
  while (llmResponse.length === 0) {
    const { fullResponse } = await researcher(null, null, allMessages)
    console.log("Researcher agent was triggered")
    
    try {
      // Parse the Tavily search result
      searchResult = JSON.parse(fullResponse.replace('Based on the search results: ', ''))
      
      // Stream the search data to the client first
      yield {
        type: 'search_data',
        content: {
          images: searchResult.images || [],
          results: searchResult.results || [],
          response_time: searchResult.response_time
        }
      }

      // Create a new message array with the extracted answer and structured output request
      const llmMessages: ChatCompletionMessageParam[] = [
        ...allMessages,
        {
          role: 'system',
          content: `You are a helpful assistant that provides comprehensive responses based on the given information.
          Your response must be in the following JSON format:
          {
            "summary": "A concise summary of the information",
            "key_points": ["Point 1", "Point 2", "..."],
            "details": "Detailed explanation of the information",
            "sources": ["Source 1", "Source 2", "..."]
          }`
        },
        {
          role: 'user',
          content: `Based on this information: "${searchResult.answer}", please provide a comprehensive response in the specified JSON format.`
        }
      ]
      
      // Get LLM's response using the new message array
      const { fullResponse: llmFullResponse } = await researcher(null, null, llmMessages)
      
      try {
        // Try to parse the LLM response as JSON
        const parsedResponse = JSON.parse(llmFullResponse)
        llmResponse = JSON.stringify(parsedResponse)
      } catch (error) {
        console.error('Error parsing LLM response as JSON:', error)
        // If parsing fails, use the raw response
        llmResponse = llmFullResponse
      }
      
    } catch (error) {
      console.error('Error processing search results:', error)
      llmResponse = fullResponse
    }
  }

  // Stream the LLM's response in chunks
  const chunks = llmResponse.split(/(?<=[.!?])\s+/)
  for (const chunk of chunks) {
    yield {
      type: 'chunk',
      content: chunk + ' '
    }
    await new Promise(resolve => setTimeout(resolve, 50))
  }

  console.log("Query suggestor agent was triggered")
  const relatedQueries = await querySuggestor(null, allMessages)
  console.log("Query suggestor response:", relatedQueries)

  yield {
    type: 'complete',
    messageHistory: JSON.stringify(allMessages),
    relatedQueries
  }
} 