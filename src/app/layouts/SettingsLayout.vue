<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'

import EmptyState from '@/components/shared/EmptyState.vue'
import { Button } from '@/components/ui/button'
import { useVisualViewportHeight } from '@/lib/viewport'
import SettingsMenu from '@/modules/users/components/SettingsMenu.vue'

const route = useRoute()
const isDetailOpen = computed(() => route.name !== 'settings')
const shell = ref<HTMLElement | null>(null)
useVisualViewportHeight(shell)
</script>

<template>
  <div ref="shell" class="h-app flex w-full bg-secondary-background">
    <aside
      class="w-full flex-col overflow-hidden bg-secondary-background md:flex md:w-[340px] md:shrink-0 md:border-r-2 md:border-border lg:w-[384px]"
      :class="isDetailOpen ? 'hidden md:flex' : 'flex'"
      aria-label="Settings menu"
    >
      <SettingsMenu />
    </aside>

    <main v-if="isDetailOpen" class="flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      <div class="border-b-2 border-border bg-secondary-background px-4 py-3 md:hidden">
        <Button as-child variant="neutral" size="sm">
          <RouterLink :to="{ name: 'settings' }">
            <ArrowLeft aria-hidden="true" />
            Settings
          </RouterLink>
        </Button>
      </div>
      <div class="min-h-0 flex-1 overflow-y-auto">
        <div class="mx-auto w-full max-w-xl p-4 sm:p-8">
          <RouterView />
        </div>
      </div>
    </main>
    <main
      v-else
      class="bg-dots hidden min-w-0 flex-1 flex-col items-center justify-center overflow-hidden bg-background md:flex"
    >
      <div class="rounded-base border-2 border-border bg-secondary-background py-8 shadow-shadow">
        <EmptyState
          title="Settings"
          description="Pick a section on the left to see and change its details."
        />
      </div>
    </main>
  </div>
</template>
