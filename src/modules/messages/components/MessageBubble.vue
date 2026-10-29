<script setup lang="ts">
import { RotateCw, X } from 'lucide-vue-next'
import { motion } from 'motion-v'

import { Button } from '@/components/ui/button'
import { formatTime } from '@/lib/format'
import { springPop } from '@/lib/motion'

import type { Message } from '../types/message.types'
import DeliveryStatus from './DeliveryStatus.vue'

defineProps<{
  message: Message
  own: boolean
  senderName?: string
  animateIn?: boolean
}>()

defineEmits<{ retry: [clientMessageId: string]; discard: [clientMessageId: string] }>()
</script>

<template>
  <motion.div
    class="flex flex-col"
    :class="own ? 'items-end' : 'items-start'"
    :initial="animateIn ? { opacity: 0, y: 12, scale: 0.96 } : false"
    :animate="{ opacity: 1, y: 0, scale: 1 }"
    :transition="springPop"
  >
    <span v-if="senderName" class="mb-1 px-1 text-xs font-bold text-foreground/70">{{
      senderName
    }}</span>

    <div
      class="max-w-[84%] rounded-base border-2 px-3 py-2 shadow-shadow md:max-w-[75%]"
      :class="[
        own ? 'rounded-br-none bg-main' : 'rounded-bl-none bg-secondary-background',
        message.status === 'FAILED' ? 'border-danger' : 'border-border',
      ]"
    >
      <p class="whitespace-pre-wrap text-base font-medium [overflow-wrap:anywhere]">
        {{ message.content }}
      </p>
      <p class="mt-1 flex items-center justify-end gap-1.5 text-xs font-medium text-foreground/70">
        <time :datetime="message.createdAt">{{ formatTime(message.createdAt) }}</time>
        <DeliveryStatus v-if="own" :status="message.status" />
      </p>
    </div>

    <div
      v-if="own && message.status === 'FAILED' && message.clientMessageId"
      class="mt-2 flex items-center gap-2"
    >
      <span class="text-xs font-bold text-danger" role="alert">Message not sent.</span>
      <Button size="xs" variant="neutral" @click="$emit('retry', message.clientMessageId)">
        <RotateCw aria-hidden="true" />
        Retry
      </Button>
      <Button
        size="xs"
        variant="neutral"
        aria-label="Discard message"
        @click="$emit('discard', message.clientMessageId)"
      >
        <X aria-hidden="true" />
      </Button>
    </div>
  </motion.div>
</template>
