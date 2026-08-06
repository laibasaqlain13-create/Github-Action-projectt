"use client";

import type { Message } from "@/types/chat";

export default function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}><div className={`max-w-[78%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm shadow-sm ${isOwn ? "rounded-br-md bg-[#8B1E4D] text-white" : "rounded-bl-md bg-white text-slate-700"}`}><p className="leading-6">{message.message}</p><time className={`mt-1 block text-right text-[11px] ${isOwn ? "text-white/70" : "text-slate-400"}`}>{new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(message.createdAt))}</time></div></div>;
}
