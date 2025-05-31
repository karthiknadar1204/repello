'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Plus } from 'lucide-react'
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

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <Sidebar>
          <SidebarHeader>
            <button
              onClick={handleNewChat}
              className="flex w-full items-center gap-2 rounded-md p-2 text-sm hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
              <span>New Chat</span>
            </button>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    isActive={chat.id === activeChatId}
                    onClick={() => handleChatClick(chat.id)}
                  >
                    {chat.name}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-4">

          <h1>Chat {chatId}</h1>
        </main>
      </div>
    </SidebarProvider>
  )
} 