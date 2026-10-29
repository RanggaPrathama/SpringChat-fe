<script setup lang="ts">
import { UserPlus } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { authErrorMessage, useAuth } from '../composables/useAuth'
import { type FieldErrors, registerSchema, toFieldErrors } from '../types/auth.schemas'

const { register } = useAuth()

const form = reactive({ username: '', email: '', password: '' })
const errors = ref<FieldErrors<'username' | 'email' | 'password'>>({})
const formError = ref('')

function onSubmit() {
  formError.value = ''
  const parsed = registerSchema.safeParse(form)

  if (!parsed.success) {
    errors.value = toFieldErrors(parsed.error)
    return
  }

  errors.value = {}
  register.mutate(parsed.data, {
    onError: (error) => {
      formError.value = authErrorMessage(error, 'register')
    },
  })
}
</script>

<template>
  <form class="flex flex-col gap-5" novalidate @submit.prevent="onSubmit">
    <div
      v-if="formError"
      role="alert"
      class="rounded-base border-2 border-border bg-danger px-3 py-2 text-sm font-bold text-white"
    >
      {{ formError }}
    </div>

    <div class="flex flex-col gap-2">
      <Label for="register-username">Username</Label>
      <Input
        id="register-username"
        v-model="form.username"
        type="text"
        autocomplete="username"
        placeholder="jane.doe"
        :aria-invalid="!!errors.username"
        aria-describedby="register-username-error"
      />
      <p v-if="errors.username" id="register-username-error" class="text-sm font-bold text-danger">
        {{ errors.username }}
      </p>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="register-email">Email</Label>
      <Input
        id="register-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :aria-invalid="!!errors.email"
        aria-describedby="register-email-error"
      />
      <p v-if="errors.email" id="register-email-error" class="text-sm font-bold text-danger">{{ errors.email }}</p>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="register-password">Password</Label>
      <Input
        id="register-password"
        v-model="form.password"
        type="password"
        autocomplete="new-password"
        placeholder="At least 8 characters"
        :aria-invalid="!!errors.password"
        aria-describedby="register-password-error"
      />
      <p v-if="errors.password" id="register-password-error" class="text-sm font-bold text-danger">
        {{ errors.password }}
      </p>
    </div>

    <Button type="submit" size="lg" class="w-full" :disabled="register.isPending.value">
      <UserPlus aria-hidden="true" />
      {{ register.isPending.value ? 'Creating account…' : 'Create account' }}
    </Button>

    <p class="text-center text-sm font-medium">
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="font-bold text-blue underline underline-offset-4">
        Sign in
      </RouterLink>
    </p>
  </form>
</template>
