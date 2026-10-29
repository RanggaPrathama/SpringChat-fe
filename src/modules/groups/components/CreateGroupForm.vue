<script setup lang="ts">
import { Users } from 'lucide-vue-next'
import { computed, ref, watch } from 'vue'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type FieldErrors, toFieldErrors } from '@/modules/auth/types/auth.schemas'
import type { ID, User } from '@/modules/users/types/user.types'

import { groupSchema, MIN_GROUP_MEMBERS } from '../types/group.schemas'
import GroupMemberPicker from './GroupMemberPicker.vue'

defineProps<{ isPending?: boolean; error?: string }>()
const emit = defineEmits<{ submit: [payload: { name: string; memberIds: ID[] }] }>()

const name = ref('')
const selected = ref<User[]>([])
const errors = ref<FieldErrors<'name' | 'memberIds'>>({})

const remaining = computed(() => Math.max(0, MIN_GROUP_MEMBERS - selected.value.length))

watch(name, () => (errors.value = { ...errors.value, name: undefined }))
watch(selected, () => (errors.value = { ...errors.value, memberIds: undefined }))

function toggle(user: User) {
  const exists = selected.value.some((item) => item.id === user.id)
  selected.value = exists ? selected.value.filter((item) => item.id !== user.id) : [...selected.value, user]
}

function onSubmit() {
  const parsed = groupSchema.safeParse({ name: name.value, memberIds: selected.value.map((user) => user.id) })
  if (!parsed.success) {
    errors.value = toFieldErrors(parsed.error)
    return
  }
  errors.value = {}
  emit('submit', parsed.data)
}
</script>

<template>
  <form class="flex min-h-0 flex-col gap-4" novalidate @submit.prevent="onSubmit">
    <p v-if="error" role="alert" class="rounded-base border-2 border-border bg-danger px-3 py-2 text-sm font-bold text-white">
      {{ error }}
    </p>

    <div class="flex flex-col gap-2">
      <Label for="group-name">Group name</Label>
      <Input
        id="group-name"
        v-model="name"
        maxlength="50"
        placeholder="Weekend plans"
        :aria-invalid="!!errors.name"
        aria-describedby="group-name-error"
      />
      <p v-if="errors.name" id="group-name-error" class="text-sm font-bold text-danger">{{ errors.name }}</p>
    </div>

    <div class="flex min-h-0 flex-col gap-2">
      <p class="text-sm font-bold">
        Members
        <span class="font-medium text-foreground/70">
          ({{ selected.length }} selected<template v-if="remaining > 0">, pick {{ remaining }} more</template>)
        </span>
      </p>
      <GroupMemberPicker :selected="selected" :disabled="isPending" @toggle="toggle" />
      <p v-if="errors.memberIds" class="text-sm font-bold text-danger" role="alert">{{ errors.memberIds }}</p>
    </div>

    <Button type="submit" size="lg" class="w-full" :disabled="isPending">
      <Users aria-hidden="true" />
      {{ isPending ? 'Creating…' : 'Create group' }}
    </Button>
  </form>
</template>
