import { NextRequest } from 'next/server'
import { streamSubmit } from '@/app/actions/chat'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const generator = streamSubmit(formData)
        
        for await (const chunk of generator) {
          const data = JSON.stringify(chunk) + '\n'
          controller.enqueue(encoder.encode(data))
        }
        
        controller.close()
      } catch (error) {
        console.error('Error in stream:', error)
        controller.error(error)
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
} 