<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <svg
    viewBox="0 0 32 32"
    aria-hidden="true"
    focusable="false"
    :class="cn('pointer-events-none size-7 stroke-border', props.class)"
    fill="none"
    stroke-width="3"
    stroke-linecap="round"
  >
    <path d="M6 4 12 14" />
    <path d="M16 2v12" />
    <path d="M26 5 20 14" />
  </svg>
</template>
