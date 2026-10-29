<script setup lang="ts">
import { Save } from 'lucide-vue-next'
import { computed, reactive, ref, watch } from 'vue'

import UserAvatar from '@/components/shared/UserAvatar.vue'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toAppError } from '@/lib/errors'
import { type FieldErrors, toFieldErrors } from '@/modules/auth/types/auth.schemas'

import { useUpdateProfile } from '../composables/useUpdateProfile'
import { profileSchema } from '../types/user.schemas'
import type { User } from '../types/user.types'

const props = defineProps<{ user: User }>()

const form = reactive({
  displayName: props.user.displayName,
  avatarUrl: props.user.avatarUrl ?? '',
})
const errors = ref<FieldErrors<'displayName' | 'avatarUrl'>>({})
const formError = ref('')
const saved = ref(false)
const { mutate, isPending } = useUpdateProfile()

watch(
  () => props.user,
  (next) => {
    form.displayName = next.displayName
    form.avatarUrl = next.avatarUrl ?? ''
  },
)

const dirty = computed(
  () =>
    form.displayName.trim() !== props.user.displayName ||
    form.avatarUrl.trim() !== (props.user.avatarUrl ?? ''),
)

function onSubmit() {
  saved.value = false
  formError.value = ''
  const parsed = profileSchema.safeParse(form)

  if (!parsed.success) {
    errors.value = toFieldErrors(parsed.error)
    return
  }

  errors.value = {}
  mutate(
    {
      displayName: parsed.data.displayName,
      avatarUrl: parsed.data.avatarUrl === '' ? null : parsed.data.avatarUrl,
    },
    {
      onSuccess: () => (saved.value = true),
      onError: (error) => {
        formError.value =
          toAppError(error).kind === 'validation'
            ? 'Please check your details and try again.'
            : 'Could not save your profile. Please try again.'
      },
    },
  )
}
</script>

<template>
  <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
    <div class="flex items-center gap-4">
      <UserAvatar
        :name="form.displayName || user.displayName"
        :avatar-url="form.avatarUrl.trim() || null"
        size="lg"
      />
      <div class="min-w-0">
        <p class="truncate font-heading text-xl">{{ user.displayName }}</p>
        <p class="truncate text-sm font-medium text-foreground/70">@{{ user.username }}</p>
      </div>
    </div>

    <p
      v-if="formError"
      role="alert"
      class="rounded-base border-2 border-border bg-danger px-3 py-2 text-sm font-bold text-white"
    >
      {{ formError }}
    </p>
    <p
      v-if="saved"
      role="status"
      class="rounded-base border-2 border-border bg-lime px-3 py-2 text-sm font-bold"
    >
      Profile saved.
    </p>

    <div class="flex flex-col gap-2">
      <Label for="profile-name">Display name</Label>
      <Input
        id="profile-name"
        v-model="form.displayName"
        autocomplete="name"
        :aria-invalid="!!errors.displayName"
        aria-describedby="profile-name-error"
      />
      <p v-if="errors.displayName" id="profile-name-error" class="text-sm font-bold text-danger">
        {{ errors.displayName }}
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="profile-username">Username</Label>
      <Input id="profile-username" :model-value="user.username" disabled />
      <p class="text-xs font-medium text-foreground/70">Your username cannot be changed.</p>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="profile-avatar">Avatar image URL</Label>
      <Input
        id="profile-avatar"
        v-model="form.avatarUrl"
        type="url"
        placeholder="https://example.com/me.png"
        :aria-invalid="!!errors.avatarUrl"
        aria-describedby="profile-avatar-error"
      />
      <p v-if="errors.avatarUrl" id="profile-avatar-error" class="text-sm font-bold text-danger">
        {{ errors.avatarUrl }}
      </p>
      <p v-else class="text-xs font-medium text-foreground/70">
        Optional. Leave empty to use your initials.
      </p>
    </div>

    <Button type="submit" size="lg" class="w-full" :disabled="isPending || !dirty">
      <Save aria-hidden="true" />
      {{ isPending ? 'Saving…' : 'Save changes' }}
    </Button>
  </form>
</template>
