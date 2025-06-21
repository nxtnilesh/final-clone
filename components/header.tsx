"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Sparkles, Share, MoreHorizontal } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { User } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between gap-4 border-b bg-[#202123] px-4 md:px-6">
      {/* <SidebarTrigger className="-ml-1 " />  */}
      <div className="flex items-center gap-2 text-lg font-medium text-white">
        <span>ChatGPT</span>
        <ChevronDown className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-[#3d2a88] flex items-center justify-center px-2 py-1 text-xs text-white rounded-full hover:bg-[#584899]/90">
          <Sparkles className="mr-2 h-4 w-4 " />
          Get Plus
        </button>

        {/* <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-[#8B5E50] text-white">N</AvatarFallback>
        </Avatar> */}
      </div>
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          className="text-white hover:bg-neutral-700 hover:text-white rounded-3xl"
        >
          <Share className="mr-2 h-4 w-4" />
          Share
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-neutral-700 hover:text-white"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button>
        <button className="bg-transparent rounded-full p-1 hover:bg-neutral-700 flex items-center justify-center">
          <UserButton />
        </button>
      </div>
    </header>
  );
}
