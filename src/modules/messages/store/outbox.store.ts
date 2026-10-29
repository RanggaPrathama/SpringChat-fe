import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { Message, MessageStatus } from '../types/message.types'

// Messages the user sent that the server has not confirmed yet (or failed).
// Kept outside the Vue Query cache so background refetches cannot drop them.
export const useOutboxStore = defineStore('outbox', () => {
  const items = ref<Record<number, Message[]>>({})

  function forConversation(conversationId: number): Message[] {
    return items.value[conversationId] ?? []
  }

  function add(message: Message) {
    items.value[message.conversationId] = [...forConversation(message.conversationId), message]
  }

  function setStatus(conversationId: number, clientMessageId: string, status: MessageStatus) {
    items.value[conversationId] = forConversation(conversationId).map((item) =>
      item.clientMessageId === clientMessageId ? { ...item, status } : item,
    )
  }

  function remove(conversationId: number, clientMessageId: string) {
    items.value[conversationId] = forConversation(conversationId).filter(
      (item) => item.clientMessageId !== clientMessageId,
    )
  }

  function find(conversationId: number, clientMessageId: string): Message | undefined {
    return forConversation(conversationId).find((item) => item.clientMessageId === clientMessageId)
  }

  function clearAll() {
    items.value = {}
  }

  return { items, forConversation, add, setStatus, remove, find, clearAll }
})
