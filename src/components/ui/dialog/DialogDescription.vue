<script setup lang="ts">
import { DialogDescription, type DialogDescriptionProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<DialogDescriptionProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <DialogDescription
    v-bind="props"
    :class="cn('text-sm font-medium text-foreground/70', props.class)"
  >
    <slot />
  </DialogDescription>
</template>
