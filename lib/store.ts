import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UIMessage } from "ai";

export interface Chat {
  _id: string;
  title: string;
  messages: UIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

interface ChatState {
  // Chat list
  chats: Chat[];
  isLoadingChats: boolean;
  chatError: string | null;

  // Current chat
  currentChat: Chat | null;
  isLoadingCurrentChat: boolean;

  // UI state
  sidebarOpen: boolean;

  // Actions
  setChats: (chats: Chat[]) => void;
  setIsLoadingChats: (loading: boolean) => void;
  setChatError: (error: string | null) => void;
  setCurrentChat: (chat: Chat | null) => void;
  setIsLoadingCurrentChat: (loading: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  addChat: (chat: Chat) => void;
  // updateChat: (chatId: string, updates: Partial<Chat>) => void;
  updateChat: (chatId: string, updates: any) => void;
  removeChat: (chatId: string) => void;
  clearCurrentChat: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chats: [],
      isLoadingChats: false,
      chatError: null,
      currentChat: null,
      isLoadingCurrentChat: false,
      sidebarOpen: true,

      setChats: (chats) => set({ chats }),
      setIsLoadingChats: (isLoading) => set({ isLoadingChats: isLoading }),
      setChatError: (error) => set({ chatError: error }),
      setCurrentChat: (chat) => set({ currentChat: chat }),
      setIsLoadingCurrentChat: (loading) =>
        set({ isLoadingCurrentChat: loading }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      addChat: (chat) => set((state) => ({ chats: [chat, ...state.chats] })),

      updateChat: (chatId, updates) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat._id === chatId ? { ...chat, ...updates } : chat
          ),
          currentChat:
            state.currentChat?._id === chatId
              ? { ...state.currentChat, ...updates }
              : state.currentChat,
        })),

      removeChat: (chatId) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat._id !== chatId),
          currentChat:
            state.currentChat?._id === chatId ? null : state.currentChat,
        })),
      clearCurrentChat: () => set({ currentChat: null }),
    }),
    {
      name: "chat-store",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen, // only persist sidebar UI state
      }),
    }
  )
);
