import { useEffect, useRef, useState } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface StructuredResponse {
  summary: string
  key_points: string[]
  details: string
  sources: string[]
}

interface ChatMessagesProps {
  messages: Message[]
  isLoading: boolean
  streamedContent: string
  relatedQueries?: string[]
  onQueryClick?: (query: string) => void
  searchData?: {
    images: string[]
    results: any[]
    response_time: number
  }
}

const getDomain = (url: string) => {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

const getFavicon = (url: string) => {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return ''
  }
}

export function ChatMessages({ 
  messages, 
  isLoading, 
  streamedContent, 
  relatedQueries,
  onQueryClick,
  searchData
}: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [expandedSources, setExpandedSources] = useState<{ [key: number]: boolean }>({})

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamedContent])

  const renderStructuredContent = (
    content: string,
    showAllSources: boolean,
    onShowAllSources: () => void
  ) => {
    try {
      const structuredData: StructuredResponse = JSON.parse(content)
      const sources = structuredData.sources || []
      const sourcesToShow = showAllSources ? sources : sources.slice(0, 3)
      const extraCount = sources.length - sourcesToShow.length
      return (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Summary</h3>
            <p className="text-gray-200">{structuredData.summary}</p>
          </div>
          
          {structuredData.key_points && structuredData.key_points.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2">Key Points</h3>
              <ul className="list-disc list-inside space-y-1">
                {structuredData.key_points.map((point, idx) => (
                  <li key={idx} className="text-gray-200">{point}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Details</h3>
            <p className="text-gray-200 whitespace-pre-wrap">{structuredData.details}</p>
          </div>
          
          {sources.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <span>Sources</span>
                <span className="inline-block"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 4v16h14V4H5zm2 2h10v12H7V6zm2 2v8h6V8H9z" fill="#60A5FA"/></svg></span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {sourcesToShow.map((src, idx) => (
                  <a
                    key={idx}
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#1a2233] border border-blue-900/40 rounded-xl px-4 py-3 flex flex-col min-w-[220px] max-w-[260px] transition hover:bg-blue-900/20"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <img src={getFavicon(src)} alt="favicon" className="w-5 h-5 rounded" />
                      <span className="text-xs text-gray-400">{getDomain(src)}</span>
                    </div>
                    <div className="text-sm text-gray-100 truncate">
                      {src.length > 60 ? src.slice(0, 57) + '...' : src}
                    </div>
                  </a>
                ))}
                {extraCount > 0 && !showAllSources && (
                  <button
                    className="bg-blue-900/30 border border-blue-700/40 rounded-xl px-4 py-3 text-blue-400 font-medium min-w-[120px] hover:bg-blue-900/50 transition"
                    onClick={onShowAllSources}
                  >
                    View {extraCount} more
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )
    } catch (error) {

      return <p className="whitespace-pre-wrap">{content}</p>
    }
  }

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
            {message.role === 'assistant'
              ? renderStructuredContent(
                  message.content,
                  !!expandedSources[index],
                  () => setExpandedSources((prev) => ({ ...prev, [index]: true }))
                )
              : <p className="whitespace-pre-wrap">{message.content}</p>
            }
            
            {message.role === 'assistant' && searchData && (
              <div className="mt-4 pt-4 border-t border-white/10">
                {searchData.images && searchData.images.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-400 mb-2">Images:</p>
                    <div className="flex flex-wrap gap-2">
                      {searchData.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={image}
                          alt={`Search result image ${idx + 1}`}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}
                
                {searchData.results && searchData.results.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Sources:</p>
                    <div className="space-y-2">
                      {searchData.results.map((result, idx) => (
                        <a
                          key={idx}
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm text-blue-400 hover:text-blue-300 truncate"
                        >
                          {result.title}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

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