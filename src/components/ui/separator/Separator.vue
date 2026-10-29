<script setup lang="ts">
import { Separator, type SeparatorProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = withDefaults(defineProps<SeparatorProps & { class?: HTMLAttributes['class'] }>(), {
  orientation: 'horizontal',
})
</script>

<template>
  <Separator
    v-bind="props"
    :class="cn('shrink-0 bg-border', orientation === 'vertical' ? 'h-full w-0.5' : 'h-0.5 w-full', props.class)"
  />
</template>
