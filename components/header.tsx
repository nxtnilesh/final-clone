"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown, Sparkles, Share, MoreHorizontal } from "lucide-react";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { useChatStore } from "@/lib/store";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  const { isMobile, open } = useSidebar();
  const router = useRouter();

  return (
    <header className="bg-white dark:bg-neutral-800 flex h-14 w-full items-center justify-between gap-4 border-b border-gray-200 dark:border-neutral-600 px-4 md:px-6">
      <div className="text-black dark:text-white">
        {isMobile && <SidebarTrigger size="icon" />}
        {!isMobile && !open && <SidebarTrigger size="icon" />}
      </div>

      {/* ChatGPT Title - hidden on small screens */}
      <div className="hidden md:flex w-full items-center gap-2 text-lg font-medium text-black dark:text-white">
        <span>ChatGPT</span>
      </div>

      {/* Get Plus button */}
      <div className="flex items-center justify-center sm:justify-start gap-4 w-full">
        <Badge
          onClick={() => router.push(`/pricing`)}
          className="bg-[#3d2a88] hover:cursor-pointer flex items-center justify-center px-3 py-1 text-xs text-white rounded-full hover:bg-[#584899]/90"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Get Plus
        </Badge>
      </div>

      

      {/* Right side actions */}
      <div className="flex items-center justify-center gap-2">
        {/* Uncomment below if needed */}
        {/* <Button
          variant="ghost"
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600 rounded-3xl"
        >
          <Share className="h-4 w-4 mr-0 md:mr-2" />
          <span className="hidden md:inline">Share</span>
        </Button> */}

        {/* <Button
          variant="ghost"
          size="icon"
          className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-neutral-600"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">More options</span>
        </Button> */}

        {/* User Button */}
        <div className="md:flex items-center justify-center">
          <button className="bg-transparent rounded-full p-1  flex items-center justify-center">
            <ThemeToggle />
            <UserButton />
          </button>
        </div>
      </div>
    </header>
  );
}
