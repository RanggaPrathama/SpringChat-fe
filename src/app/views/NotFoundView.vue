<script setup lang="ts">
import { RouterLink } from 'vue-router'

import EmptyState from '@/components/shared/EmptyState.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <div class="flex min-h-dvh items-center justify-center bg-cyan px-4">
    <main class="rounded-base border-2 border-border bg-secondary-background py-10 shadow-shadow">
      <EmptyState
        title="Page not found"
        description="The page you're looking for doesn't exist or you don't have access."
      >
        <Button as-child class="mt-2">
          <RouterLink to="/">Back to home</RouterLink>
        </Button>
      </EmptyState>
    </main>
  </div>
</template>
