"use client";

import { use, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import {
  Send,
  Loader2,
  Edit2,
  Check,
  X,
  ArrowUp,
  Pause,
  Mic,
} from "lucide-react";
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
import { ChatFileUploader } from "./chat-file-upload";
import useSpeechRecognition from "@/hooks/use-speechRecogination";

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
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [speechInput, setSpeechInput] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const { transcript, isListening, error } =
    useSpeechRecognition(isSpeechActive);

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
    body: { chatId, fileUrl },

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

  useEffect(() => {
    if (transcript) {
      setSpeechInput((prevInput) => prevInput + " " + transcript);
      console.log("speech data", speechInput);
    }
  }, [transcript]);
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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
      <div className="flex items-center justify-center h-full bg-neutral-600">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-neutral-800 text-white dark:bg-neutral-800 dark:text-white light:bg-white light:text-black">
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
      <ScrollArea className="flex-1 p-4 ">
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
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Input */}
      <div
        className={`w-full ${
          messages.length === 0 ? "flex-1 flex  justify-center p-4" : "p-4 "
        }`}
      >
        <div className="max-w-4xl w-full mx-auto ">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col rounded-3xl bg-neutral-900 border border-neutral-700 shadow-lg p-1 dark:bg-neutral-700 dark:border-neutral-700 light:bg-neutral-100 light:border-neutral-200"
          >
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              disabled={isLoading}
              className=" px-3 pt-3  focus:border-none focus:outline-none w-full resize-none overflow-y-auto bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-neutral-500 dark:text-white dark:placeholder:text-neutral-500 light:text-black light:placeholder:text-neutral-500 min-h-[40px] max-h-[420px]"
              onInput={(e) => {
                const textarea = e.currentTarget;
                textarea.style.height = "auto"; // Reset first
                const scrollHeight = textarea.scrollHeight;

                // Cap height at 420px
                if (scrollHeight > 420) {
                  textarea.style.height = "420px"; // Lock height
                  textarea.style.overflowY = "auto"; // Enable scroll
                } else {
                  textarea.style.height = `${scrollHeight}px`; // Grow normally
                  textarea.style.overflowY = "hidden"; // Hide scrollbar
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (input.trim()) {
                    handleSubmit(e);
                  }
                }
              }}
            />

            <div className="flex w-full items-center px-3 pb-2">
              <ChatFileUploader
                onUploadComplete={(url) => {
                  setFileUrl(url);
                  console.log("uploaded file url", url);
                  // append({
                  //   role: "user",
                  //   content: `![Uploaded Image](${url})`,parts:[]
                  // });
                }}
              />
              <div className="w-full"></div>
              <button
                // type="button"
                // variant="ghost"
                // size="icon"
                disabled={isLoading}
                onClick={() => setIsSpeechActive(!isSpeechActive)}
                // className="h-9 w-9 rounded-md border border-gray-300"
              >
                {isListening ? (
                  <Pause className="h-5 w-5 text-blue-600" />
                ) : (
                  <Mic className="h-9 w-9 hover:bg-gray-500 p-2 rounded-full font-extrabold mx-2  text-white" />
                )}
              </button>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                // size="icon"
              >
                {status === "ready" ? (
                  <ArrowUp className="h-9 w-9 hover:bg-gray-500 p-1 rounded-full font-extrabold mx-2  text-white" />
                ) : (
                  <FaStopCircle className="bg-white font-extrabold w-6 h-6" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
