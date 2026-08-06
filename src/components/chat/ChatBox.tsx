"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import type { ConversationListItem, Message } from "@/types/chat";
import { useAuth } from "@/context/AuthContext";
import { dummyArtisans, dummyCustomers, dummyMessages } from "@/data/dummyChat";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ConversationList from "./ConversationList";
import EmptyChat from "./EmptyChat";
import MessageInput from "./MessageInput";
import { notifyUnreadMessageCountChanged } from "@/hooks/useUnreadMessageCount";

type ChatRole = "customer" | "artisan";
type ChatBoxProps = { role?: ChatRole; artisanId?: string; onClose?: () => void; fullHeight?: boolean };
type ApiChat = { id: number; customerId: number; artisanId: number; createdAt: string; artisan?: { fullName: string; businessName: string; profileImage?: string | null }; customer?: { fullName: string }; messages?: Array<{ message: string; createdAt: string }>; _count?: { messages: number } };
type ApiArtisan = { id: number; fullName: string; businessName: string; profileImage?: string | null; artisanCategories?: Array<{ category?: { categoryName?: string } }> };
type ApiMessage = { id: number; senderId: number; message: string; createdAt: string; isRead: boolean };

export type ChatBoxHandle = { focus: () => void };

function initials(name: string) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }

function apiConversation(chat: ApiChat, role: ChatRole): ConversationListItem {
  const name = role === "customer" ? chat.artisan?.businessName || chat.artisan?.fullName || "Artisan" : chat.customer?.fullName || "Customer";
  return { id: String(chat.id), customerId: String(chat.customerId), artisanId: String(chat.artisanId), createdAt: chat.createdAt, participantName: name, participantInitials: initials(name), participantAvatar: role === "customer" ? chat.artisan?.profileImage ?? undefined : undefined, category: role === "customer" ? "Artisan" : "Customer", isOnline: true, lastMessage: chat.messages?.[0]?.message, lastMessageAt: chat.messages?.[0]?.createdAt, unreadCount: chat._count?.messages ?? 0 };
}

function artisanConversation(artisan: ApiArtisan | typeof dummyArtisans[number], dummy = false): ConversationListItem {
  const name = "businessName" in artisan ? artisan.businessName || artisan.fullName : artisan.name;
  return { id: dummy ? `dummy-artisan-${artisan.id}` : `artisan-draft-${artisan.id}`, customerId: "", artisanId: String(artisan.id), createdAt: new Date().toISOString(), participantName: name, participantInitials: initials(name), participantAvatar: "image" in artisan ? artisan.image : artisan.profileImage ?? undefined, category: "category" in artisan ? artisan.category : artisan.artisanCategories?.[0]?.category?.categoryName || "Artisan", isOnline: true, unreadCount: 0 };
}

function customerConversation(customer: typeof dummyCustomers[number]): ConversationListItem {
  return { id: `dummy-customer-${customer.id}`, customerId: String(customer.id), artisanId: "", createdAt: new Date().toISOString(), participantName: customer.name, participantInitials: initials(customer.name), category: "Customer", isOnline: true, lastMessage: customer.lastMessage, lastMessageAt: new Date().toISOString(), unreadCount: 0 };
}

function apiMessage(message: ApiMessage, currentUserId: string, role: ChatRole, conversationId: string): Message {
  const own = String(message.senderId) === currentUserId;
  return { id: String(message.id), conversationId, senderId: String(message.senderId), senderType: own ? role : role === "customer" ? "artisan" : "customer", message: message.message, createdAt: message.createdAt, isRead: message.isRead };
}

function dummyMessage(sender: "customer" | "artisan", text: string, conversationId: string, index: number): Message {
  return { id: `dummy-message-${conversationId}-${index}`, conversationId, senderId: sender, senderType: sender, message: text, createdAt: new Date(Date.now() - (dummyMessages.length - index) * 60000).toISOString(), isRead: true };
}

const ChatBox = forwardRef<ChatBoxHandle, ChatBoxProps>(function ChatBox({ role: requestedRole, artisanId, onClose, fullHeight = false }, ref) {
  const { authState, isLoading: isAuthLoading } = useAuth();
  const role = requestedRole ?? authState.role ?? "customer";
  const currentUserId = String(authState.id ?? "");
  const panelRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(true);
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [selectedId, setSelectedId] = useState<string>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loaded, setLoaded] = useState(false);

  const selected = conversations.find((item) => item.id === selectedId);
  const dummySelected = selectedId?.startsWith("dummy-") ?? false;
  const displayUserId = dummySelected ? role : currentUserId;

  useImperativeHandle(ref, () => ({ focus: () => panelRef.current?.focus({ preventScroll: true }) }));

  useEffect(() => {
    if (isAuthLoading) return;
    let cancelled = false;
    async function load() {
      const response = await fetch("/api/chats");
      const data = response.ok ? await response.json() as { chats: ApiChat[] } : { chats: [] };
      const real = (data.chats ?? []).map((chat) => apiConversation(chat, role));
      if (role === "customer") {
        const artisanResponse = await fetch("/api/artisans");
        const artisanData = artisanResponse.ok ? await artisanResponse.json() as { artisans: ApiArtisan[] } : { artisans: [] };
        const artisans = artisanData.artisans ?? [];
        const existing = new Set(real.map((item) => item.artisanId));
        const drafts = artisans.length > 0
          ? artisans.filter((item) => !existing.has(String(item.id))).map((item) => artisanConversation(item))
          : process.env.NODE_ENV !== "production" ? dummyArtisans.map((item) => artisanConversation(item, true)) : [];
        if (!cancelled) setConversations([...real, ...drafts]);
      } else if (!cancelled) {
        setConversations(real.length > 0 ? real : process.env.NODE_ENV !== "production" ? dummyCustomers.map(customerConversation) : []);
      }
      if (!cancelled) setLoaded(true);
    }
    void load();
    return () => { cancelled = true; };
  }, [isAuthLoading, role]);

  useEffect(() => {
    if (!loaded || role !== "customer" || !artisanId) return;
    const conversation = conversations.find((item) => item.artisanId === artisanId);
    if (conversation) setSelectedId(conversation.id);
  }, [artisanId, conversations, loaded, role]);

  useEffect(() => {
    if (!selectedId) { setMessages([]); return; }
    if (dummySelected) {
      setMessages(role === "artisan" ? dummyMessages.map((item, index) => dummyMessage(item.sender, item.text, selectedId, index)) : []);
      return;
    }
    let cancelled = false;
    async function loadMessages() {
      const conversationId = selectedId;
      if (!conversationId) return;
      const response = await fetch(`/api/chats/${conversationId}/messages`);
      if (!response.ok) return;
      const data = await response.json() as { messages: ApiMessage[] };
      if (!cancelled) {
        setMessages((data.messages ?? []).map((message) => apiMessage(message, currentUserId, role, conversationId)));
        notifyUnreadMessageCountChanged();
      }
    }
    void loadMessages();
    return () => { cancelled = true; };
  }, [currentUserId, dummySelected, role, selectedId]);

  async function send(message: string) {
    if (!selectedId) return;
    if (dummySelected) {
      const newMessage = dummyMessage(role, message, selectedId, messages.length);
      setMessages((current) => [...current, newMessage]);
      setConversations((current) => current.map((item) => item.id === selectedId ? { ...item, lastMessage: message, lastMessageAt: newMessage.createdAt } : item));
      return;
    }
    let conversationId = selectedId;
    if (selectedId.startsWith("artisan-draft-")) {
      const response = await fetch("/api/chats", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ artisanId: Number(selectedId.replace("artisan-draft-", "")) }) });
      if (!response.ok) return;
      const data = await response.json() as { chat: ApiChat };
      const conversation = apiConversation(data.chat, role);
      conversationId = conversation.id;
      setConversations((current) => current.map((item) => item.id === selectedId ? conversation : item));
      setSelectedId(conversation.id);
    }
    const response = await fetch(`/api/chats/${conversationId}/messages`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
    if (!response.ok) return;
    const data = await response.json() as { message: ApiMessage };
    setMessages((current) => [...current, apiMessage(data.message, currentUserId, role, conversationId)]);
    setConversations((current) => current.map((item) => item.id === conversationId ? { ...item, lastMessage: message, lastMessageAt: data.message.createdAt } : item));
    notifyUnreadMessageCountChanged();
  }

  function close() { setSelectedId(undefined); setMessages([]); if (onClose) onClose(); else setVisible(false); }
  if (!visible) return null;

  return <section ref={panelRef} tabIndex={-1} aria-label="Messages" className={`flex h-full min-w-0 flex-col overflow-hidden bg-white outline-none ${fullHeight ? "" : "rounded-3xl shadow-lg"}`}><div className="flex items-center justify-between border-b border-[#E9D9D1] px-6 py-5"><h2 className="text-xl font-bold text-[#2D1F25]">Messages</h2><button type="button" onClick={close} aria-label="Close messages" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF8F5] text-xl leading-none text-[#8B1E4D] transition hover:bg-[#8B1E4D] hover:text-white">X</button></div><div className="grid min-h-0 flex-1 grid-rows-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:grid-cols-[250px_minmax(0,1fr)] md:grid-rows-none"><ConversationList conversations={conversations} activeConversationId={selectedId} onSelect={setSelectedId} /><div className="flex min-w-0 flex-col">{selected ? <><ChatHeader conversation={selected} /><ChatMessages messages={messages} currentUserId={displayUserId} /><MessageInput onSend={send} /></> : <EmptyChat />}</div></div></section>;
});

export default ChatBox;

