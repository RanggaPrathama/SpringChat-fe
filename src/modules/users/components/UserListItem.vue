<script setup lang="ts">
import { Check } from 'lucide-vue-next'

import UserAvatar from '@/components/shared/UserAvatar.vue'

import type { User } from '../types/user.types'

defineProps<{ user: User; selected?: boolean; selectable?: boolean; disabled?: boolean }>()
defineEmits<{ select: [user: User] }>()
</script>

<template>
  <button
    type="button"
    class="flex w-full cursor-pointer items-center gap-3 rounded-base border-2 px-3 py-2 text-left transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 motion-reduce:transition-none"
    :class="
      selected
        ? 'border-border bg-lime shadow-shadow'
        : 'border-transparent hover:border-border hover:bg-secondary-background'
    "
    :aria-pressed="selectable ? !!selected : undefined"
    :disabled="disabled"
    @click="$emit('select', user)"
  >
    <UserAvatar :name="user.displayName" :avatar-url="user.avatarUrl" size="sm" />
    <span class="min-w-0 flex-1">
      <span class="block truncate font-bold">{{ user.displayName }}</span>
      <span class="block truncate text-xs font-medium text-foreground/70"
        >@{{ user.username }}</span
      >
    </span>
    <Check v-if="selected" class="size-4 shrink-0" aria-hidden="true" />
  </button>
</template>
