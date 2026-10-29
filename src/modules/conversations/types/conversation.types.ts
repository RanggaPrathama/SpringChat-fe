import type { Message } from '@/modules/messages/types/message.types'
import type { ID, User } from '@/modules/users/types/user.types'

export type ConversationType = 'PRIVATE' | 'GROUP'

export interface ConversationSummary {
  id: ID
  type: ConversationType
  name: string | null
  participants: User[]
  lastMessage: Message | null
  unreadCount: number
  updatedAt: string
}

export type Conversation = ConversationSummary

export type CreateConversationRequest =
  | { type: 'PRIVATE'; memberIds: ID[] }
  | { type: 'GROUP'; name: string; memberIds: ID[] }
