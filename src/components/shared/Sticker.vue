<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <span
    :class="
      cn(
        'inline-block -rotate-2 rounded-full border-2 border-border bg-main px-5 py-1.5 font-heading text-lg uppercase tracking-wide text-main-foreground shadow-shadow',
        props.class,
      )
    "
  >
    <slot />
  </span>
</template>
