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
import { Textarea } from "../ui/textarea";
import { FaStopCircle } from "react-icons/fa";
import { ChatFileUploader } from "./chat-file-upload";
import useSpeechRecognition from "@/hooks/use-speechRecogination";
import Header from "../header";
import Image from "next/image";

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

  const renderInputForm = () => (
    <div className="max-w-4xl w-full mx-auto  ">
      {messages.length === 0 ? (
        <div className="text-center  py-6">
          <h2 className="text-2xl font-semibold mb-2">
            What are you working on?
          </h2>
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="mx-3 flex flex-col  rounded-3xl  border shadow-lg p-1  light:bg-neutral-100  light:border-neutral-200"
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
          className=" px-3 pt-3 text-black focus:border-none focus:outline-none w-full resize-none overflow-y-auto placeholder:text-black bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[40px] max-h-[420px]"
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
              append({
                role: "user",
                content: `content: ![Uploaded Image](${url}),`,
                // content: `[
                //   {
                //     type: "text",
                //     text: ${input},
                    
                //   },
                //   {
                //     type: "image",
                //     image: ${url},
                //   },
                // ],`,
              });
            }}
          />
          <div className="w-full"></div>
          <button
            disabled={isLoading}
            onClick={() => setIsSpeechActive(!isSpeechActive)}
          >
            {isListening ? (
              <Pause className="h-5 w-5 text-blue-600" />
            ) : (
              <Mic className="h-9 w-9 hover:bg-gray-200 p-2 rounded-full font-extrabold mx-2  text-black" />
            )}
          </button>
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            // size="icon"
          >
            {status === "ready" ? (
              <ArrowUp className="h-9 w-9 hover:bg-gray-200 p-1 rounded-full font-extrabold mx-2  text-black" />
            ) : (
              <FaStopCircle className="bg-white font-extrabold w-6 h-6" />
            )}
          </button>
        </div>
      </form>
      <p
        className="text-gray-900 text-[10px] text-center mt-1
      "
      >
        ChatGPT can make mistakes. Check important info. See Cookie Preferences.
      </p>
    </div>
  );

  if (isLoadingCurrentChat) {
    return (
      <div className="flex items-center justify-center h-full ">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  if (messages.length === 0)
    return (
      <div className="flex flex-col min-h-screen ">
        {/* Sticky Header at the Top */}
        <div className="sticky top-0 z-50 w-full">
          <Header />
        </div>

        {/* Centered Form */}
        <div className="flex-1 grid place-items-center">
          {renderInputForm()}
        </div>
      </div>
    );

  return (
    <div
      className={` min-h-screen  text-white light:bg-white light:text-black `}
    >
      <div className="sticky top-0 z-50 w-full">
        {/* Header */}
        <Header />
      </div>

      <div className="max-w-4xl  mx-auto">
        {/* Messages */}
        <ScrollArea className="max-w-4xl   h-[calc(80vh-2rem)] p-4  ">
          <div className="max-w-4xl mx-auto bg-re">
            {messages.map((message) => (
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
            ))}

            {isLoading && (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-black "></span>
              </span>
            )}
          </div>
          <div ref={bottomRef} />
        </ScrollArea>
      </div>

      {/* Input */}
      <div
        className={`w-full sticky bottom-0  ${
          messages.length === 0 ? " flex  justify-center p-4" : "p-4 "
        }`}
      >
        <div>{renderInputForm()}</div>
      </div>
    </div>
  );
}
