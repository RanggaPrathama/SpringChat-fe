<script setup lang="ts">
import { env } from '@/lib/env'

import LoginForm from '../components/LoginForm.vue'
</script>

<template>
  <div>
    <h1 class="text-3xl">Welcome back</h1>
    <p class="mb-6 mt-1 text-sm font-medium text-foreground/70">Sign in to keep the conversation going.</p>
    <LoginForm />
    <p v-if="env.useMocks" class="mt-5 rounded-base border-2 border-dashed border-border bg-lime/40 px-3 py-2 text-xs font-bold">
      Demo (mock API): demo@springchat.dev / password123
    </p>
  </div>
</template>
