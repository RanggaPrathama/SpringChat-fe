<script setup lang="ts">
import { ArrowDown, History } from 'lucide-vue-next'
import { computed, nextTick, ref, watch } from 'vue'

import ChatBlob from '@/components/shared/decor/ChatBlob.vue'
import DotGrid from '@/components/shared/decor/DotGrid.vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { dayLabel, isSameDay } from '@/lib/format'
import type { ID, User } from '@/modules/users/types/user.types'

import { useScrollAnchor } from '../composables/useScrollAnchor'
import type { Message } from '../types/message.types'
import { messageKey } from '../utils/mergeMessages'
import DateSeparator from './DateSeparator.vue'
import MessageBubble from './MessageBubble.vue'

const props = defineProps<{
  messages: Message[]
  currentUserId: ID
  participants: User[]
  isGroup: boolean
  isPending: boolean
  hasOlder: boolean
  isFetchingOlder: boolean
}>()

const emit = defineEmits<{
  loadOlder: []
  retry: [clientMessageId: string]
  discard: [clientMessageId: string]
}>()

type Row =
  | { kind: 'date'; key: string; label: string }
  | { kind: 'message'; key: string; message: Message; senderName?: string }

const rows = computed<Row[]>(() => {
  const result: Row[] = []
  let previous: Message | null = null

  for (const message of props.messages) {
    const newDay =
      !previous || !isSameDay(new Date(previous.createdAt), new Date(message.createdAt))
    if (newDay) {
      result.push({
        kind: 'date',
        key: `date-${message.createdAt.slice(0, 10)}`,
        label: dayLabel(message.createdAt),
      })
    }

    const showName =
      props.isGroup &&
      message.senderId !== props.currentUserId &&
      (newDay || previous?.senderId !== message.senderId)
    const senderName = showName
      ? (props.participants.find((participant) => participant.id === message.senderId)
          ?.displayName ?? 'Someone')
      : undefined

    result.push({ kind: 'message', key: messageKey(message), message, senderName })
    previous = message
  }
  return result
})

const container = ref<HTMLElement | null>(null)
const anchor = useScrollAnchor(container)
const showNewIndicator = ref(false)
let initialised = false
const ready = ref(false)
const FRESH_MS = 15_000

// Only brand-new messages animate in; history and prepended pages never do.
function isFresh(message: Message): boolean {
  return ready.value && Date.now() - Date.parse(message.createdAt) < FRESH_MS
}

function requestOlder() {
  if (!props.hasOlder || props.isFetchingOlder) return
  anchor.captureBeforePrepend()
  emit('loadOlder')
}

function onScroll() {
  if (anchor.isNearBottom()) showNewIndicator.value = false
  if ((container.value?.scrollTop ?? 1) < 60) requestOlder()
}

function jumpToLatest() {
  showNewIndicator.value = false
  anchor.scrollToBottom(true)
}

watch(
  () => props.messages,
  (next, prev) => {
    if (!initialised) {
      if (next.length > 0) {
        initialised = true
        anchor.scrollToBottom()
        nextTick(() => (ready.value = true))
      }
      return
    }

    const nextFirst = next[0]
    const nextLast = next[next.length - 1]
    const prevFirst = prev?.[0]
    const prevLast = prev?.[prev.length - 1]
    if (!nextFirst || !nextLast || !prevFirst || !prevLast) {
      anchor.scrollToBottom()
      return
    }

    const prepended =
      messageKey(nextFirst) !== messageKey(prevFirst) &&
      messageKey(nextLast) === messageKey(prevLast)
    if (prepended) {
      anchor.restoreAfterPrepend()
      return
    }

    if (messageKey(nextLast) !== messageKey(prevLast)) {
      if (nextLast.senderId === props.currentUserId || anchor.isNearBottom())
        anchor.scrollToBottom(true)
      else showNewIndicator.value = true
    }
  },
  { flush: 'pre' },
)
</script>

<template>
  <div class="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">
    <ChatBlob class="absolute -right-24 -top-24" />
    <DotGrid class="absolute left-6 top-20 hidden sm:block" />
    <DotGrid class="absolute bottom-6 right-8 hidden sm:block" />
    <div
      ref="container"
      class="relative flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-6"
      role="log"
      aria-label="Messages"
      aria-live="polite"
      tabindex="0"
      @scroll.passive="onScroll"
    >
      <div class="mx-auto w-full max-w-4xl">
        <div v-if="isPending" class="flex flex-col gap-4" aria-hidden="true">
          <Skeleton class="h-12 w-2/3" />
          <Skeleton class="ml-auto h-12 w-1/2" />
          <Skeleton class="h-12 w-3/5" />
          <Skeleton class="ml-auto h-12 w-2/5" />
        </div>

        <template v-else>
          <div v-if="hasOlder || isFetchingOlder" class="mb-4 flex justify-center">
            <Button size="sm" variant="neutral" :disabled="isFetchingOlder" @click="requestOlder">
              <History aria-hidden="true" />
              {{ isFetchingOlder ? 'Loading…' : 'Load older messages' }}
            </Button>
          </div>

          <div v-if="messages.length === 0" class="flex h-full items-center justify-center">
            <div
              class="rounded-base border-2 border-border bg-secondary-background py-8 shadow-shadow"
            >
              <EmptyState
                title="No messages yet"
                description="Say hello and start the conversation."
              />
            </div>
          </div>

          <ul v-else class="flex flex-col gap-3">
            <template v-for="row in rows" :key="row.key">
              <li v-if="row.kind === 'date'" class="list-none">
                <DateSeparator :label="row.label" />
              </li>
              <li v-else class="list-none">
                <MessageBubble
                  :message="row.message"
                  :own="row.message.senderId === currentUserId"
                  :sender-name="row.senderName"
                  :animate-in="isFresh(row.message)"
                  @retry="emit('retry', $event)"
                  @discard="emit('discard', $event)"
                />
              </li>
            </template>
          </ul>
        </template>
      </div>
    </div>

    <Button
      v-if="showNewIndicator"
      class="absolute bottom-4 left-1/2 -translate-x-1/2"
      size="sm"
      variant="lime"
      @click="jumpToLatest"
    >
      <ArrowDown aria-hidden="true" />
      New messages
    </Button>
  </div>
</template>
