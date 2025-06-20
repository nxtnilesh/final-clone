"use client"

import { useEffect } from "react"
import { useChatStore } from "@/lib/store"
import { chatApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useCurrentChat(chatId?: string) {
  const { currentChat, isLoadingCurrentChat, setCurrentChat, setIsLoadingCurrentChat, clearCurrentChat } =
    useChatStore()

  const { toast } = useToast()

  useEffect(() => {
    if (chatId) {
      loadChat(chatId)
    } else {
      clearCurrentChat()
    }
  }, [chatId])

  const loadChat = async (id: string) => {
    try {
      setIsLoadingCurrentChat(true)
      const chat = await chatApi.getChat(id)
      setCurrentChat(chat)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load chat",
        variant: "destructive",
      })
      clearCurrentChat()
    } finally {
      setIsLoadingCurrentChat(false)
    }
  }

  return {
    currentChat,
    isLoadingCurrentChat,
    loadChat,
  }
}
