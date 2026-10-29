<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <svg
    viewBox="0 0 160 24"
    aria-hidden="true"
    focusable="false"
    :class="cn('pointer-events-none h-6 w-40 stroke-main', props.class)"
    fill="none"
    stroke-width="6"
    stroke-linecap="round"
  >
    <path d="M6 18C30 4 50 4 72 12S120 20 154 6" />
    <path d="M22 22C46 12 70 12 92 18" />
  </svg>
</template>
