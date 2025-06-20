"use client"

import { useEffect } from "react"
import { useChatStore } from "@/lib/store"
import { chatApi } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useChats() {
  const {
    chats,
    isLoadingChats,
    chatError,
    setChats,
    setIsLoadingChats,
    setChatError,
    addChat,
    updateChat,
    removeChat,
  } = useChatStore()

  const { toast } = useToast()

  // Load chats on mount
  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      setIsLoadingChats(true)
      setChatError(null)
      const chatsData = await chatApi.getChats()
      setChats(chatsData)
    } catch (error) {
      const errorMessage = "Failed to load chats"
      setChatError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoadingChats(false)
    }
  }

  const createChat = async (title?: string, message?: any) => {
    try {
      const newChat = await chatApi.createChat(title,message)
      console.log("newChat",newChat);
      
      addChat(newChat)
      console.log("newChat",newChat);
      return newChat
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive",
      })
      throw error
    }
  }

  const deleteChat = async (chatId: string) => {
    try {
      await chatApi.deleteChat(chatId)
      removeChat(chatId)
      toast({
        title: "Success",
        description: "Chat deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete chat",
        variant: "destructive",
      })
    }
  }

  const updateChatTitle = async (chatId: string, title: string) => {
    try {
      await chatApi.updateChat(chatId, { title })
      updateChat(chatId, { title })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update chat title",
        variant: "destructive",
      })
    }
  }

  return {
    chats,
    isLoadingChats,
    chatError,
    loadChats,
    createChat,
    deleteChat,
    updateChatTitle,
  }
}
