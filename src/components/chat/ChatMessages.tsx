"use client";

import { useEffect, useRef } from "react";
import type { Message } from "@/types/chat";
import MessageBubble from "./MessageBubble";

export default function ChatMessages({ messages, currentUserId }: { messages: Message[]; currentUserId?: string }) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  return <div className="chat-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#FFF8F5] p-5 sm:p-6">{messages.length === 0 ? <p className="m-auto text-sm text-slate-500">No messages yet.</p> : messages.map((message) => <MessageBubble key={message.id} message={message} isOwn={message.senderId === currentUserId} />)}<div ref={endRef} /></div>;
}
