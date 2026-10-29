<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

import AppLogo from '@/components/shared/AppLogo.vue'
import Reveal from '@/components/shared/Reveal.vue'
import { developer } from '@/lib/developer'

const marqueeWords = ['Chat', 'Connect', 'Repeat', 'Say hello', 'Stay in sync']

const product = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
]
</script>

<template>
  <footer>
    <div class="marquee-pause overflow-hidden border-y-2 border-border bg-main" aria-hidden="true">
      <div class="animate-marquee flex w-max">
        <div v-for="copy in 2" :key="copy" class="flex shrink-0 items-center">
          <span
            v-for="word in marqueeWords"
            :key="`${copy}-${word}`"
            class="flex items-center gap-8 px-4 py-3 font-heading text-xl uppercase text-main-foreground"
          >
            {{ word }}
            <span class="text-2xl leading-none">&#10038;</span>
          </span>
        </div>
      </div>
    </div>

    <div class="overflow-hidden bg-foreground text-background">
      <div
        class="mx-auto grid w-full max-w-6xl gap-10 px-4 pb-8 pt-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.3fr_0.8fr_0.8fr_1.3fr]"
      >
        <Reveal>
          <div class="flex flex-col gap-4">
            <AppLogo />
            <p class="max-w-xs text-sm font-medium text-background/80">
              A fast, friendly messenger. Find people, start a conversation, and keep every chat in
              one tidy place.
            </p>
          </div>
        </Reveal>

        <Reveal :delay="0.08">
          <nav aria-label="Product">
            <h2 class="font-heading text-lg text-lime">Product</h2>
            <ul class="mt-4 flex flex-col gap-2 text-sm font-bold">
              <li v-for="item in product" :key="item.href">
                <a
                  :href="item.href"
                  class="rounded-base underline-offset-4 hover:text-lime hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-lime"
                >
                  {{ item.label }}
                </a>
              </li>
            </ul>
          </nav>
        </Reveal>

        <Reveal :delay="0.16">
          <nav aria-label="Account">
            <h2 class="font-heading text-lg text-lime">Account</h2>
            <ul class="mt-4 flex flex-col gap-2 text-sm font-bold">
              <li>
                <RouterLink
                  :to="{ name: 'login' }"
                  class="rounded-base underline-offset-4 hover:text-lime hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-lime"
                >
                  Log in
                </RouterLink>
              </li>
              <li>
                <RouterLink
                  :to="{ name: 'register' }"
                  class="rounded-base underline-offset-4 hover:text-lime hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-lime"
                >
                  Sign up
                </RouterLink>
              </li>
            </ul>
          </nav>
        </Reveal>

        <Reveal :delay="0.24">
          <section
            id="developer"
            aria-labelledby="developer-heading"
            class="scroll-mt-24 rotate-1 rounded-base border-2 border-border bg-secondary-background p-5 text-foreground shadow-[6px_6px_0_0_var(--lime)]"
          >
            <p
              id="developer-heading"
              class="text-xs font-bold uppercase tracking-wide text-foreground/70"
            >
              {{ developer.role }}
            </p>
            <p class="mt-1 font-heading text-2xl leading-tight">{{ developer.name }}</p>
            <a
              :href="`mailto:${developer.email}`"
              :aria-label="`Email ${developer.name}`"
              class="mt-4 inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-3 py-2 text-sm font-bold transition-all hover:translate-x-0.5 hover:translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              <Mail class="size-4" aria-hidden="true" />
              {{ developer.email }}
            </a>
          </section>
        </Reveal>
      </div>

      <p
        aria-hidden="true"
        class="pointer-events-none select-none whitespace-nowrap text-center font-heading text-[clamp(2.5rem,14vw,12rem)] leading-none text-main"
      >
        SPRINGCHAT
      </p>

      <div class="border-t-2 border-background/30">
        <div
          class="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm font-medium text-background/80 sm:flex-row sm:px-6"
        >
          <p>&copy; {{ new Date().getFullYear() }} SpringChat. All rights reserved.</p>
          <p>
            Built by <span class="font-bold text-lime">{{ developer.name }}</span>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
