import { type InfiniteData, useQueryClient } from '@tanstack/vue-query'
import { onMounted, onUnmounted, type Ref, watch } from 'vue'

import { queryKeys } from '@/lib/queryKeys'

import { messagesService } from '../services/messages.service'
import type { MessagePage } from '../types/message.types'
import { mergeLatest } from '../utils/mergeLatest'

const POLL_INTERVAL_MS = 4000

/**
 * Polling stand-in for STOMP (Milestone 4 swaps the transport, keeps this contract):
 * fetch the newest page, merge it into the cache, resync when the tab or network returns.
 */
export function useChatRealtime(conversationId: Ref<number>, enabled: Ref<boolean>) {
  const queryClient = useQueryClient()
  let timer: ReturnType<typeof setInterval> | undefined
  let inFlight = false

  async function poll() {
    if (!enabled.value || inFlight || document.visibilityState === 'hidden') return
    inFlight = true
    const id = conversationId.value
    try {
      const latest = await messagesService.getPage(id)
      queryClient.setQueryData<InfiniteData<MessagePage, string | undefined>>(queryKeys.messages(id), (old) =>
        old ? mergeLatest(old, latest) : old,
      )
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations })
    } catch {
      // transient failure: the next tick or reconnect retries
    } finally {
      inFlight = false
    }
  }

  function start() {
    stop()
    timer = setInterval(poll, POLL_INTERVAL_MS)
  }

  function stop() {
    if (timer) clearInterval(timer)
    timer = undefined
  }

  const resync = () => void poll()

  onMounted(() => {
    start()
    window.addEventListener('online', resync)
    document.addEventListener('visibilitychange', resync)
  })

  onUnmounted(() => {
    stop()
    window.removeEventListener('online', resync)
    document.removeEventListener('visibilitychange', resync)
  })

  watch(conversationId, () => void poll())
}
