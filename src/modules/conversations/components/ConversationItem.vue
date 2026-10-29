<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import UserAvatar from '@/components/shared/UserAvatar.vue'
import { Badge } from '@/components/ui/badge'
import { formatTime } from '@/lib/format'
import { useAuthStore } from '@/modules/auth/store/auth.store'

import type { ConversationSummary } from '../types/conversation.types'
import { getConversationTitle, getPeer } from '../utils/conversation'

const props = defineProps<{
  conversation: ConversationSummary
  active?: boolean
}>()

const authStore = useAuthStore()

const peer = computed(() => getPeer(props.conversation, authStore.user?.id))

const title = computed(() => getConversationTitle(props.conversation, authStore.user?.id))

const preview = computed(() => props.conversation.lastMessage?.content ?? 'No messages yet')

const timestamp = computed(() => formatTime(props.conversation.lastMessage?.createdAt ?? props.conversation.updatedAt))
</script>

<template>
  <RouterLink
    :to="{ name: 'chat', params: { conversationId: conversation.id } }"
    class="flex items-center gap-3 rounded-base border-2 px-3 py-3 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
    :class="
      active
        ? 'border-border bg-lime shadow-shadow'
        : 'border-transparent hover:border-border hover:bg-secondary-background'
    "
    :aria-current="active ? 'page' : undefined"
  >
    <UserAvatar :name="title" :avatar-url="peer?.avatarUrl" />

    <span class="min-w-0 flex-1">
      <span class="flex items-center justify-between gap-2">
        <span class="truncate font-bold">{{ title }}</span>
        <span class="shrink-0 text-xs font-medium text-foreground/70">{{ timestamp }}</span>
      </span>
      <span class="flex items-center justify-between gap-2">
        <span class="truncate text-sm font-medium text-foreground/70">{{ preview }}</span>
        <Badge v-if="conversation.unreadCount > 0" class="shrink-0">
          <span class="sr-only">Unread messages:</span>
          {{ conversation.unreadCount }}
        </Badge>
      </span>
    </span>
  </RouterLink>
</template>
