"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChats } from "@/hooks/use-chats";
import { Edit, MessageCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChatData {
  _id: string;
  title: string;
}

export function ChatSearchDialog({
  open,
  onOpenChange,
}: ChatSearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredChats, setFilteredChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { searchChatTitle } = useChats();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search-chats?title=${debouncedSearchTerm}&page=1&limit=10`
        );
        const data = await res.json();
        setFilteredChats(data.chats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
        setFilteredChats([]);
      } finally {
        setLoading(false);
      }
    };

    if (debouncedSearchTerm.trim() !== "") {
      fetchChats();
    } else {
      setFilteredChats([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-none rounded-3xl shadow-lg max-w-2xl w-full bg-white dark:bg-neutral-900 text-black dark:text-white">
        <DialogHeader className="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-black dark:text-white" />
            <Input
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg text-black dark:text-white placeholder:text-neutral-400 
             border-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 bg-transparent"
              style={{ boxShadow: "none" }}
            />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] py-2">
          <div className="px-4 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => {
                onOpenChange(false);
                router.push(`/chat/`);
              }}
            >
              <Edit className="w-4 h-4 mr-2 text-black dark:text-white" />
              New chat
            </Button>
          </div>

          <div className="px-4 py-2 text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            Search Results
          </div>

          {loading ? (
            <div className="px-4 py-2 text-sm text-black dark:text-white text-center">
              Loading...
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="px-4 py-2 text-sm text-black dark:text-white text-center">
              No matching chats found.
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div key={chat._id} className="px-4 py-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  onClick={() => {
                    onOpenChange(false);
                    router.push(`/chat/${chat._id}`);
                  }}
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-neutral-400 dark:text-neutral-500" />
                  <span className="truncate">{chat.title}</span>
                </Button>
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
