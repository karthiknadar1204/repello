'use server'

import { db } from '@/configs/db'
import { chats, users } from '@/configs/schema'
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

export async function createNewChat() {
  try {
    const user = await currentUser()
    if (!user?.id) {
      throw new Error('Not authenticated')
    }


    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, user.id))

    if (!dbUser) {
      throw new Error('User not found in database')
    }

    const [newChat] = await db
      .insert(chats)
      .values({
        userId: dbUser.id, 
        name: 'New Conversation',
      })
      .returning()

    return { success: true, chat: newChat }
  } catch (error) {
    console.error('Error creating new chat:', error)
    return { success: false, error: 'Failed to create new chat' }
  }
}

export async function getUserChats() {
  try {
    const user = await currentUser()
    if (!user?.id) {
      throw new Error('Not authenticated')
    }

    const [dbUser] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, user.id))

    if (!dbUser) {
      throw new Error('User not found in database')
    }

    const userChats = await db
      .select()
      .from(chats)
      .where(eq(chats.userId, dbUser.id))
      .orderBy(chats.created_at)

    return { success: true, chats: userChats }
  } catch (error) {
    console.error('Error fetching user chats:', error)
    return { success: false, error: 'Failed to fetch chats' }
  }
} 