export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  body: string;
  readAt: string | null;
  sentAt: string;
}

export interface MessageInput {
  threadId: string;
  body: string;
  readAt?: string | null;
}

export type MessagePatch = Partial<MessageInput>;
