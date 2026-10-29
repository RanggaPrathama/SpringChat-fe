<script setup lang="ts">
import { useRoute } from 'vue-router'

import EmptyState from '@/components/shared/EmptyState.vue'
import { Skeleton } from '@/components/ui/skeleton'

import type { ConversationSummary } from '../types/conversation.types'
import ConversationItem from './ConversationItem.vue'

defineProps<{
  conversations: ConversationSummary[]
  isLoading: boolean
  isError: boolean
}>()

const route = useRoute()
</script>

<template>
  <ul v-if="isLoading" class="flex flex-col gap-2 p-2" aria-hidden="true">
    <li v-for="n in 6" :key="n" class="flex items-center gap-3 px-3 py-3">
      <Skeleton class="size-11 shrink-0 rounded-full" />
      <span class="flex-1">
        <Skeleton class="h-3 w-1/3" />
        <Skeleton class="mt-2 h-3 w-2/3" />
      </span>
    </li>
  </ul>

  <div v-else-if="isError" class="flex h-full items-center justify-center p-6">
    <EmptyState title="Couldn't load chats" description="Check your connection and try again." />
  </div>

  <div v-else-if="conversations.length === 0" class="flex h-full items-center justify-center p-6">
    <EmptyState title="No conversations yet" description="Start a conversation to see it here." />
  </div>

  <ul v-else class="flex flex-col gap-2 p-2">
    <li v-for="conversation in conversations" :key="conversation.id">
      <ConversationItem
        :conversation="conversation"
        :active="route.params.conversationId === String(conversation.id)"
      />
    </li>
  </ul>
</template>
