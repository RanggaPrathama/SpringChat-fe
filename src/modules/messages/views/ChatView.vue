<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'

import EmptyState from '@/components/shared/EmptyState.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { queryKeys } from '@/lib/queryKeys'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import ConversationDetails from '@/modules/conversations/components/ConversationDetails.vue'
import { conversationsService } from '@/modules/conversations/services/conversations.service'
import {
  getConversationSubtitle,
  getConversationTitle,
  getPeer,
} from '@/modules/conversations/utils/conversation'

import ChatHeader from '../components/ChatHeader.vue'
import MessageComposer from '../components/MessageComposer.vue'
import MessageList from '../components/MessageList.vue'
import { useChatRealtime } from '../composables/useChatRealtime'
import { useMessages } from '../composables/useMessages'
import { useSendMessage } from '../composables/useSendMessage'

const props = defineProps<{ conversationId: string }>()

const authStore = useAuthStore()
const id = computed(() => Number(props.conversationId))
const detailsOpen = ref(false)

const { data: conversation } = useQuery({
  queryKey: computed(() => queryKeys.conversation(id.value)),
  queryFn: () => conversationsService.getConversation(id.value),
  retry: false,
})

const { messages, errorKind, isPending, hasOlder, isFetchingOlder, loadOlder } = useMessages(id)
const { send, retry, discard } = useSendMessage(id)
useChatRealtime(id, computed(() => errorKind.value === null))

const meId = computed(() => authStore.user?.id)
const title = computed(() => (conversation.value ? getConversationTitle(conversation.value, meId.value) : ''))
const subtitle = computed(() => (conversation.value ? getConversationSubtitle(conversation.value, meId.value) : ''))
const avatarUrl = computed(() => (conversation.value ? getPeer(conversation.value, meId.value)?.avatarUrl : null))

const unavailable = computed(() => errorKind.value === 'forbidden' || errorKind.value === 'not_found')
const loadFailed = computed(() => errorKind.value !== null && !unavailable.value)
</script>

<template>
  <div v-if="unavailable" class="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-6">
    <div class="rounded-base border-2 border-border bg-secondary-background py-8 shadow-shadow">
      <EmptyState
        title="Conversation unavailable"
        description="It may not exist, or you are not a member of it."
      >
        <Button as-child class="mt-2">
          <RouterLink :to="{ name: 'inbox' }">Back to chats</RouterLink>
        </Button>
      </EmptyState>
    </div>
  </div>

  <div v-else class="flex min-h-0 flex-1 flex-col">
    <ChatHeader
      v-if="conversation"
      :title="title"
      :subtitle="subtitle"
      :avatar-url="avatarUrl"
      @details="detailsOpen = true"
    />
    <div v-else class="flex items-center gap-3 border-b-2 border-border bg-cyan px-4 py-3">
      <Skeleton class="size-9 rounded-full" />
      <Skeleton class="h-5 w-32" />
    </div>

    <p
      v-if="loadFailed"
      role="alert"
      class="border-b-2 border-border bg-danger px-4 py-2 text-sm font-bold text-white"
    >
      Couldn't load messages. Check your connection.
    </p>

    <MessageList
      :key="id"
      :messages="messages"
      :current-user-id="meId ?? 0"
      :participants="conversation?.participants ?? []"
      :is-group="conversation?.type === 'GROUP'"
      :is-pending="isPending"
      :has-older="hasOlder"
      :is-fetching-older="isFetchingOlder"
      @load-older="loadOlder"
      @retry="retry"
      @discard="discard"
    />

    <MessageComposer :key="id" :send-fn="send" />

    <ConversationDetails v-if="conversation" v-model:open="detailsOpen" :conversation="conversation" :me-id="meId" />
  </div>
</template>
