"use client"

import { useState } from "react"
import type { CoreMessage, UIMessage } from "ai"
import { Copy, Check, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface ChatMessageProps {
  message: UIMessage
}

export function ChatMessage({ message }: any) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content as string)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied",
        description: "Message copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy message",
        variant: "destructive",
      })
    }
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex items-start gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="w-8 h-8">
        <AvatarFallback>{isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}</AvatarFallback>
      </Avatar>

      <Card className={`flex-1 p-4 group ${isUser ? "bg-primary text-primary-foreground" : ""}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap">{message.content as string}</p>
          </div>

          {!isUser && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleCopy}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
