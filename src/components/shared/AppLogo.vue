<script setup lang="ts">
import { MessageCircle } from 'lucide-vue-next'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <span
      class="flex size-9 items-center justify-center rounded-base border-2 border-border bg-main text-main-foreground shadow-shadow"
    >
      <MessageCircle class="size-5" aria-hidden="true" />
    </span>
    <span v-if="!compact" class="font-heading text-xl">SpringChat</span>
  </span>
</template>
