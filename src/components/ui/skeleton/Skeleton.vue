<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div
    :class="cn('animate-pulse rounded-base border-2 border-border bg-foreground/10 motion-reduce:animate-none', props.class)"
    aria-hidden="true"
  />
</template>
