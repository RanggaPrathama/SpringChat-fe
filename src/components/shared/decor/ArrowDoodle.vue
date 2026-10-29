<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <svg
    viewBox="0 0 100 80"
    aria-hidden="true"
    focusable="false"
    :class="cn('pointer-events-none h-20 w-24 stroke-blue', props.class)"
    fill="none"
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M92 6C80 6 76 28 60 36S28 28 36 44s24 20 2 30" />
    <path d="M24 62 8 74l8 -18" />
  </svg>
</template>
