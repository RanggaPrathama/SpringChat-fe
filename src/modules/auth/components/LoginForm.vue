<script setup lang="ts">
import { LogIn } from 'lucide-vue-next'
import { reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { authErrorMessage, useAuth } from '../composables/useAuth'
import { type FieldErrors, loginSchema, toFieldErrors } from '../types/auth.schemas'

const { login } = useAuth()

const form = reactive({ email: '', password: '' })
const errors = ref<FieldErrors<'email' | 'password'>>({})
const formError = ref('')

function onSubmit() {
  formError.value = ''
  const parsed = loginSchema.safeParse(form)

  if (!parsed.success) {
    errors.value = toFieldErrors(parsed.error)
    return
  }

  errors.value = {}
  login.mutate(parsed.data, {
    onError: (error) => {
      formError.value = authErrorMessage(error, 'login')
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
      <Label for="login-email">Email</Label>
      <Input
        id="login-email"
        v-model="form.email"
        type="email"
        autocomplete="email"
        placeholder="you@example.com"
        :aria-invalid="!!errors.email"
        aria-describedby="login-email-error"
      />
      <p v-if="errors.email" id="login-email-error" class="text-sm font-bold text-danger">{{ errors.email }}</p>
    </div>

    <div class="flex flex-col gap-2">
      <Label for="login-password">Password</Label>
      <Input
        id="login-password"
        v-model="form.password"
        type="password"
        autocomplete="current-password"
        placeholder="Your password"
        :aria-invalid="!!errors.password"
        aria-describedby="login-password-error"
      />
      <p v-if="errors.password" id="login-password-error" class="text-sm font-bold text-danger">
        {{ errors.password }}
      </p>
    </div>

    <Button type="submit" size="lg" class="w-full" :disabled="login.isPending.value">
      <LogIn aria-hidden="true" />
      {{ login.isPending.value ? 'Signing in…' : 'Sign in' }}
    </Button>

    <p class="text-center text-sm font-medium">
      New here?
      <RouterLink :to="{ name: 'register' }" class="font-bold text-blue underline underline-offset-4">
        Create an account
      </RouterLink>
    </p>
  </form>
</template>
