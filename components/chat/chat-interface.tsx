"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { Send, Loader2, Edit2, Check, X, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useCurrentChat } from "@/hooks/use-current-chat";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/store";
import { chatApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./chat-message";
import { UIMessage } from "ai";
import { set } from "date-fns";
import { Textarea } from "../ui/textarea";
import { FaStopCircle } from "react-icons/fa";

interface ChatInterfaceProps {
  chatId?: string;
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { currentChat, isLoadingCurrentChat } = useCurrentChat(chatId);
  const { createChat, updateChatTitle, chats } = useChats();
  const { updateChat } = useChatStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [finish, setFinish] = useState<Boolean>(false);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    setMessages,
    status,
    append,
  } = useChat({
    api: "/api/chat",
    body: { chatId },

    onFinish: async (message) => {
      if (message) {
        setFinish(true);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  async function submitChats() {
    if (!chatId) {
      try {
        const title = await chatApi.generateTitle(messages);
        console.log(title);
        const newChat = await createChat(title, messages);
        console.log("newchat", newChat);

        router.replace(`/chat/${newChat}`);
      } catch (error) {
        console.error("Failed to create chat with title:", error);
      }
    }
    console.log("outer", messages);
  }
  if (finish) {
    submitChats();
    setFinish(false);
  }

  // Load messages when chat changes
  useEffect(() => {
    if (currentChat) {
      // console.log(chats);
      setMessages(currentChat.messages || []);
      // console.log("current chat", messages);

      // setEditTitle(currentChat.title);
    } else if (!chatId) {
      setMessages([]);
    }
  }, [currentChat, chatId, setMessages]);

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = async () => {
    if (chatId && editTitle.trim() && editTitle !== currentChat?.title) {
      await updateChatTitle(chatId, editTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setEditTitle(currentChat?.title || "");
    setIsEditingTitle(false);
  };

  if (isLoadingCurrentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white dark:bg-neutral-900 dark:text-white light:bg-white light:text-black">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          {chatId && currentChat ? (
            <div className="flex items-center gap-2">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="h-8"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTitleSave();
                      } else if (e.key === "Escape") {
                        handleTitleCancel();
                      }
                    }}
                    autoFocus
                  />
                  <Button size="sm" variant="ghost" onClick={handleTitleSave}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleTitleCancel}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold">{currentChat.title}</h1>
                  <Button size="sm" variant="ghost" onClick={handleTitleEdit}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <h1 className="text-lg font-semibold">New Chat</h1>
          )}
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto ">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">
              <h2 className="text-2xl font-semibold mb-2">
                What are you working on?
              </h2>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onEdit={(id, newContent) => {
                  const updatedMessages = messages.map((msg) =>
                    msg.content == newContent
                      ? { ...msg, content: newContent }
                      : msg
                  );
                  console.log("messages", message);
                  console.log("updatedmess", updatedMessages);

                  setMessages(updatedMessages);
                }}
              />
            ))
          )}

          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <Card className="flex-1 p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div
        className={`w-full ${
          messages.length === 0
            ? "flex-1 flex  justify-center p-4"
            : "p-4 border-t border-neutral-800 dark:border-neutral-800 light:border-neutral-200"
        }`}
      >
        <div className="max-w-4xl w-full mx-auto">
          <form
            onSubmit={handleSubmit}
            className="flex gap-2 items-end rounded-xl bg-neutral-800 border border-neutral-700 shadow-lg p-2 dark:bg-neutral-800 dark:border-neutral-700 light:bg-neutral-100 light:border-neutral-200"
          >
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 resize-none max-h-48 overflow-auto bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-neutral-500 dark:text-white dark:placeholder:text-neutral-500 light:text-black light:placeholder:text-neutral-500"
              rows={1}
              onInput={(e) => {
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault(); // prevent newline
                  if (input.trim()) {
                    handleSubmit(e); // trigger form submit
                  }
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              // size="icon"
              className="shrink-0 bg-white text-black hover:bg-neutral-200 dark:bg-white dark:text-black dark:hover:bg-neutral-200 light:bg-black light:text-white light:hover:bg-neutral-800"
            >
              {status==="ready" ? (
                <ArrowUp className="bg-white font-extrabold w-8 h-8"/>
              ) : (
                <FaStopCircle className="bg-white font-extrabold w-8 h-8"/>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
