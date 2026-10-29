import type { ID } from '@/modules/users/types/user.types'

export type MessageStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'

export interface Message {
  id: ID
  conversationId: ID
  senderId: ID
  content: string
  createdAt: string
  clientMessageId?: string
  status?: MessageStatus
}

export interface MessagePage {
  items: Message[]
  nextCursor: string | null
}

export interface SendMessageRequest {
  content: string
  clientMessageId?: string
}

export interface MessageCreatedEvent {
  eventId: string
  type: 'MESSAGE_CREATED'
  conversationId: ID
  message: Message
}
