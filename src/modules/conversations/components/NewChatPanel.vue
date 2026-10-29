<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { Button } from '@/components/ui/button'
import { toAppError } from '@/lib/errors'
import CreateGroupForm from '@/modules/groups/components/CreateGroupForm.vue'
import UserSearch from '@/modules/users/components/UserSearch.vue'
import type { ID, User } from '@/modules/users/types/user.types'

import { useCreateConversation } from '../composables/useCreateConversation'
import type { Conversation } from '../types/conversation.types'

const emit = defineEmits<{ done: [] }>()

const router = useRouter()
const { createPrivate, createGroup } = useCreateConversation()

const mode = ref<'direct' | 'group'>('direct')
const error = ref('')

function open(conversation: Conversation) {
  emit('done')
  router.push({ name: 'chat', params: { conversationId: conversation.id } })
}

function fail(cause: unknown) {
  error.value =
    toAppError(cause).kind === 'validation'
      ? 'Those details were not accepted. Please review and try again.'
      : 'Could not create the conversation. Please try again.'
}

function startDirect(user: User) {
  error.value = ''
  createPrivate.mutate(user.id, { onSuccess: open, onError: fail })
}

function startGroup(payload: { name: string; memberIds: ID[] }) {
  error.value = ''
  createGroup.mutate(payload, { onSuccess: open, onError: fail })
}

function switchMode(next: 'direct' | 'group') {
  mode.value = next
  error.value = ''
}
</script>

<template>
  <div class="flex min-h-0 flex-col gap-4">
    <div class="grid grid-cols-2 gap-2" role="group" aria-label="Conversation type">
      <Button
        :variant="mode === 'direct' ? 'default' : 'neutral'"
        size="sm"
        :aria-pressed="mode === 'direct'"
        @click="switchMode('direct')"
      >
        Direct message
      </Button>
      <Button
        :variant="mode === 'group' ? 'default' : 'neutral'"
        size="sm"
        :aria-pressed="mode === 'group'"
        @click="switchMode('group')"
      >
        New group
      </Button>
    </div>

    <template v-if="mode === 'direct'">
      <p v-if="error" role="alert" class="rounded-base border-2 border-border bg-danger px-3 py-2 text-sm font-bold text-white">
        {{ error }}
      </p>
      <UserSearch :disabled="createPrivate.isPending.value" @select="startDirect" />
      <p v-if="createPrivate.isPending.value" role="status" class="text-sm font-bold">Opening conversation…</p>
    </template>

    <CreateGroupForm v-else :is-pending="createGroup.isPending.value" :error="error" @submit="startGroup" />
  </div>
</template>
