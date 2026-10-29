import { type InfiniteData, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'

import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/modules/auth/store/auth.store'

import { messagesService } from '../services/messages.service'
import { useOutboxStore } from '../store/outbox.store'
import type { Message, MessagePage } from '../types/message.types'

export const MAX_MESSAGE_LENGTH = 5000

let tempId = -1

export function validateMessage(raw: string): string | null {
  const content = raw.trim()
  if (content.length === 0) return null
  return content.length > MAX_MESSAGE_LENGTH ? null : content
}

export function useSendMessage(conversationId: Ref<number>) {
  const authStore = useAuthStore()
  const outbox = useOutboxStore()
  const queryClient = useQueryClient()

  function storeCanonical(saved: Message) {
    queryClient.setQueryData<InfiniteData<MessagePage, string | undefined>>(
      queryKeys.messages(saved.conversationId),
      (old) => {
        if (!old || old.pages.length === 0) return old
        const [first, ...rest] = old.pages
        if (first.items.some((item) => item.id === saved.id)) return old
        return { ...old, pages: [{ ...first, items: [saved, ...first.items] }, ...rest] }
      },
    )
    queryClient.invalidateQueries({ queryKey: queryKeys.conversations })
  }

  async function deliver(message: Message) {
    const clientMessageId = message.clientMessageId as string
    outbox.setStatus(message.conversationId, clientMessageId, 'PENDING')
    try {
      const saved = await messagesService.send(message.conversationId, {
        content: message.content,
        clientMessageId,
      })
      storeCanonical(saved)
      outbox.remove(message.conversationId, clientMessageId)
    } catch {
      outbox.setStatus(message.conversationId, clientMessageId, 'FAILED')
    }
  }

  /** Returns true when the text was accepted (and the composer may clear). */
  function send(raw: string): boolean {
    const content = validateMessage(raw)
    const me = authStore.user
    if (!content || !me) return false

    const message: Message = {
      id: tempId--,
      conversationId: conversationId.value,
      senderId: me.id,
      content,
      createdAt: new Date().toISOString(),
      clientMessageId: crypto.randomUUID(),
      status: 'PENDING',
    }
    outbox.add(message)
    void deliver(message)
    return true
  }

  function retry(clientMessageId: string) {
    const message = outbox.find(conversationId.value, clientMessageId)
    if (message) void deliver(message)
  }

  function discard(clientMessageId: string) {
    outbox.remove(conversationId.value, clientMessageId)
  }

  return { send, retry, discard }
}
