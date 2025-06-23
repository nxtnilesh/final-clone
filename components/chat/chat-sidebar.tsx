"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/store";
import { Check, Search, Sparkles, SquarePen, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRobot } from "react-icons/fa";
import { ChatActionsDropdown } from "./chat-dropdown";
import { ChatSearchDialog } from "./chat-search-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { set } from "zod";

export function ChatSidebar() {
 const { isMobile, open ,toggleSidebar,setOpen} = useSidebar();
  const router = useRouter();
  const { chats, isLoadingChats, createChat, deleteChat, updateChatTitle } =
    useChats();
  const { currentChat } = useChatStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      toggleSidebar();
    }
  };
  const handleNewChat = async () => {
    try {
      router.push(`/chat/`);
      closeSidebarOnMobile();
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
    closeSidebarOnMobile();
  };

  const handleEditStart = (chatId: string, currentTitle: string) => {
    setEditingId(chatId);
    setEditTitle(currentTitle);
  };

  const handleEditSave = async (chatId: string) => {
    if (editTitle.trim()) {
      await updateChatTitle(chatId, editTitle.trim());
    }
    setEditingId(null);
    setEditTitle("");
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle("");
  };

  const handleDelete = async (chatId: string, chatTitle: string) => {
    const wait = await deleteChat(chatId);
    
    if (currentChat?._id === chatId) {
      router.push("/chat");
    }
  };

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex justify-between">
          <FaRobot
            size={25}
            onClick={handleNewChat}
            className="text-black dark:text-white"
          />
          <SidebarTrigger size="icon" />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <ChatSearchDialog
            open={isSearchDialogOpen}
            onOpenChange={setIsSearchDialogOpen}
          />
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg text-black dark:text-white"
          >
            <SquarePen size={20} />
            New Chat
          </button>
          <button
            onClick={() => setIsSearchDialogOpen(true)}
            className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg text-black dark:text-white"
          >
            <Search size={20} />
            Search chats
          </button>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-black dark:text-white">
            Recent Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(90vh-220px)]">
              <SidebarMenu>
                {isLoadingChats ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <Skeleton className="h-10 w-full" />
                    </SidebarMenuItem>
                  ))
                ) : chats.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground dark:text-neutral-500">
                    No chats yet. Start a new conversation!
                  </div>
                ) : (
                  chats.map((chat) => (
                    <SidebarMenuItem key={chat._id}>
                      {editingId === chat._id ? (
                        <div className="flex items-center gap-1 w-full">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onFocus={(e) => e.target.select()}
                            className="w-full pl-10 pr-10 py-2 rounded-lg text-black dark:text-white placeholder:text-neutral-400 dark:placeholder:text-neutral-500 bg-transparent border-none focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 shadow-none"
                            style={{ boxShadow: "none" }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleEditSave(chat._id);
                              else if (e.key === "Escape") handleEditCancel();
                            }}
                            autoFocus
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditSave(chat._id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleEditCancel}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <SidebarMenuItem key={chat._id}>
                          <SidebarMenuButton
                            onClick={() => handleChatClick(chat._id)}
                            isActive={currentChat?._id === chat._id}
                            className="flex justify-between group/chat-btn text-black dark:text-white"
                          >
                            <div className="overflow-hidden text-nowrap">
                              <div className="w-44">{chat.title}</div>
                            </div>
                            <ChatActionsDropdown
                              chatName={chat.title}
                              onRename={() =>
                                handleEditStart(chat._id, chat.title)
                              }
                              onDelete={() =>
                                handleDelete(chat._id, chat.title)
                              }
                              onShare={() =>
                                console.log("Share chat", chat._id)
                              }
                            />
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      )}
                    </SidebarMenuItem>
                  ))
                )}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <button
          onClick={() => router.push(`/pricing`)}
          className="w-full flex items-center gap-3 p-2 hover:bg-gray-200 dark:hover:bg-neutral-800 rounded-lg text-black dark:text-white"
        >
          <Sparkles size={20} />
          <div className="flex flex-col justify-start items-start gap-1">
            <p className="text-sm">Upgrade plan</p>
            <p className="text-[10px]">More access to the best models</p>
          </div>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
