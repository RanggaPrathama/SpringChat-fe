<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { RouterLink, RouterView } from 'vue-router'

import AppLogo from '@/components/shared/AppLogo.vue'
import StarBurst from '@/components/shared/decor/StarBurst.vue'
</script>

<template>
  <div class="relative flex min-h-dvh items-center justify-center overflow-clip bg-cyan px-4 py-10">
    <StarBurst class="absolute -left-10 -top-2 size-20 rotate-12 fill-main" />
    <StarBurst class="absolute -right-8 bottom-12 size-28 -rotate-12 fill-lime" />

    <div class="relative w-full max-w-md">
      <RouterLink
        to="/"
        class="mb-5 inline-flex items-center gap-2 text-sm font-bold underline-offset-4 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft class="size-4" aria-hidden="true" />
        Back to home
      </RouterLink>

      <main class="rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow sm:p-8">
        <div class="mb-6">
          <AppLogo />
        </div>
        <RouterView />
      </main>
    </div>
  </div>
</template>
