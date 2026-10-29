<script setup lang="ts">
import { ArrowLeft, Info } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import UserAvatar from '@/components/shared/UserAvatar.vue'
import { Button } from '@/components/ui/button'

defineProps<{
  title: string
  subtitle: string
  avatarUrl?: string | null
}>()

defineEmits<{ details: [] }>()
</script>

<template>
  <header class="flex items-center gap-3 border-b-2 border-border bg-cyan px-3 py-3 sm:px-4">
    <Button as-child variant="neutral" size="icon-sm" class="md:hidden">
      <RouterLink :to="{ name: 'inbox' }" aria-label="Back to chats">
        <ArrowLeft />
      </RouterLink>
    </Button>

    <UserAvatar :name="title" :avatar-url="avatarUrl" size="sm" />
    <div class="min-w-0 flex-1">
      <h1 class="truncate text-lg leading-tight md:text-xl">{{ title }}</h1>
      <p class="truncate text-xs font-bold text-foreground/70">{{ subtitle }}</p>
    </div>

    <Button variant="neutral" size="icon-sm" aria-label="Conversation details" @click="$emit('details')">
      <Info />
    </Button>
  </header>
</template>
