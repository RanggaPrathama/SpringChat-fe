<script setup lang="ts">
import { AvatarImage, type AvatarImageProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'

import { cn } from '@/lib/utils'

const props = defineProps<AvatarImageProps & { class?: HTMLAttributes['class'] }>()
</script>

<template>
  <AvatarImage v-bind="props" :class="cn('size-full object-cover', props.class)" />
</template>
