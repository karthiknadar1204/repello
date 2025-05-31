import { create } from 'zustand'
import { createNewChat, getUserChats } from '@/app/actions/chat'

export interface Chat {
  id: string
  name: string
  createdAt: Date
}

interface ChatStore {
  chats: Chat[]
  activeChatId: string | null
  addChat: () => Promise<string | null>
  setActiveChat: (id: string) => void
  fetchChats: () => Promise<void>
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  activeChatId: null,
  addChat: async () => {
    try {
      const result = await createNewChat()
      if (result.success && result.chat) {
        const newChat: Chat = {
          id: result.chat.id,
          name: result.chat.name,
          createdAt: new Date(result.chat.created_at),
        }
        set((state) => ({
          chats: [...state.chats, newChat],
          activeChatId: newChat.id,
        }))
        return newChat.id
      }
      return null
    } catch (error) {
      console.error('Error adding chat:', error)
      return null
    }
  },
  setActiveChat: (id: string) => set({ activeChatId: id }),
  fetchChats: async () => {
    try {
      const result = await getUserChats()
      if (result.success && result.chats) {
        const formattedChats: Chat[] = result.chats.map(chat => ({
          id: chat.id,
          name: chat.name,
          createdAt: new Date(chat.created_at),
        }))
        set({ chats: formattedChats })
      }
    } catch (error) {
      console.error('Error fetching chats:', error)
    }
  },
})) 