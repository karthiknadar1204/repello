import OpenAI from 'openai'
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

interface InquiryOption {
  value: string
  label: string
}

interface Inquiry {
  question: string
  options: InquiryOption[]
  allowsInput: boolean
  inputLabel?: string
  inputPlaceholder?: string
}

export async function inquire(messages: ChatCompletionMessageParam[]): Promise<Inquiry> {
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
          content: `As a professional web researcher, your role is to deepen your understanding of the user's input by conducting further inquiries when necessary.
          After receiving an initial response from the user, carefully assess whether additional questions are absolutely essential to provide a comprehensive and accurate answer. Only proceed with further inquiries if the available information is insufficient or ambiguous.

          When the user provides multiple inputs (like selected options and custom text), treat them as a single coherent query and determine if you need more specific information about any aspect of their request.

          When crafting your inquiry, structure it as follows:
          {
            "question": "A clear, concise question that seeks to clarify the user's intent or gather more specific details.",
            "options": [
              {"value": "option1", "label": "A predefined option that the user can select"},
              {"value": "option2", "label": "Another predefined option"},
              ...
            ],
            "allowsInput": true/false,
            "inputLabel": "A label for the free-form input field, if allowed",
            "inputPlaceholder": "A placeholder text to guide the user's free-form input"
          }

          For example, if the user selects "technology" and adds "applied ai", you might ask:
          {
            "question": "What specific aspect of applied AI technology would you like to explore?",
            "options": [
              {"value": "applications", "label": "Real-world Applications"},
              {"value": "trends", "label": "Current Trends"},
              {"value": "challenges", "label": "Technical Challenges"},
              {"value": "future", "label": "Future Developments"},
              {"value": "impact", "label": "Industry Impact"}
            ],
            "allowsInput": true,
            "inputLabel": "If other, please specify",
            "inputPlaceholder": "e.g., Specific use cases, technologies"
          }

          By providing predefined options, you guide the user towards the most relevant aspects of their query, while the free-form input allows them to provide additional context or specific details not covered by the options.
          Remember, your goal is to gather the necessary information to deliver a thorough and accurate response.`
        },
        ...messages
      ],
      functions: [
        {
          name: 'generate_inquiry',
          description: 'Generate an inquiry to gather more information from the user',
          parameters: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'The question to ask the user'
              },
              options: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    value: {
                      type: 'string',
                      description: 'The value of the option'
                    },
                    label: {
                      type: 'string',
                      description: 'The label to display for the option'
                    }
                  },
                  required: ['value', 'label']
                },
                description: 'Array of predefined options for the user to choose from'
              },
              allowsInput: {
                type: 'boolean',
                description: 'Whether to allow free-form input'
              },
              inputLabel: {
                type: 'string',
                description: 'Label for the free-form input field'
              },
              inputPlaceholder: {
                type: 'string',
                description: 'Placeholder text for the free-form input field'
              }
            },
            required: ['question', 'options', 'allowsInput']
          }
        }
      ]
    })

    const functionCall = result.choices[0].message.function_call
    if (functionCall) {
      const args = JSON.parse(functionCall.arguments)
      return args as Inquiry
    }

    // If no function call, try to parse the content as JSON
    const content = result.choices[0].message.content
    if (content) {
      try {
        const parsedContent = JSON.parse(content)
        if (parsedContent.question && Array.isArray(parsedContent.options)) {
          return parsedContent as Inquiry
        }
      } catch (error) {
        console.error('Error parsing content as JSON:', error)
      }
    }

    // If all else fails, return a default inquiry
    return {
      question: 'Could you please provide more details about your query?',
      options: [],
      allowsInput: true,
      inputLabel: 'Your response',
      inputPlaceholder: 'Please provide more details...'
    }
  } catch (error) {
    console.error('Error in inquire:', error)
    return {
      question: 'Could you please provide more details about your query?',
      options: [],
      allowsInput: true,
      inputLabel: 'Your response',
      inputPlaceholder: 'Please provide more details...'
    }
  }
}
