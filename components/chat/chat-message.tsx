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
import { UIMessage } from "ai";

interface ChatMessageProps {
  message: UIMessage;
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

  console.log("message", message);

  const handleSaveEdit = () => {
    console.log("edit message", editContent);

    onEdit?.(message.id, editContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(message.content);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex items-start gap-3 mb-6 px-4 w-full  ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`group text-black relative transition-all bg-transparent overflow-x-auto w-full ${
          isUser
            ? `${
                isEditing ? "w-full" : "w-auto"
              }  px-3 py-1 text-black bg-gray-50 dark:text-white`
            : "p-2 w-full md:max-w-3xl border-none"
        }`}
      >
        <div className="flex flex-col gap-2 max-w-3xl">
          {isEditing ? (
            <div className="w-full flex flex-col items-end">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[100px] bg-transparent text-black placeholder:text-muted-foreground border-none outline-none focus:outline-none focus:ring-0 shadow-sm resize-none border"
                autoFocus={true}
              />
              <div className="flex gap-2 mt-2 ">
                <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveEdit}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={`flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div className={` ${
                isUser ? "justify-end bg-gray-200 px-3 pt-2 rounded-2xl" : "justify-start"
              }`}>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...rest }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={
                            {
                              padding: "1rem",
                              borderRadius: "0.5rem",
                              fontSize: "0.875rem",
                              overflowX: "auto",
                            } as React.CSSProperties
                          }
                          {...rest}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono break-words"
                          {...rest}
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: ({ node, ...props }) => (
                      <h1 className="text-2xl font-bold mt-6 mb-2" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <h2
                        className="text-xl font-semibold mt-5 mb-2"
                        {...props}
                      />
                    ),
                    h3: ({ node, ...props }) => (
                      <h3
                        className="text-lg font-semibold mt-4 mb-1"
                        {...props}
                      />
                    ),
                    hr: () => <hr className="my-6 border-t border-muted" />,
                    p: ({ node, ...props }) => (
                      <p
                        className="mb-4 leading-relaxed text-base"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li
                        className="ml-6 list-disc leading-relaxed"
                        {...props}
                      />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="mb-4 list-disc list-outside pl-4"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="mb-4 list-decimal list-outside pl-4"
                        {...props}
                      />
                    ),
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 pl-4 italic text-muted-foreground my-4"
                        {...props}
                      />
                    ),
                    a: ({ node, ...props }) => (
                      <a
                        className="text-blue-600 underline hover:text-blue-800 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    img: ({ node, ...props }) => (
                      <img
                        className="rounded-md shadow-md my-4 max-w-full h-auto"
                        alt={props.alt || ""}
                        {...props}
                      />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto my-4">
                        <table
                          className="w-full border-collapse border border-muted"
                          {...props}
                        />
                      </div>
                    ),
                    th: ({ node, ...props }) => (
                      <th
                        className="border border-muted px-3 py-2 bg-muted text-left text-sm font-semibold"
                        {...props}
                      />
                    ),
                    td: ({ node, ...props }) => (
                      <td
                        className="border border-muted px-3 py-2 text-sm"
                        {...props}
                      />
                    ),
                    input: ({ node, ...props }) => {
                      if (props.type === "checkbox") {
                        return (
                          <input
                            type="checkbox"
                            className="mr-2 accent-blue-500"
                            disabled
                            checked={props.checked}
                          />
                        );
                      }
                      return <input {...props} />;
                    },
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          )}
          {!isEditing && (
            <div
              className={`flex opacity-0  group-hover/button:opacity-100  gap-2 mt-1 transition-opacity ${
                isUser
                  ? "group-hover:opacity-100 justify-end "
                  : "opacity-100 justify-start"
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
        </div>
      </div>
    </div>
  );
}
