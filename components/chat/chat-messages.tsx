import { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  streamedContent: string
  relatedQueries?: string[]
  onQueryClick?: (query: string) => void
}

export function ChatMessages({ 
  messages, 
  isLoading, 
  streamedContent, 
  relatedQueries,
  onQueryClick 
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamedContent])

  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`max-w-[80%] rounded-lg px-4 py-2 ${
              message.role === 'user'
                ? 'bg-blue-500/20 text-blue-100'
                : 'bg-gray-800/50 text-gray-100'
            }`}
          >
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.role === 'assistant' && relatedQueries && relatedQueries.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-400 mb-2">Related queries:</p>
                <div className="flex flex-wrap gap-2">
                  {relatedQueries.map((query, idx) => (
                    <button
                      key={idx}
                      className="text-sm px-3 py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 rounded-full border border-blue-500/20 transition-colors duration-200"
                      onClick={() => onQueryClick?.(query)}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-800/50 text-gray-100">
            <p className="whitespace-pre-wrap">{streamedContent}</p>
            <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse ml-1" />
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  )
} 