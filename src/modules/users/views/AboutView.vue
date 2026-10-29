<script setup lang="ts">
import { Mail } from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { developer } from '@/lib/developer'
import { env } from '@/lib/env'

const shortcuts = [
  { keys: 'Enter', action: 'Send the message (desktop)' },
  { keys: 'Shift + Enter', action: 'New line in the message' },
  { keys: 'Esc', action: 'Close a dialog, the emoji picker or the menu' },
]
</script>

<template>
  <section aria-labelledby="about-title" class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <h1 id="about-title" class="font-heading text-3xl">About SpringChat</h1>
        <CardDescription>
          A fast, friendly messenger. Find people, start direct or group conversations and keep
          every chat in one tidy place.
        </CardDescription>
      </CardHeader>
      <CardContent v-if="env.useMocks">
        <Badge variant="lime">Running with mock data</Badge>
        <p class="mt-2 text-sm font-medium text-foreground/70">
          This build talks to a mock API in your browser. Nothing you send leaves this device.
        </p>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h2 class="font-heading text-2xl">Keyboard shortcuts</h2>
      </CardHeader>
      <CardContent>
        <ul class="flex flex-col gap-2">
          <li
            v-for="item in shortcuts"
            :key="item.keys"
            class="flex items-center justify-between gap-3 rounded-base border-2 border-border bg-background px-3 py-2"
          >
            <span class="text-sm font-medium">{{ item.action }}</span>
            <kbd
              class="shrink-0 rounded-base border-2 border-border bg-main px-2 py-0.5 text-xs font-bold"
            >
              {{ item.keys }}
            </kbd>
          </li>
        </ul>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h2 class="font-heading text-2xl">Developer</h2>
        <CardDescription>Questions or feedback? Reach out.</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="font-heading text-xl">{{ developer.name }}</p>
        <a
          :href="`mailto:${developer.email}`"
          :aria-label="`Email ${developer.name}`"
          class="mt-3 inline-flex items-center gap-2 rounded-base border-2 border-border bg-main px-3 py-2 text-sm font-bold shadow-shadow transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
        >
          <Mail class="size-4" aria-hidden="true" />
          {{ developer.email }}
        </a>
      </CardContent>
    </Card>
  </section>
</template>
