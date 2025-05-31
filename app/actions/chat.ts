'use server'

import { db } from '@/configs/db'
import { chats, users } from '@/configs/schema'
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { taskManager, researcher, querySuggestor } from '@/lib/agents'
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

  if (content) {
    const message: ChatCompletionMessageParam = { role: 'user', content }
    messages.push(message)
  }


  async function processEvents() {

    let action: any = { object: { next: 'proceed' } }
    if (!skip) {
      action = await taskManager(messages)
    }


    if (action.object.next === 'inquire') {
      console.log("Inquire agent was triggered")

      return {
        type: 'inquiry',
        question: "Sample question" 
      }
    }


    let answer = ''
    while (answer.length === 0) {
      const { fullResponse } = await researcher(null, null, messages)
      console.log("Researcher agent was triggered")
      answer = fullResponse
      console.log("Researcher agent response:", answer)
    }


    console.log("Query suggestor agent was triggered")
    const relatedQueries = await querySuggestor(null, messages)
    console.log("Query suggestor response:", relatedQueries)
    

    return {
      type: 'response',
      content: answer,
      relatedQueries
    }
  }

  const result = await processEvents()
  return result
} 