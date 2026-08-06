export type SenderType = "customer" | "artisan";

export interface Conversation {
  id: string;
  customerId: string;
  artisanId: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: SenderType;
  message: string;
  createdAt: string;
  isRead: boolean;
}

/** Presentation data returned by the future conversation-list API query. */
export interface ConversationListItem extends Conversation {
  participantName: string;
  participantInitials: string;
  participantAvatar?: string;
  category: string;
  city?: string;
  isOnline: boolean;
  lastSeenAt?: string;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount: number;
}

export interface CreateConversationInput {
  artisanId: string;
}

export interface SendMessageInput {
  conversationId: string;
  message: string;
}
