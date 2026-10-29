import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import type { Message } from '../types/message.types'
import { useOutboxStore } from './outbox.store'

const pending: Message = {
  id: -1,
  conversationId: 7,
  senderId: 1,
  content: 'hi',
  createdAt: new Date().toISOString(),
  clientMessageId: 'c1',
  status: 'PENDING',
}

describe('outbox store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('tracks status changes and removal per conversation', () => {
    const outbox = useOutboxStore()
    outbox.add(pending)
    outbox.setStatus(7, 'c1', 'FAILED')
    expect(outbox.forConversation(7)[0].status).toBe('FAILED')
    outbox.remove(7, 'c1')
    expect(outbox.forConversation(7)).toHaveLength(0)
  })

  it('clearAll wipes every conversation', () => {
    const outbox = useOutboxStore()
    outbox.add(pending)
    outbox.clearAll()
    expect(outbox.forConversation(7)).toEqual([])
  })
})
