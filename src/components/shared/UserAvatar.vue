<script setup lang="ts">
import { computed } from 'vue'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const props = withDefaults(
  defineProps<{
    name: string
    avatarUrl?: string | null
    size?: 'sm' | 'md' | 'lg' | 'xl'
  }>(),
  { avatarUrl: null, size: 'md' },
)

const initials = computed(() =>
  props.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join(''),
)

const sizeClass = computed(
  () => ({ sm: 'size-9 text-xs', md: 'size-11 text-sm', lg: 'size-14 text-base', xl: 'size-24 text-3xl' })[props.size],
)
</script>

<template>
  <Avatar :class="sizeClass" :aria-label="name">
    <AvatarImage v-if="avatarUrl" :src="avatarUrl" :alt="name" />
    <AvatarFallback>{{ initials }}</AvatarFallback>
  </Avatar>
</template>
