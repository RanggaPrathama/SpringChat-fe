<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <svg
    viewBox="0 0 100 100"
    aria-hidden="true"
    focusable="false"
    :class="cn('pointer-events-none size-16 fill-lime stroke-border', props.class)"
    stroke-width="5"
    stroke-linejoin="round"
  >
    <path
      d="M50 4 61 24 82 14 80 38 100 44 84 60 96 80 73 80 72 100 52 88 34 100 30 80 6 82 18 62 2 46 24 38 20 14 41 24Z"
    />
  </svg>
</template>
