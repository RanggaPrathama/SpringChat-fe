<script setup lang="ts">
import Reveal from '@/components/shared/Reveal.vue'
import { stagger } from '@/lib/motion'

const steps = [
  { title: 'Create your account', text: 'Sign up with an email and a username in under a minute.' },
  { title: 'Find someone', text: 'Search for a person and open a direct conversation.' },
  { title: 'Say hello', text: 'Send a message and keep your chats organized in one inbox.' },
]
</script>

<template>
  <section id="how-it-works" class="mx-auto w-full max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
    <Reveal><h2 class="text-4xl sm:text-5xl">How it works</h2></Reveal>

    <ol class="mt-12 grid gap-6 md:grid-cols-3">
      <li v-for="(step, index) in steps" :key="step.title">
        <Reveal :delay="stagger(index, 0.12)" class="h-full">
          <div
            class="h-full rounded-base border-2 border-border bg-secondary-background p-6 shadow-shadow"
          >
            <span
              class="flex size-12 items-center justify-center rounded-full border-2 border-border bg-main font-heading text-xl"
            >
              {{ index + 1 }}
            </span>
            <h3 class="mt-4 text-xl">{{ step.title }}</h3>
            <p class="mt-2 text-sm font-medium text-foreground/70">{{ step.text }}</p>
          </div>
        </Reveal>
      </li>
    </ol>
  </section>
</template>
