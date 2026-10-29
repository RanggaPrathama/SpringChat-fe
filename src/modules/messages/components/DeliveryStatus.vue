<script setup lang="ts">
import { AlertCircle, Check, CheckCheck, Clock } from 'lucide-vue-next'
import { computed } from 'vue'

import type { MessageStatus } from '../types/message.types'

const props = defineProps<{ status?: MessageStatus }>()

const meta = computed(() => {
  switch (props.status) {
    case 'PENDING':
      return { icon: Clock, label: 'Sending' }
    case 'DELIVERED':
      return { icon: CheckCheck, label: 'Delivered' }
    case 'READ':
      return { icon: CheckCheck, label: 'Read', read: true }
    case 'FAILED':
      return { icon: AlertCircle, label: 'Not sent' }
    default:
      return { icon: Check, label: 'Sent' }
  }
})
</script>

<template>
  <span class="inline-flex items-center gap-1 text-xs font-bold" :class="meta.read ? 'text-blue' : ''">
    <component :is="meta.icon" class="size-3.5" aria-hidden="true" />
    <span class="sr-only">{{ meta.label }}</span>
  </span>
</template>
