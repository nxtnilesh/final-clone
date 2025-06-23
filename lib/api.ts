import axios from "axios";
import type { CoreMessage } from "ai";
import type { Chat } from "./store";
import { UIMessage } from "ai";

const api = axios.create({
  // baseURL: "https://final-clone-sigma.vercel.app/api",
  baseURL: "http://localhost:3000/api",
  timeout: 30000,
});

// Request interceptor for error handling
api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const chatApi = {
  // Get all chats
  getChats: async (): Promise<Chat[]> => {
    const response = await api.get("/chats");
    console.log("res", response);

    return response.data;
  },

  // Get specific chat
  getChat: async (chatId: string): Promise<Chat> => {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  },

  // Create new chat
  createChat: async (title?: string, messages?: any): Promise<Chat> => {
    const response = await api.post("/chats", { title, messages });
    return response.data;
  },

  // Update chat
  updateChat: async (chatId: string, updates: Partial<Chat>): Promise<void> => {
    await api.put(`/chats/${chatId}`, updates);
  },

  searchChat: async (chatTitle: string): Promise<Chat> => {
    const response = await api.get(
      `/search-chats?title=${chatTitle}&page=1&limit=10`
    );
    console.log("search", response);
    
    return response.data;
  },

  // Delete chat
  deleteChat: async (chatId: string): Promise<void> => {
    await api.delete(`/chats/${chatId}`);
  },

  // Generate title
  generateTitle: async (messages: any): Promise<string> => {
    const response = await api.post("/generate-title", { messages });
    console.log("title", response);

    return response.data.title;
  },
};

export default api;
