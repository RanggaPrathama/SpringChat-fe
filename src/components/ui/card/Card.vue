<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <div :class="cn('flex flex-col gap-6 rounded-base border-2 border-border bg-secondary-background py-6 text-foreground shadow-shadow', props.class)">
    <slot />
  </div>
</template>
