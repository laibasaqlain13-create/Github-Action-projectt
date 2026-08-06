import type { Conversation, ConversationListItem, CreateConversationInput, Message, SendMessageInput } from "@/types/chat";

/**
 * Data-access boundary for the chat UI.
 * TODO: Replace each empty implementation with the corresponding authenticated
 * MySQL query (or calls to backend API endpoints). Do not query MySQL from the browser.
 */
export const chatRepository = {
  async getConversations(): Promise<ConversationListItem[]> {
    // TODO: SELECT customer/artisan conversations with participant and latest-message details.
    return [];
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    // TODO: SELECT messages WHERE conversation_id = conversationId ORDER BY created_at ASC.
    void conversationId;
    return [];
  },

  async createConversation(input: CreateConversationInput): Promise<Conversation> {
    // TODO: Verify the authenticated customer and artisan, then INSERT or return an existing conversation.
    void input;
    throw new Error("Chat database integration has not been configured.");
  },

  async sendMessage(input: SendMessageInput): Promise<Message> {
    // TODO: Verify membership, INSERT the message, and return the persisted record.
    void input;
    throw new Error("Chat database integration has not been configured.");
  },

  async markAsRead(conversationId: string): Promise<void> {
    // TODO: UPDATE messages SET is_read = true for the authenticated conversation recipient.
    void conversationId;
  },
};
