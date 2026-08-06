"use client";

import type { ConversationListItem } from "@/types/chat";

type ChatHeaderProps = {
  conversation: ConversationListItem;
};

export default function ChatHeader({ conversation }: ChatHeaderProps) {
  const availability = conversation.isOnline
    ? "Online"
    : conversation.lastSeenAt
      ? `Last seen ${new Intl.DateTimeFormat("en", { hour: "numeric", minute: "2-digit" }).format(new Date(conversation.lastSeenAt))}`
      : "Offline";

  return (
    <header className="flex items-center gap-3 border-b border-[#E9D9D1] bg-white px-5 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#8B1E4D]/10 font-semibold text-[#8B1E4D]">
          {conversation.participantAvatar ? (
            <img src={conversation.participantAvatar} alt="" className="h-full w-full object-cover" />
          ) : (
            conversation.participantInitials
          )}
          <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${conversation.isOnline ? "bg-emerald-500" : "bg-slate-300"}`} />
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-semibold text-slate-800">{conversation.participantName}</h2>
          <p className="truncate text-xs text-slate-500">
            {conversation.category}
            {conversation.city ? ` · ${conversation.city}` : ""} · {availability}
          </p>
        </div>
      </div>

    </header>
  );
}
