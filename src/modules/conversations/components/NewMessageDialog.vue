<script setup lang="ts">
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

import NewChatPanel from './NewChatPanel.vue'

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-h-[90dvh] max-w-lg overflow-y-auto">
      <DialogTitle>New conversation</DialogTitle>
      <DialogDescription>Message one person, or create a group chat.</DialogDescription>
      <NewChatPanel @done="open = false" />
    </DialogContent>
  </Dialog>
</template>
