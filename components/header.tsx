"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Sparkles, Share, MoreHorizontal } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { useChatStore } from "@/lib/store";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  const { sidebarOpen } = useChatStore();
  const router = useRouter();

  return (
    <header className=" flex h-14 w-full items-center justify-between gap-4 border-b  px-4 md:px-6">
      <div className="text-black">

      {!sidebarOpen && <SidebarTrigger size={"icon"}/>}
      </div>
      
      {/* ChatGPT Title - hidden on small screens */}
      <div className="hidden md:flex w-full items-center gap-2 text-lg font-medium text-black">
        <span>ChatGPT</span>
        {/* <ChevronDown className="h-4 w-4 text-gray-400" /> */}
      </div>

      {/* Get Plus button */}
      <div  onClick={(e) => {
            router.push(`/pricing`);
          }} className="flex items-center justify-center sm:justify-start gap-4 w-full ">
        <Badge className="bg-[#3d2a88] hover:cursor-pointer flex items-center justify-center px-3 py-1 text-xs text-white rounded-full hover:bg-[#584899]/90">
          <Sparkles className="mr-2 h-4 w-4 " />
          Get Plus
        </Badge>
      </div>
  <ThemeToggle/>
      {/* Right side actions */}
      <div className="flex items-center justify-center bg-re gap-2">
        
      
        {/* <Button
          variant="ghost"
          className="text-black hover:bg-gray-200 rounded-3xl"
        >
          <Share className="h-4 w-4 mr-0 md:mr-2" />
          <span className="hidden md:inline">Share</span>
        </Button> */}

        {/* More Options */}
        {/* <Button
          variant="ghost"
          size="icon"
          className="text-black hover:bg-gray-200"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button> */}

        {/* UserButton - hidden on small screens */}
        <div className="hidden md:flex items-center justify-center">
          <button className="bg-transparent rounded-full p-1 hover:bg-gray-200 flex items-center justify-center">
            <UserButton />
          </button>
        </div>
      </div>
    </header>
  );
}
