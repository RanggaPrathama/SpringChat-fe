<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterView, useRoute } from 'vue-router'

import EmptyState from '@/components/shared/EmptyState.vue'
import { useVisualViewportHeight } from '@/lib/viewport'
import InboxView from '@/modules/conversations/views/InboxView.vue'

const route = useRoute()
const isThreadOpen = computed(() => route.name === 'chat')
const shell = ref<HTMLElement | null>(null)
useVisualViewportHeight(shell)
</script>

<template>
  <div ref="shell" class="h-app flex w-full bg-secondary-background">
    <aside
      class="w-full flex-col overflow-hidden bg-secondary-background md:flex md:w-[340px] md:shrink-0 md:border-r-2 md:border-border lg:w-[384px]"
      :class="isThreadOpen ? 'hidden md:flex' : 'flex'"
      aria-label="Conversations"
    >
      <InboxView />
    </aside>

    <main v-if="isThreadOpen" class="flex min-w-0 flex-1 flex-col overflow-hidden bg-secondary-background">
      <RouterView />
    </main>
    <main
      v-else
      class="bg-dots hidden min-w-0 flex-1 flex-col items-center justify-center overflow-hidden bg-background md:flex"
    >
      <div class="rounded-base border-2 border-border bg-secondary-background py-8 shadow-shadow">
        <EmptyState
          title="Select a conversation"
          description="Pick a chat from the list, or start a new conversation to say hello."
        />
      </div>
    </main>
  </div>
</template>
