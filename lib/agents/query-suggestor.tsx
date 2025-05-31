import OpenAI from 'openai'

export async function querySuggestor(
  uiStream: any,
  messages: any[]
) {
  const openai = new OpenAI({
    baseURL: process.env.OPENAI_API_BASE,
    apiKey: process.env.OPENAI_API_KEY,
    organization: ''
  })

  try {
    const result = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: `As a professional web researcher, your task is to generate a set of three queries that explore the subject matter more deeply, building upon the initial query and the information uncovered in its search results.

          For instance, if the original query was "Starship's third test flight key milestones", your output should follow this format:

          {
            "related": [
              "What were the primary objectives achieved during Starship's third test flight?",
              "What factors contributed to the ultimate outcome of Starship's third test flight?",
              "How will the results of the third test flight influence SpaceX's future development plans for Starship?"
            ]
          }

          Aim to create queries that progressively delve into more specific aspects, implications, or adjacent topics related to the initial query. The goal is to anticipate the user's potential information needs and guide them towards a more comprehensive understanding of the subject matter.`
        },
        ...messages
      ],
      functions: [
        {
          name: 'generate_related_queries',
          description: 'Generate related queries based on the conversation',
          parameters: {
            type: 'object',
            properties: {
              related: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Array of related queries'
              }
            },
            required: ['related']
          }
        }
      ]
    })

    const functionCall = result.choices[0].message.function_call
    if (functionCall) {
      const args = JSON.parse(functionCall.arguments)
      return args.related
    }

    return []
  } catch (error) {
    console.error('Error in querySuggestor:', error)
    return []
  }
}
