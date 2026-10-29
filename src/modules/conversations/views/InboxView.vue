<script setup lang="ts">
import { LogOut, Plus, Search } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import AppLogo from '@/components/shared/AppLogo.vue'
import Sparkle from '@/components/shared/decor/Sparkle.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/modules/auth/composables/useAuth'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import ConversationList from '../components/ConversationList.vue'
import NewMessageDialog from '../components/NewMessageDialog.vue'
import { useConversations } from '../composables/useConversations'
import { getConversationTitle } from '../utils/conversation'

const authStore = useAuthStore()
const { logout } = useAuth()
const { data: conversations, isPending, isError } = useConversations()

const search = ref('')
const isNewMessageOpen = ref(false)

const filteredConversations = computed(() => {
  const list = conversations.value ?? []
  const term = search.value.trim().toLowerCase()
  if (!term) return list

  return list.filter((conversation) => {
    const title = getConversationTitle(conversation, authStore.user?.id)
    const preview = conversation.lastMessage?.content ?? ''
    return title.toLowerCase().includes(term) || preview.toLowerCase().includes(term)
  })
})
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="flex items-center justify-between bg-cyan px-4 py-3 md:hidden">
      <AppLogo />
    </div>

    <header class="flex items-center justify-between gap-2 px-4 pb-3 pt-5">
      <h1 class="flex items-start gap-1 text-3xl">
        Chats
        <Sparkle class="-mt-1 size-5" />
      </h1>
      <Button size="icon" aria-label="New message" @click="isNewMessageOpen = true">
        <Plus class="size-5" />
      </Button>
    </header>

    <div class="px-4 pb-3">
      <label for="conversation-search" class="sr-only">Search chats</label>
      <div
        class="flex h-10 items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <Search class="size-4 shrink-0" aria-hidden="true" />
        <input
          id="conversation-search"
          v-model="search"
          type="search"
          placeholder="Search chats"
          class="w-full bg-transparent text-base font-medium outline-hidden placeholder:text-foreground/50"
        />
      </div>
    </div>

    <Separator />

    <div class="min-h-0 flex-1 overflow-y-auto bg-background">
      <ConversationList :conversations="filteredConversations" :is-loading="isPending" :is-error="isError" />
    </div>

    <Separator />
    <div class="flex items-center gap-3 px-4 py-3">
      <RouterLink
        :to="{ name: 'profile' }"
        class="flex min-w-0 flex-1 items-center gap-3 rounded-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <UserAvatar
          :name="authStore.user?.displayName ?? 'You'"
          :avatar-url="authStore.user?.avatarUrl"
          size="sm"
        />
        <span class="truncate text-sm font-bold">{{ authStore.user?.displayName ?? 'Your profile' }}</span>
      </RouterLink>
      <Button variant="neutral" size="icon-sm" aria-label="Log out" @click="logout">
        <LogOut />
      </Button>
    </div>

    <NewMessageDialog v-model:open="isNewMessageOpen" />
  </div>
</template>
