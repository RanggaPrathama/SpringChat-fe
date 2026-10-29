<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'

import NewChatPanel from '../components/NewChatPanel.vue'
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-cyan">
    <header class="flex items-center gap-3 border-b-2 border-border bg-secondary-background px-4 py-3">
      <Button as-child variant="neutral" size="icon-sm">
        <RouterLink :to="{ name: 'inbox' }" aria-label="Back to chats">
          <ArrowLeft />
        </RouterLink>
      </Button>
      <h1 class="text-xl">New conversation</h1>
    </header>
    <main class="mx-auto w-full max-w-lg flex-1 p-4">
      <div class="rounded-base border-2 border-border bg-secondary-background p-4 shadow-shadow">
        <NewChatPanel />
      </div>
    </main>
  </div>
</template>
