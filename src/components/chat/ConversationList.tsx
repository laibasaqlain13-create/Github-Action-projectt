"use client";

import type { ConversationListItem } from "@/types/chat";

type ConversationListProps = {
  conversations: ConversationListItem[];
  activeConversationId?: string;
  onSelect: (conversationId: string) => void;
};

export default function ConversationList({ conversations, activeConversationId, onSelect }: ConversationListProps) {
  return <aside className="flex h-full min-h-0 flex-col border-b border-[#E9D9D1] bg-white md:border-b-0 md:border-r"><div className="chat-scroll min-h-0 flex-1 overflow-y-auto">{conversations.length === 0 ? <p className="p-6 text-center text-sm text-slate-500">No conversations yet.</p> : conversations.map((conversation) => <button key={conversation.id} type="button" onClick={() => onSelect(conversation.id)} className={`flex w-full gap-3 border-b border-[#F3E8E4] p-4 text-left transition ${conversation.id === activeConversationId ? "bg-[#FFF0ED]" : "hover:bg-[#FFF8F5]"}`}><div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#8B1E4D]/10 font-semibold text-[#8B1E4D]">{conversation.participantAvatar ? <img src={conversation.participantAvatar} alt="" className="h-full w-full object-cover" /> : conversation.participantInitials}<span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${conversation.isOnline ? "bg-emerald-500" : "bg-slate-300"}`} /></div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><span className="truncate font-semibold text-slate-800">{conversation.participantName}</span>{conversation.lastMessageAt && <time className="text-xs text-slate-400">{new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(conversation.lastMessageAt))}</time>}</div><p className="mt-0.5 text-xs text-[#8B1E4D]">{conversation.category}</p><p className="mt-1 truncate text-sm text-slate-500">{conversation.lastMessage ?? "No messages yet."}</p></div></button>)}</div></aside>;
}

