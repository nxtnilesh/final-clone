"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UIMessage } from "ai";
import {
  Check,
  Copy,
  Edit,
  ThumbsDown,
  ThumbsUp
} from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { irBlack } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import remarkGfm from "remark-gfm";

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
      className={`flex items-start gap-3 mb-6 px-4  ${
        isUser ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`group text-black dark:text-white relative transition-all bg-transparent overflow-x-auto w-full ${
          isUser
            ? `${
                isEditing ? "w-full" : "w-auto"
              } px-3 py-1 bg-gray-50 dark:bg-neutral-800`
            : "p-2 w-full md:max-w-3xl"
        }`}
      >
        <div className="flex flex-col gap-2 max-w-3xl">
          {isEditing ? (
            <div className="w-full flex flex-col items-end">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full min-h-[100px] bg-white dark:bg-neutral-800 text-black dark:text-white placeholder:text-muted-foreground dark:placeholder:text-neutral-400 border border-gray-300 dark:border-neutral-600 outline-none focus:ring-0 shadow-sm resize-none"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
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
              className={`max-w-3xl flex ${
                isUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={` ${
                  isUser
                    ? "justify-end bg-gray-200 dark:bg-neutral-600 px-3 pt-2 rounded-2xl"
                    : "justify-start"
                }`}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ inline, className, children, ...rest }: any) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <div className="w-[200px] sm:w-full overflow-x-auto rounded-md my-2">
                          <SyntaxHighlighter
                            style={irBlack}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              borderRadius: "0.5rem",
                              fontSize: "0.875rem",
                              width: "100%", // Makes it fully responsive
                              maxWidth: "100%", // Prevents overflow
                              overflowX: "auto", // Enables horizontal scrolling if needed
                            }}
                            {...rest}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        </div>
                      ) : (
                        <code
                          className="bg-muted dark:bg-neutral-700 px-1.5 py-0.5 rounded text-sm font-mono break-words"
                          {...rest}
                        >
                          {children}
                        </code>
                      );
                    },
                    h1: (props) => (
                      <h1
                        className="text-2xl font-bold mt-6 mb-2 text-black dark:text-white"
                        {...props}
                      />
                    ),
                    h2: (props) => (
                      <h2
                        className="text-xl font-semibold mt-5 mb-2 text-black dark:text-white"
                        {...props}
                      />
                    ),
                    h3: (props) => (
                      <h3
                        className="text-lg font-semibold mt-4 mb-1 text-black dark:text-white"
                        {...props}
                      />
                    ),
                    hr: () => (
                      <hr className="my-6 border-t border-muted dark:border-neutral-600" />
                    ),
                    p: (props) => (
                      <p
                        className="mb-4 leading-relaxed text-base text-black dark:text-white"
                        {...props}
                      />
                    ),
                    li: (props) => (
                      <li
                        className="ml-6 list-disc leading-relaxed text-black dark:text-white"
                        {...props}
                      />
                    ),
                    ul: (props) => (
                      <ul
                        className="mb-4 list-disc list-outside pl-4 text-black dark:text-white"
                        {...props}
                      />
                    ),
                    ol: (props) => (
                      <ol
                        className="mb-4 list-decimal list-outside pl-4 text-black dark:text-white"
                        {...props}
                      />
                    ),
                    blockquote: (props) => (
                      <blockquote
                        className="border-l-4  italic text-muted-foreground dark:text-neutral-400 my-4"
                        {...props}
                      />
                    ),
                    a: (props) => (
                      <a
                        className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                        {...props}
                      />
                    ),
                    img: (props) => (
                      <img
                        className="rounded-md shadow-md my-4 max-w-full h-auto"
                        alt={props.alt || ""}
                        {...props}
                      />
                    ),
                    strong: (props) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    em: (props) => <em className="italic" {...props} />,
                    table: (props) => (
                      <div className="overflow-x-auto my-4">
                        <table
                          className="w-full border-collapse border border-muted dark:border-neutral-600"
                          {...props}
                        />
                      </div>
                    ),
                    th: (props) => (
                      <th
                        className="border border-muted dark:border-neutral-600 px-3 py-2 bg-muted dark:bg-neutral-800 text-left text-sm font-semibold"
                        {...props}
                      />
                    ),
                    td: (props) => (
                      <td
                        className="border border-muted dark:border-neutral-600 px-3 py-2 text-sm"
                        {...props}
                      />
                    ),
                    input: ({ type, checked, ...props }) => {
                      if (type === "checkbox") {
                        return (
                          <input
                            type="checkbox"
                            className="mr-2 accent-blue-500"
                            disabled
                            checked={checked}
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
              className={`flex opacity-0 group-hover/button:opacity-100 gap-2 mt-1 transition-opacity ${
                isUser
                  ? "group-hover:opacity-100 justify-end"
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
              {!isUser && (
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <ThumbsUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <ThumbsDown className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
