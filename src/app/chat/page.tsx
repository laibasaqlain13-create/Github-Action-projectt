import type { Metadata } from "next";
import ChatBox from "@/components/chat/ChatBox";

export const metadata: Metadata = { title: "Messages | HunarConnect" };

export default function ChatPage({ searchParams }: { searchParams: { artisanId?: string } }) {
  return <ChatBox artisanId={searchParams.artisanId} fullHeight />;
}
