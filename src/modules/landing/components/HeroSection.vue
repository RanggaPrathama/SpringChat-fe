<script setup lang="ts">
import { ArrowRight, Check, CheckCheck } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { RouterLink } from 'vue-router'

import ArrowDoodle from '@/components/shared/decor/ArrowDoodle.vue'
import Squiggle from '@/components/shared/decor/Squiggle.vue'
import StarBurst from '@/components/shared/decor/StarBurst.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { easeOutQuick, springPop } from '@/lib/motion'

const rise = { opacity: 0, y: 36 }
const shown = { opacity: 1, y: 0 }
const float = { repeat: Infinity, duration: 5, ease: 'easeInOut' } as const

const bubbles = [
  { own: false, text: 'Are we still on for 5pm?' },
  { own: true, text: 'Yes! Bringing the notes.', read: true },
  { own: false, text: 'Perfect, see you there.' },
  { own: true, text: 'On my way', read: false },
]
</script>

<template>
  <section
    class="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-2 lg:pt-15"
  >
    <motion.div
      class="absolute -left-4 top-0 hidden sm:block"
      :animate="{ y: [0, -10, 0], rotate: [12, 24, 12] }"
      :transition="float"
    >
      <StarBurst class="size-12 fill-lime" />
    </motion.div>

    <div class="relative">
      <h1 class="text-5xl sm:text-6xl">
        <motion.span
          class="inline-block"
          :initial="rise"
          :animate="shown"
          :transition="{ ...easeOutQuick, delay: 0.05 }"
        >
          Start chatting.
        </motion.span>
        <br />
        <motion.span
          class="mr-2 mt-2 inline-block rounded-base border-2 border-border bg-main px-3 shadow-shadow"
          :initial="{ opacity: 0, scale: 0.6, rotate: -8 }"
          :animate="{ opacity: 1, scale: 1, rotate: -1 }"
          :transition="{ ...springPop, delay: 0.3 }"
        >
          Stay
        </motion.span>
        <motion.span
          class="inline-block text-blue"
          :initial="rise"
          :animate="shown"
          :transition="{ ...easeOutQuick, delay: 0.4 }"
        >
          in sync
        </motion.span>
        <motion.span
          class="inline-block"
          :initial="rise"
          :animate="shown"
          :transition="{ ...easeOutQuick, delay: 0.5 }"
        >
          with your people.
        </motion.span>
      </h1>

      <motion.div
        class="mt-3 w-fit origin-left"
        :initial="{ scaleX: 0, opacity: 0 }"
        :animate="{ scaleX: 1, opacity: 1 }"
        :transition="{ duration: 0.6, delay: 0.7, ease: 'easeOut' }"
      >
        <Squiggle />
      </motion.div>

      <motion.p
        class="mt-6 max-w-md text-base font-medium text-foreground/80"
        :initial="rise"
        :animate="shown"
        :transition="{ ...easeOutQuick, delay: 0.75 }"
      >
        SpringChat is a fast, friendly messenger. Find people, start a conversation, and keep every
        chat in one tidy place.
      </motion.p>

      <motion.div
        class="relative mt-8 flex flex-wrap items-center gap-4"
        :initial="rise"
        :animate="shown"
        :transition="{ ...easeOutQuick, delay: 0.9 }"
      >
        <Button as-child size="lg" variant="lime">
          <RouterLink :to="{ name: 'register' }">
            Get started
            <ArrowRight aria-hidden="true" />
          </RouterLink>
        </Button>
        <Button as-child size="lg" variant="neutral">
          <RouterLink :to="{ name: 'login' }">I have an account</RouterLink>
        </Button>
        <ArrowDoodle
          class="absolute left-[28rem] top-1/2 hidden -translate-y-1/2 -rotate-12 lg:block"
        />
      </motion.div>
    </div>

    <motion.div
      class="relative mx-auto w-full max-w-md"
      aria-hidden="true"
      :initial="{ opacity: 0, x: 48, rotate: 3 }"
      :animate="{ opacity: 1, x: 0, rotate: 0 }"
      :transition="{ ...springPop, delay: 0.35 }"
    >
      <motion.div
        class="absolute -right-4 -top-12 z-10"
        :animate="{ y: [0, -8, 0], rotate: [12, 4, 12] }"
        :transition="{ ...float, duration: 4 }"
      >
        <StarBurst class="size-16 fill-main" />
      </motion.div>

      <Card class="gap-0 overflow-hidden py-0">
        <div class="flex items-center gap-2 border-b-2 border-border bg-cyan px-4 py-3">
          <span class="size-3 rounded-full border-2 border-border bg-secondary-background" />
          <span class="size-3 rounded-full border-2 border-border bg-main" />
          <span class="size-3 rounded-full border-2 border-border bg-lime" />
          <span class="ml-2 text-sm font-bold">Ava Chen</span>
          <Badge variant="lime" class="ml-auto">online</Badge>
        </div>

        <div class="flex flex-col gap-3 bg-background p-4">
          <motion.div
            v-for="(bubble, index) in bubbles"
            :key="bubble.text"
            class="flex items-end gap-2"
            :class="bubble.own ? 'justify-end' : ''"
            :initial="{ opacity: 0, y: 14, scale: 0.92 }"
            :animate="{ opacity: 1, y: 0, scale: 1 }"
            :transition="{ ...springPop, delay: 0.8 + index * 0.22 }"
          >
            <UserAvatar v-if="!bubble.own" name="Ava Chen" size="sm" />
            <p
              class="max-w-[75%] rounded-base border-2 border-border px-3 py-2 text-sm font-medium shadow-shadow"
              :class="bubble.own ? 'bg-main' : 'bg-secondary-background'"
            >
              {{ bubble.text }}
              <CheckCheck
                v-if="bubble.own && bubble.read"
                class="ml-1 inline size-4 align-text-bottom"
              />
              <Check v-else-if="bubble.own" class="ml-1 inline size-4 align-text-bottom" />
            </p>
          </motion.div>
        </div>
      </Card>

      <motion.div
        class="absolute -bottom-6 -left-4 rounded-base border-2 border-border bg-lime px-4 py-2 shadow-shadow"
        :initial="{ opacity: 0, scale: 0.6, rotate: -8 }"
        :animate="{ opacity: 1, scale: 1, rotate: 2 }"
        :transition="{ ...springPop, delay: 1.3 }"
      >
        <p class="font-heading text-sm">Fast. Simple. Yours.</p>
      </motion.div>
    </motion.div>
  </section>
</template>
