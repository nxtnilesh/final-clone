import type React from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { SidebarInset } from "@/components/ui/sidebar"

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full">
        <ChatSidebar />
        <SidebarInset className="flex-1">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  )
}
