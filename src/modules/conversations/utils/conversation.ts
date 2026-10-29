import type { ID, User } from '@/modules/users/types/user.types'

import type { ConversationSummary } from '../types/conversation.types'

export function getPeer(conversation: ConversationSummary, meId: ID | undefined): User | null {
  if (conversation.type !== 'PRIVATE') return null
  return conversation.participants.find((participant) => participant.id !== meId) ?? null
}

export function getConversationTitle(conversation: ConversationSummary, meId: ID | undefined): string {
  if (conversation.type === 'GROUP') return conversation.name ?? 'Group'
  return getPeer(conversation, meId)?.displayName ?? conversation.name ?? 'Conversation'
}

export function getConversationSubtitle(conversation: ConversationSummary, meId: ID | undefined): string {
  if (conversation.type === 'GROUP') return `${conversation.participants.length} members`
  const peer = getPeer(conversation, meId)
  return peer ? `@${peer.username}` : ''
}
