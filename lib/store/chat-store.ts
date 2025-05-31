import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

export interface Chat {
  id: string
  name: string
  createdAt: Date
}

interface ChatStore {
  chats: Chat[]
  activeChatId: string | null
  addChat: () => void
  setActiveChat: (id: string) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  chats: [],
  activeChatId: null,
  addChat: () => {
    const newChat: Chat = {
      id: uuidv4(),
      name: 'New Conversation',
      createdAt: new Date(),
    }
    set((state) => ({
      chats: [...state.chats, newChat],
      activeChatId: newChat.id,
    }))
  },
  setActiveChat: (id: string) => set({ activeChatId: id }),
})) 