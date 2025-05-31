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
  const { chats, activeChatId, addChat, setActiveChat } = useChatStore()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    if (chats.length === 0) {
      addChat()
    }

    if (chatId) {
      setActiveChat(chatId)
    }
  }, [chatId])

  const handleNewChat = () => {
    addChat()
    const newChatId = chats[chats.length - 1]?.id
    if (newChatId) {
      router.push(`/chat/${newChatId}`)
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
                className="flex w-full items-center gap-2 rounded-md p-2 text-sm bg-blue-500/10 hover:bg-blue-500/20 transition-colors duration-200 border border-blue-500/20"
              >
                <Plus className="h-4 w-4 text-blue-400" />
                <span className="text-gray-200">New Chat</span>
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
            <div className="rounded-lg border border-white/10 bg-black/50 backdrop-blur-sm p-6 h-[calc(100%-6rem)]">
              {/* Chat content will go here */}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
} 