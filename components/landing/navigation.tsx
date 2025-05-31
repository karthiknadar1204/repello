"use client"

import { useState } from "react"
import { Brain, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { UserButton, SignInButton, SignUpButton, SignedIn, SignedOut } from "@clerk/nextjs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useChatStore } from "@/lib/store/chat-store"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { addChat } = useChatStore()

  const handleDashboardClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newChatId = await addChat()
    if (newChatId) {
      router.push(`/chat/${newChatId}`)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              Repello
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" onClick={handleDashboardClick} className="text-white hover:text-gray-300">
              Dashboard
            </Link>
            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="text-white hover:text-gray-300">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="outline" className="border-blue-600 text-blue-400 hover:bg-blue-600/10">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  )
}
