<script setup lang="ts">
import { Label, type LabelProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<LabelProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <Label v-bind="props" :class="cn('text-sm font-bold text-foreground', props.class)">
    <slot />
  </Label>
</template>
