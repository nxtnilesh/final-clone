'use client'
import { ChatInterface } from "@/components/chat/chat-interface";
import { useParams } from "next/navigation";
// interface ChatPageProps {
//   params: {
//     chatId: string;
//   };
// }

export default function ChatPage() {
  const params = useParams<{ chatId: string; }>();
  return <ChatInterface chatId={params.chatId} />;
}
