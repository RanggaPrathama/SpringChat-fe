import type { InfiniteData } from '@tanstack/vue-query'
import { describe, expect, it } from 'vitest'

import type { Message, MessagePage } from '../types/message.types'
import { mergeLatest } from './mergeLatest'

const msg = (id: number): Message => ({ id, conversationId: 1, senderId: 1, content: `m${id}`, createdAt: '2026-01-01T00:00:00Z' })
const data = (pages: MessagePage[]): InfiniteData<MessagePage, string | undefined> => ({
  pages,
  pageParams: pages.map(() => undefined),
})

describe('mergeLatest', () => {
  it('prepends new messages to the first page only and keeps older pages untouched', () => {
    const old = data([
      { items: [msg(30), msg(29)], nextCursor: '29' },
      { items: [msg(28), msg(27)], nextCursor: null },
    ])
    const merged = mergeLatest(old, { items: [msg(31), msg(30)], nextCursor: '30' })
    expect(merged.pages[0].items.map((item) => item.id)).toEqual([31, 30, 29])
    expect(merged.pages[0].nextCursor).toBe('29')
    expect(merged.pages[1]).toBe(old.pages[1])
  })

  it('returns the same reference when nothing is new', () => {
    const old = data([{ items: [msg(2), msg(1)], nextCursor: null }])
    expect(mergeLatest(old, { items: [msg(2), msg(1)], nextCursor: null })).toBe(old)
  })
})
