import { describe, expect, it } from 'vitest'

import type { ConversationSummary } from '../types/conversation.types'
import { getConversationSubtitle, getConversationTitle, getPeer } from './conversation'

const me = { id: 1, username: 'me', displayName: 'Me', avatarUrl: null }
const ava = { id: 2, username: 'ava', displayName: 'Ava', avatarUrl: null }
const sam = { id: 3, username: 'sam', displayName: 'Sam', avatarUrl: null }

const base = { lastMessage: null, unreadCount: 0, updatedAt: '2026-01-01T00:00:00Z' }
const direct: ConversationSummary = { ...base, id: 1, type: 'PRIVATE', name: null, participants: [me, ava] }
const group: ConversationSummary = { ...base, id: 2, type: 'GROUP', name: 'Hikers', participants: [me, ava, sam] }

describe('conversation utils', () => {
  it('uses the other participant for direct chats', () => {
    expect(getPeer(direct, 1)?.id).toBe(2)
    expect(getConversationTitle(direct, 1)).toBe('Ava')
    expect(getConversationSubtitle(direct, 1)).toBe('@ava')
  })

  it('uses name and member count for groups', () => {
    expect(getPeer(group, 1)).toBeNull()
    expect(getConversationTitle(group, 1)).toBe('Hikers')
    expect(getConversationSubtitle(group, 1)).toBe('3 members')
  })
})
