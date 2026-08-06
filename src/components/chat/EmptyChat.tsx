"use client";

export default function EmptyChat() {
  return <div className="flex flex-1 flex-col items-center justify-center bg-[#FFF8F5] p-8 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8B1E4D]/10 text-3xl">💬</div><h2 className="mt-5 text-xl font-semibold text-slate-800">No conversation selected.</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">Select an artisan to start chatting.</p></div>;
}
