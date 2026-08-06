"use client";

import { FormEvent, useState } from "react";

export default function MessageInput({ onSend }: { onSend: (message: string) => void }) {
  const [message, setMessage] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage("");
  }

  return <form onSubmit={submit} className="flex items-center gap-3 rounded-xl border border-[#E9D9D1] bg-[#FFF8F5] p-2 focus-within:border-[#8B1E4D]"><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Type your message..." className="min-w-0 flex-1 border-none bg-transparent px-4 py-2 text-sm text-slate-700 outline-none" /><button type="submit" disabled={!message.trim()} className="rounded-xl bg-[#8B1E4D] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6F173D] disabled:cursor-not-allowed disabled:opacity-40">Send</button></form>;
}
