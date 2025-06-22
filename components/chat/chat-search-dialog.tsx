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
  const {searchChatTitle} = useChats()
  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch filtered chats
  useEffect(() => {
    console.log("deb",debouncedSearchTerm);
    
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/search-chats?title=${debouncedSearchTerm}&page=1&limit=10`
        );
        // const res = await searchChatTitle(debouncedSearchTerm);
        const data = await res.json();
        console.log("data", data.chats);

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
      <DialogContent className="p-0 border-none rounded-3xl shadow-lg max-w-2xl w-full  text-black">
        <DialogHeader className="p-4 border-b border-neutral-700">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-black" />
            <Input
              placeholder="Search chats..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg text-black placeholder:text-neutral-400 
             border-none ring-0 focus:outline-none focus:ring-0 focus:border-none focus:ring-offset-0 "
              style={{ boxShadow: "none" }}
            />
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] py-2">
          <div className="px-4 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start text-black hover:bg-neutral-100"
              onClick={() => {
                onOpenChange(false);
                router.push(`/chat/`);
              }}
            >
              <Edit className="w-4 h-4 mr-2 text-black" />
              New chat
            </Button>
          </div>

          <div className="px-4 py-2 text-xs font-semibold text-neutral-400">
            Search Results
          </div>

          {loading ? (
            <div className="px-4 py-2 text-sm text-black text-center">
              Loading...
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="px-4 py-2 text-sm text-black text-center">
              No matching chats found.
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div key={chat._id} className="px-4 py-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-black hover:bg-neutral-100"
                >
                  <MessageCircle className="w-4 h-4 mr-2 text-neutral-400" />
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
