"use client"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Edit, MessageCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState, useEffect } from "react" // Import useEffect and useState

interface ChatSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChatSearchDialog({ open, onOpenChange }: ChatSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Placeholder data for chat history
  const allChats = [
    { id: "1", title: "Open Modal ShadCN" },
    { id: "2", title: "ChatMessage Component Update" },
    { id: "3", title: "Array Basics and Operations" },
    { id: "4", title: "Hello World Code" },
    { id: "5", title: "Requesting Help Phrasing" },
    { id: "6", title: "Center Input and Resize" },
    { id: "7", title: "Another Chat Title Example" },
    { id: "8", title: "Long Chat Title That Needs Truncation" },
    { id: "9", title: "Debouncing Search Input" },
    { id: "10", title: "Next.js Routing Example" },
  ]

  // Debounce logic
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms debounce delay

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm])

  // Filter chats based on debounced search term
  const filteredChats = allChats.filter((chat) => chat.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 border-none rounded-xl shadow-lg max-w-md w-full bg-neutral-800 text-white dark:bg-neutral-800 dark:text-white light:bg-white light:text-black"
      >
        <DialogHeader className="p-4 border-b border-neutral-700 dark:border-neutral-700 light:border-neutral-200">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-neutral-400 dark:text-neutral-400 light:text-neutral-600" />
            <Input
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-neutral-700 border-neutral-600 text-white placeholder:text-neutral-400 focus:ring-0 focus:ring-offset-0 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white dark:placeholder:text-neutral-400 light:bg-neutral-100 light:border-neutral-200 light:text-black light:placeholder:text-neutral-500"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:bg-neutral-600 hover:text-white dark:hover:bg-neutral-700 light:hover:bg-neutral-200 light:hover:text-black"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] py-2">
          <div className="px-4 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-white hover:bg-neutral-700 dark:hover:bg-neutral-700 light:hover:bg-neutral-100 light:text-black"
            >
              <Edit className="w-4 h-4 mr-2 text-neutral-400 dark:text-neutral-400 light:text-neutral-600" />
              New chat
            </Button>
          </div>

          <div className="px-4 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-400 light:text-neutral-600">
            Today
          </div>

          {filteredChats.length === 0 ? (
            <div className="px-4 py-2 text-sm text-neutral-400 text-center">No matching chats found.</div>
          ) : (
            filteredChats.map((chat) => (
              <div key={chat.id} className="px-4 py-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-neutral-700 dark:hover:bg-neutral-700 light:hover:bg-neutral-100 light:text-black"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-neutral-400 dark:text-neutral-400 light:text-neutral-600" />
                  <span className="truncate">{chat.title}</span>
                </Button>
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
