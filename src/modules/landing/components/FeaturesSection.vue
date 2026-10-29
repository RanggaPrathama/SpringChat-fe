<script setup lang="ts">
import { Lock, Search, Users, Zap } from 'lucide-vue-next'

import StarBurst from '@/components/shared/decor/StarBurst.vue'
import Reveal from '@/components/shared/Reveal.vue'
import Sticker from '@/components/shared/Sticker.vue'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { stagger } from '@/lib/motion'

const features = [
  {
    icon: Zap,
    title: 'Realtime messages',
    text: 'New messages show up as they arrive, with clear sent and delivered states.',
    bg: 'bg-main',
  },
  {
    icon: Lock,
    title: 'Members only',
    text: 'Only people in a conversation can open it. Access is always checked by the server.',
    bg: 'bg-lime',
  },
  {
    icon: Search,
    title: 'Find people fast',
    text: 'Search the directory, open a direct chat, and pick up where you left off.',
    bg: 'bg-secondary-background',
  },
  {
    icon: Users,
    title: 'Group chats',
    text: 'Rooms for teams and friends are on the way.',
    bg: 'bg-secondary-background',
    soon: true,
  },
]
</script>

<template>
  <section
    id="features"
    class="relative scroll-mt-24 overflow-hidden border-y-2 border-border bg-cyan px-4 py-20 sm:mx-4 sm:rounded-section sm:border-2 sm:px-6"
  >
    <StarBurst class="absolute right-6 top-6 hidden size-14 fill-main sm:block" />

    <div class="mx-auto max-w-6xl">
      <Reveal>
        <h2 class="text-4xl sm:text-5xl">
          Everything you need
          <Sticker class="ml-1 align-middle">to talk</Sticker>
        </h2>
      </Reveal>

      <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="(feature, index) in features" :key="feature.title">
          <Reveal :delay="stagger(index)" class="h-full">
            <Card
              :class="[
                'h-full transition-transform hover:-translate-y-1 motion-reduce:transition-none',
                feature.bg,
              ]"
            >
              <CardHeader>
                <span
                  class="mb-2 flex size-11 items-center justify-center rounded-base border-2 border-border bg-secondary-background"
                >
                  <component :is="feature.icon" class="size-5" aria-hidden="true" />
                </span>
                <CardTitle>
                  {{ feature.title }}
                  <Badge v-if="feature.soon" variant="neutral" class="ml-1 align-middle"
                    >soon</Badge
                  >
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription class="text-foreground/80">{{ feature.text }}</CardDescription>
              </CardContent>
            </Card>
          </Reveal>
        </li>
      </ul>
    </div>
  </section>
</template>
