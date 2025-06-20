"use client";

import { useState } from "react";
import { Copy, Check, Edit, X, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
  };
  onEdit?: (id: string, content: string) => void;
}

export function ChatMessage({ message, onEdit }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { toast } = useToast();

  const isUser = message.role === "user";

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Copied to clipboard", duration: 2000 });
    } catch (err) {
      toast({
        title: "Failed to copy",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleSaveEdit = () => {
    onEdit?.(message.id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-start gap-3 mb-6 px-4 w-full ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <Card
        className={`group relative transition-all overflow-x-auto w-full ${
          isUser
            ? `${
                isEditing ? "w-full" : "w-auto"
              } bg-neutral-700 px-3 py-1 text-white dark:text-white`
            : "bg-neutral-900 text-muted-foreground p-2 w-full md:max-w-3xl border-none"
        }`}
      >
        <div className="flex flex-col gap-2 w-full">
          {isEditing ? (
            <div className="w-full flex flex-col items-end ">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className=" w-full min-h-[100px] bg-transparent text-white placeholder:text-muted-foreground border-none outline-none focus:outline-none focus:ring-0 shadow-none resize-none"
              />

              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleSaveEdit}>
                  <Check className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cencel
                </Button>
              </div>
            </div>
          ) : (
            <div className="">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code(props: any) {
                    const { inline, className, children, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...rest}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code className={className} {...rest}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {!isEditing && (
          <div
            className={` flex justify-end  gap-2 mt-2 transition-opacity ${
              isUser ? " group-hover:opacity-100" : "opacity-100"
            }`}
          >
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleCopy(message.content)}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
            {isUser && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
