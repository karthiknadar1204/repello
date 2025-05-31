'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { useChatStore } from '@/lib/store/chat-store'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar'

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const chatId = params?.id as string
  const { chats, activeChatId, addChat, setActiveChat, fetchChats } = useChatStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCreatingChat, setIsCreatingChat] = useState(false)

  useEffect(() => {
    const initializeChats = async () => {
      await fetchChats()
    }

    initializeChats()
  }, [])

  useEffect(() => {
    if (chatId) {
      setActiveChat(chatId)
    }
  }, [chatId])

  const handleNewChat = async () => {
    try {
      setIsCreatingChat(true)
      const newChatId = await addChat()
      if (newChatId) {
        router.push(`/chat/${newChatId}`)
      }
    } catch (error) {
      console.error('Error creating new chat:', error)
    } finally {
      setIsCreatingChat(false)
    }
  }

  const handleChatClick = (chatId: string) => {
    setActiveChat(chatId)
    router.push(`/chat/${chatId}`)
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-black text-white overflow-hidden">
        <div className={`relative transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0'}`}>
          <Sidebar className={`w-64 flex-shrink-0 border-r border-white/10 absolute left-0 top-0 h-full transition-all duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <SidebarHeader className="p-4">
              <button
                onClick={handleNewChat}
                disabled={isCreatingChat}
                className="flex w-full items-center gap-2 rounded-md p-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-200 border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 text-blue-400" />
                <span className="text-gray-200">
                  {isCreatingChat ? 'Creating...' : 'New Chat'}
                </span>
              </button>
            </SidebarHeader>
            <SidebarContent className="p-2">
              <SidebarMenu>
                {chats.map((chat) => (
                  <SidebarMenuItem key={chat.id} className="mb-2">
                    <SidebarMenuButton
                      isActive={chat.id === activeChatId}
                      onClick={() => handleChatClick(chat.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-md transition-all duration-200 ${
                        chat.id === activeChatId
                          ? 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-white border border-blue-500/30 shadow-lg shadow-blue-500/10'
                          : 'text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-blue-600/10 border border-transparent hover:border-blue-500/20 hover:shadow-md hover:shadow-blue-500/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          chat.id === activeChatId ? 'bg-blue-400' : 'bg-blue-400/50'
                        }`} />
                        <span className="truncate">{chat.name}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
        </div>
        <button
          onClick={toggleSidebar}
          className={`fixed top-4 z-50 bg-black/90 border border-white/10 rounded-r-md p-2 hover:bg-white/10 transition-colors duration-200 ${isSidebarOpen ? 'left-64' : 'left-0'}`}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="h-5 w-5 text-blue-400" />
          ) : (
            <ChevronRight className="h-5 w-5 text-blue-400" />
          )}
        </button>
        <main className="flex-1 p-6 relative min-w-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/10 via-black to-blue-950/10" />
          <div className="relative h-full max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-white bg-clip-text text-transparent">
                Chat {chatId}
              </span>
            </h1>
            <div className="rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm p-6 h-[calc(100%-6rem)] flex flex-col">
              <div className="flex-1 overflow-y-auto">
                {/* Chat messages will go here */}
              </div>
              <div className="mt-4 border-t border-white/10 pt-4">
                <form className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all duration-200"
                  />
                  <button
                    type="submit"
                    className="px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span>Send</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.896 28.896 0 0015.293-7.154.75.75 0 000-1.115A28.897 28.897 0 003.105 2.289z" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
} 