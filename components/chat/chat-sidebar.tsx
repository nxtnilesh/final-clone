"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  Plus,
  MessageSquare,
  Trash2,
  Edit2,
  Check,
  X,
  SquarePen,
  Search,
  Sparkles,
  Ellipsis,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/store";
import { FaRobot } from "react-icons/fa";
import { ChatSearchDialog } from "./chat-search-dialog";
import { ChatActionsDropdown } from "./chat-dropdown";

export function ChatSidebar() {
  const router = useRouter();
  const { chats, isLoadingChats, createChat, deleteChat, updateChatTitle } =
    useChats();
  const { currentChat } = useChatStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleNewChat = async () => {
    try {
      // const newChat = await createChat()
      // router.push(`/chat/${newChat._id}`)

      router.push(`/chat/`);
    } catch (error) {
      console.error("Failed to create chat:", error);
    }
  };

  const handleChatClick = (chatId: string) => {
    router.push(`/chat/${chatId}`);
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

  const handleDelete = async (chatId: string) => {
    await deleteChat(chatId);
    if (currentChat?._id === chatId) {
      router.push("/chat");
    }
  };

  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader className="p-4 ">
        <div className="flex justify-between">
        <FaRobot size={25} onClick={handleNewChat} />
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
            className="w-full flex items-center gap-3 p-2 hover:bg-neutral-800 rounded-lg"
          >
            <SquarePen size={20} />
            New Chat
          </button>
          <button
            onClick={() => setIsSearchDialogOpen(true)}
            className="w-full flex items-center gap-3 p-2 hover:bg-neutral-800 rounded-lg"
          >
            <Search size={20} />
            Search chats
          </button>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-200px)]">
              <SidebarMenu>
                {isLoadingChats ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <Skeleton className="h-10 w-full" />
                    </SidebarMenuItem>
                  ))
                ) : chats.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    No chats yet. Start a new conversation!
                  </div>
                ) : (
                  chats.map((chat) => (
                    <SidebarMenuItem key={chat._id}>
                      {editingId === chat._id ? (
                        <div className="flex items-center  gap-1">
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="h-8 text-sm"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleEditSave(chat._id);
                              } else if (e.key === "Escape") {
                                handleEditCancel();
                              }
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
                            className="flex   justify-between group/chat-btn"
                          >
                            <div className="overflow-hidden text-nowrap">
                              <div className="w-44">
                                {chat.title}
                              </div>
                            </div>
                            <div className="justify-end ">
                              <ChatActionsDropdown
                                onRename={() =>
                                  handleEditStart(chat._id, chat.title)
                                }
                                onDelete={() => handleDelete(chat._id)}
                                onShare={() =>
                                  console.log("Share chat", chat._id)
                                }
                              />
                            </div>
                            <button
                              onClick={() => console.log("hjsd")}
                            ></button>
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
          onClick={handleNewChat}
          className="w-full flex items-center gap-3 p-2 hover:bg-neutral-800 rounded-lg"
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
