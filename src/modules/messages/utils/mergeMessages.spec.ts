import { describe, expect, it } from 'vitest'

import type { Message } from '../types/message.types'
import { mergeMessages } from './mergeMessages'

function message(id: number, createdAt: string, extra: Partial<Message> = {}): Message {
  return { id, conversationId: 1, senderId: 1, content: `m${id}`, createdAt, ...extra }
}

describe('mergeMessages', () => {
  it('returns server messages in chronological order', () => {
    const server = [message(3, '2026-01-01T10:02:00Z'), message(2, '2026-01-01T10:01:00Z')]
    expect(mergeMessages(server, []).map((item) => item.id)).toEqual([2, 3])
  })

  it('dedupes the same id across pages', () => {
    const server = [message(2, '2026-01-01T10:01:00Z'), message(2, '2026-01-01T10:01:00Z')]
    expect(mergeMessages(server, [])).toHaveLength(1)
  })

  it('drops a queued message once the server echo with the same clientMessageId arrives', () => {
    const pending = message(-1, '2026-01-01T10:05:00Z', { clientMessageId: 'abc', status: 'PENDING' })
    const echo = message(9, '2026-01-01T10:05:01Z', { clientMessageId: 'abc', status: 'SENT' })
    const merged = mergeMessages([echo], [pending])
    expect(merged).toHaveLength(1)
    expect(merged[0].id).toBe(9)
  })

  it('keeps pending and failed messages after server messages', () => {
    const server = [message(5, '2026-01-01T10:10:00Z')]
    const failed = message(-2, '2026-01-01T09:00:00Z', { clientMessageId: 'x', status: 'FAILED' })
    expect(mergeMessages(server, [failed]).map((item) => item.id)).toEqual([5, -2])
  })
})
