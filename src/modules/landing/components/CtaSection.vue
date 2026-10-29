<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import StarBurst from '@/components/shared/decor/StarBurst.vue'
import Reveal from '@/components/shared/Reveal.vue'
import { Button } from '@/components/ui/button'
</script>

<template>
  <section class="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
    <Reveal>
      <div
        class="relative overflow-hidden rounded-section border-2 border-border bg-blue p-8 text-white shadow-shadow sm:p-14"
      >
        <StarBurst class="absolute -right-6 -top-6 hidden size-28 rotate-12 fill-main sm:block" />
        <h2 class="max-w-xl text-4xl sm:text-5xl">Ready to start your first conversation?</h2>
        <p class="mt-4 max-w-md text-base font-medium">
          Create a free account and say hello to someone today.
        </p>
        <Button as-child size="lg" variant="lime" class="mt-8">
          <RouterLink :to="{ name: 'register' }">
            Create my account
            <ArrowRight aria-hidden="true" />
          </RouterLink>
        </Button>
      </div>
    </Reveal>
  </section>
</template>
