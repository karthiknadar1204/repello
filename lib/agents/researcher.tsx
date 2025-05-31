import OpenAI from 'openai'

export async function researcher(
  uiStream: any,
  streamText: any,
  messages: any[]
) {
  const openai = new OpenAI({
    baseURL: process.env.OPENAI_API_BASE,
    apiKey: process.env.OPENAI_API_KEY,
    organization: ''
  })

  let fullResponse = ''

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      max_tokens: 2500,
      messages: [
        {
          role: 'system',
          content: `As a professional search expert, you possess the ability to search for any information on the web. 
          For each user query, utilize the search results to their fullest potential to provide additional information and assistance in your response.
          If there are any images relevant to your answer, be sure to include them as well.
          Aim to directly address the user's question, augmenting your response with insights gleaned from the search results.
          Whenever quoting or referencing information from a specific URL, always cite the source URL explicitly.`
        },
        ...messages
      ],
      functions: [
        {
          name: 'search',
          description: 'Search the web for information',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query'
              },
              max_results: {
                type: 'number',
                description: 'Maximum number of results to return',
                default: 10
              },
              search_depth: {
                type: 'string',
                enum: ['basic', 'advanced'],
                description: 'Search depth level',
                default: 'basic'
              }
            },
            required: ['query']
          }
        }
      ]
    })

    const functionCall = result.choices[0].message.function_call
    if (functionCall) {
      const args = JSON.parse(functionCall.arguments)
      const searchResult = await tavilySearch(args.query, args.max_results || 10, args.search_depth || 'basic')
      fullResponse = `Based on the search results: ${JSON.stringify(searchResult)}`
    } else {
      fullResponse = result.choices[0].message.content || 'No response generated'
    }

    return { result, fullResponse }
  } catch (error) {
    console.error('Error in researcher:', error)
    return { 
      result: null, 
      fullResponse: 'I encountered an error while trying to research this topic. Please try again.' 
    }
  }
}

async function tavilySearch(
  query: string,
  maxResults: number = 10,
  searchDepth: 'basic' | 'advanced' = 'basic'
): Promise<any> {
  try {
    const apiKey = process.env.TAVILY_API_KEY
    if (!apiKey) {
      throw new Error('TAVILY_API_KEY is not configured')
    }

    const response = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults < 5 ? 5 : maxResults,
        search_depth: searchDepth,
        include_images: true,
        include_answers: true
      })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`Tavily API error: ${response.status} - ${JSON.stringify(errorData)}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error in tavilySearch:', error)
    throw error
  }
}
