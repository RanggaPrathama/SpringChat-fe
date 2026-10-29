<script setup lang="ts">
import { computed } from 'vue'

import UserAvatar from '@/components/shared/UserAvatar.vue'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import type { ID } from '@/modules/users/types/user.types'

import type { ConversationSummary } from '../types/conversation.types'
import { getConversationTitle } from '../utils/conversation'

const props = defineProps<{ conversation: ConversationSummary; meId: ID | undefined }>()
const open = defineModel<boolean>('open', { default: false })

const title = computed(() => getConversationTitle(props.conversation, props.meId))
const description = computed(() =>
  props.conversation.type === 'GROUP'
    ? `Group chat with ${props.conversation.participants.length} members.`
    : 'Direct conversation.',
)
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent>
      <DialogTitle>{{ title }}</DialogTitle>
      <DialogDescription>{{ description }}</DialogDescription>

      <ul class="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1" aria-label="Members">
        <li
          v-for="member in conversation.participants"
          :key="member.id"
          class="flex items-center gap-3 rounded-base border-2 border-border bg-background px-3 py-2"
        >
          <UserAvatar :name="member.displayName" :avatar-url="member.avatarUrl" size="sm" />
          <span class="min-w-0 flex-1">
            <span class="block truncate font-bold">{{ member.displayName }}</span>
            <span class="block truncate text-xs font-medium text-foreground/70">@{{ member.username }}</span>
          </span>
          <Badge v-if="member.id === meId" variant="lime">You</Badge>
        </li>
      </ul>
    </DialogContent>
  </Dialog>
</template>
