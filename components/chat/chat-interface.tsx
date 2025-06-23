"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Pause, Mic, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCurrentChat } from "@/hooks/use-current-chat";
import { useChats } from "@/hooks/use-chats";
import { useChatStore } from "@/lib/store";
import { chatApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { ChatMessage } from "./chat-message";
import { UIMessage } from "ai";
import { ChatFileUploader } from "./chat-file-upload";
import useSpeechRecognition from "@/hooks/use-speechRecogination";
import Header from "../header";
import Image from "next/image";
import ExtraMobile from "../extraMobile";

interface ChatInterfaceProps {
  chatId?: string;
}

export function ChatInterface({ chatId }: ChatInterfaceProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { currentChat, isLoadingCurrentChat } = useCurrentChat(chatId);
  const { createChat, updateChatTitle } = useChats();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [finish, setFinish] = useState<Boolean>(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [speechInput, setSpeechInput] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const { transcript, isListening } = useSpeechRecognition(isSpeechActive);

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    status,
    append,
  } = useChat({
    api: "/api/chat",
    body: { chatId, fileUrl },
    onFinish: async (message) => message && setFinish(true),
    onError: (error: Error) =>
      toast({
        title: "Error",
        description: `Message ${error.message} `,
        variant: "destructive",
      }),
  });

  useEffect(() => {
    if (transcript) setSpeechInput((prev) => prev + " " + transcript);
  }, [transcript]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function submitChats() {
    if (!chatId) {
      try {
        const title = await chatApi.generateTitle(messages);
        const newChat = await createChat(title, messages);
        router.replace(`/chat/${newChat}`);
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    }
  }
  if (finish) {
    submitChats();
    setFinish(false);
  }

  useEffect(() => {
    if (currentChat) setMessages(currentChat.messages || []);
    else if (!chatId) setMessages([]);
  }, [currentChat, chatId, setMessages]);

  const renderInputForm = () => (
    <div className="max-w-3xl w-full mx-auto">
      {messages.length === 0 && (
        <div className="text-center py-6">
          <h2 className="text-2xl font-semibold mb-2 text-black dark:text-white">
            What are you working on?
          </h2>
          <ExtraMobile />
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mx-3 flex flex-col rounded-3xl border border-neutral-200 dark:border-neutral-700 shadow-lg p-1 bg-neutral-100 dark:bg-neutral-800"
      >
        {fileUrl && (
          <Image
            src={fileUrl}
            height={250}
            width={250}
            alt="Uploaded Preview"
            className="max-w-xs mt-2 rounded-lg border"
          />
        )}
        <textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Ask anything..."
          disabled={isLoading}
          className="px-3 pt-3 text-black dark:text-white placeholder:text-black dark:placeholder:text-neutral-400 
    bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:ring-offset-0 
    focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 
    w-full resize-none overflow-y-auto min-h-[40px] max-h-[420px]"
          style={{ boxShadow: "none" }} // remove any default box shadow
          onInput={(e) => {
            const textarea = e.currentTarget;
            textarea.style.height = "auto";
            const scrollHeight = textarea.scrollHeight;
            textarea.style.height =
              scrollHeight > 420 ? "420px" : `${scrollHeight}px`;
            textarea.style.overflowY = scrollHeight > 420 ? "auto" : "hidden";
          }}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (input.trim()) handleSubmit(e);
            }
          }}
        />

        <div className="flex w-full items-center px-3 pb-2">
          <ChatFileUploader
            onUploadComplete={(url) => {
              setFileUrl(url);
              append({
                role: "user",
                content: `content: ![Uploaded Image](${url}),`,
              });
            }}
          />
          <div className="w-full" />
          <button
            disabled={isLoading}
            onClick={() => setIsSpeechActive(!isSpeechActive)}
          >
            {isListening ? (
              <Pause className="h-5 w-5 text-blue-600" />
            ) : (
              <Mic className="h-9 w-9 p-2 rounded-full mx-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700" />
            )}
          </button>
          <button type="submit" disabled={isLoading || !input.trim()}>
            {status === "ready" ? (
              <ArrowUp className="h-9 w-9 p-1 rounded-full mx-2 text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-700" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin" />
            )}
          </button>
        </div>
      </form>
      <p className="text-gray-900 dark:text-gray-300 text-[10px] text-center mt-1">
        ChatGPT can make mistakes. Check important info.
      </p>
    </div>
  );

  if (isLoadingCurrentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (messages.length === 0)
    return (
      <div className="flex flex-col min-h-screen bg-white dark:bg-neutral-800">
        <div className="sticky top-0 z-50 w-full">
          <Header />
        </div>
        <div className="flex-1 mx-6 grid place-items-center">
          {renderInputForm()}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen  bg-white text-black dark:bg-neutral-800 w-full dark:text-white">
      <div className="sticky top-0 z-50 w-full">
        <Header />
      </div>

      <div className="w-full ">
        <ScrollArea className="mx-auto max-w-3xl h-[calc(80vh-2rem)]  p-4 overflow-x-hidden">
          <div className="mx-auto">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onEdit={(id, newContent) => {
                  const updatedMessages = messages.map((msg) =>
                    msg.id === id ? { ...msg, content: newContent } : msg
                  );
                  setMessages(updatedMessages);
                }}
              />
            ))}
            {isLoading && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-black dark:bg-white"></span>
              </span>
            )}
          </div>
          <div ref={bottomRef} />
        </ScrollArea>
      </div>

      <div
        className={`w-full sticky bottom-0 ${
          messages.length === 0 ? "flex justify-center p-4" : "p-4"
        }`}
      >
        <div>{renderInputForm()}</div>
      </div>
    </div>
  );
}
