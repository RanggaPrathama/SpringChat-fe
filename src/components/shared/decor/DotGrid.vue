<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<{ class?: HTMLAttributes['class'] }>()
</script>

<template>
  <span
    aria-hidden="true"
    :class="cn('pointer-events-none block size-24 text-lime', props.class)"
    style="
      background-image: radial-gradient(currentColor 3px, transparent 3.5px);
      background-size: 16px 16px;
    "
  />
</template>
