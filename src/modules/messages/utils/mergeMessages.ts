import type { Message } from '../types/message.types'

export function messageKey(message: Message): string {
  return message.clientMessageId ?? String(message.id)
}

/**
 * Combine server history with locally queued (pending/failed) messages.
 * Dedupes by id, then by clientMessageId, so a realtime echo or a refetch
 * never shows the same message twice. Result is chronological.
 */
export function mergeMessages(server: Message[], outbox: Message[]): Message[] {
  const byId = new Map<number, Message>()
  const clientIds = new Set<string>()

  for (const message of server) {
    if (byId.has(message.id)) continue
    byId.set(message.id, message)
    if (message.clientMessageId) clientIds.add(message.clientMessageId)
  }

  const queued = outbox.filter((item) => !item.clientMessageId || !clientIds.has(item.clientMessageId))

  return [...byId.values(), ...queued].sort((a, b) => {
    const aPending = a.id < 0
    const bPending = b.id < 0
    if (aPending !== bPending) return aPending ? 1 : -1
    return a.createdAt === b.createdAt ? a.id - b.id : a.createdAt.localeCompare(b.createdAt)
  })
}
