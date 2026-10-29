<script setup lang="ts">
import { ArrowLeft, Search } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import EmptyState from '@/components/shared/EmptyState.vue'
import UserAvatar from '@/components/shared/UserAvatar.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { useMe } from '../composables/useMe'
import { filterSections, SETTINGS_SECTIONS } from '../data/settingsSections'

const route = useRoute()
const { data: me } = useMe()
const search = ref('')

const sections = computed(() => filterSections(SETTINGS_SECTIONS, search.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <header class="flex items-center gap-3 px-4 pb-2 pt-5">
      <Button as-child variant="neutral" size="icon-sm">
        <RouterLink :to="{ name: 'inbox' }" aria-label="Back to chats">
          <ArrowLeft />
        </RouterLink>
      </Button>
      <h1 class="text-3xl">Settings</h1>
    </header>

    <div class="px-4 pb-3">
      <label for="settings-search" class="sr-only">Search settings</label>
      <div
        class="flex h-10 items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <Search class="size-4 shrink-0" aria-hidden="true" />
        <input
          id="settings-search"
          v-model="search"
          type="search"
          autocomplete="off"
          placeholder="Search settings"
          class="w-full bg-transparent text-base font-medium outline-hidden placeholder:text-foreground/50"
        />
      </div>
    </div>

    <Separator />

    <div class="min-h-0 flex-1 overflow-y-auto bg-background">
      <div
        v-if="me && !search.trim()"
        class="flex flex-col items-center gap-2 px-4 py-6 text-center"
      >
        <UserAvatar :name="me.displayName" :avatar-url="me.avatarUrl" size="xl" />
        <p class="font-heading text-xl leading-tight">{{ me.displayName }}</p>
        <p class="text-sm font-medium text-foreground/70">@{{ me.username }}</p>
      </div>

      <nav aria-label="Settings sections" class="p-2">
        <ul v-if="sections.length > 0" class="flex flex-col gap-2">
          <li v-for="section in sections" :key="section.key">
            <RouterLink
              :to="{ name: section.routeName }"
              class="flex items-center gap-3 rounded-base border-2 px-3 py-3 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
              :class="
                route.name === section.routeName
                  ? 'border-border bg-lime shadow-shadow'
                  : 'border-transparent hover:border-border hover:bg-secondary-background'
              "
              :aria-current="route.name === section.routeName ? 'page' : undefined"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-base border-2 border-border bg-secondary-background"
              >
                <component :is="section.icon" class="size-5" aria-hidden="true" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="flex items-center gap-2">
                  <span class="truncate font-bold">{{ section.label }}</span>
                  <Badge v-if="section.soon" variant="neutral">soon</Badge>
                </span>
                <span class="block truncate text-sm font-medium text-foreground/70">{{
                  section.description
                }}</span>
              </span>
            </RouterLink>
          </li>
        </ul>
        <div v-else class="py-8">
          <EmptyState title="No settings found" description="Try a different word." />
        </div>
      </nav>
    </div>
  </div>
</template>
