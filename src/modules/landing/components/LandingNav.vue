<script setup lang="ts">
import { useEventListener, useWindowSize } from '@vueuse/core'
import { ArrowRight, Menu, X } from 'lucide-vue-next'
import { AnimatePresence, motion } from 'motion-v'
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'

import AppLogo from '@/components/shared/AppLogo.vue'
import { Button } from '@/components/ui/button'
import { springPop } from '@/lib/motion'

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Developer', href: '#developer' },
]

const SCROLL_THRESHOLD = 24
const PILL_MAX_WIDTH = 1040
const INK = '#0a0a0a'

const scrolled = ref(false)
const menuOpen = ref(false)
const { width } = useWindowSize()
const route = useRoute()
let frame = 0

function update() {
  frame = 0
  scrolled.value = window.scrollY > SCROLL_THRESHOLD
}

useEventListener(
  window,
  'scroll',
  () => {
    if (!frame) frame = requestAnimationFrame(update)
  },
  { passive: true },
)
useEventListener(window, 'keydown', (event: KeyboardEvent) => {
  if (event.key === 'Escape') menuOpen.value = false
})
onMounted(update)
watch(
  () => route.fullPath,
  () => (menuOpen.value = false),
)
watch(scrolled, (value) => {
  if (value) menuOpen.value = false
})

// Numeric values only, so the morph is a smooth tween of width, radius and borders.
const bar = computed(() =>
  scrolled.value
    ? {
        maxWidth: width.value,
        borderRadius: 0,
        marginTop: 0,
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 2,
        boxShadow: `0px 0px 0px 0px ${INK}`,
      }
    : {
        maxWidth: Math.min(PILL_MAX_WIDTH, width.value - 24),
        borderRadius: 9999,
        marginTop: 12,
        borderTopWidth: 2,
        borderLeftWidth: 2,
        borderRightWidth: 2,
        borderBottomWidth: 2,
        boxShadow: `4px 4px 0px 0px ${INK}`,
      },
)
</script>

<template>
  <header class="sticky top-0 z-40 w-full">
    <motion.div
      :initial="{ opacity: 0, y: -24 }"
      :animate="{ opacity: 1, y: 0 }"
      :transition="springPop"
      class="mx-auto"
    >
      <motion.div
        :initial="false"
        data-testid="landing-bar"
        :animate="bar"
        :transition="{ type: 'spring', stiffness: 260, damping: 30 }"
        class="mx-auto flex w-full items-center justify-between gap-3 border-solid border-border bg-secondary-background px-4 py-2 sm:px-6"
      >
        <RouterLink
          to="/"
          aria-label="SpringChat home"
          class="rounded-base focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <AppLogo />
        </RouterLink>

        <nav aria-label="Primary" class="hidden items-center gap-8 md:flex">
          <a
            v-for="link in links"
            :key="link.href"
            :href="link.href"
            class="rounded-base text-sm font-bold underline-offset-4 hover:underline focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            {{ link.label }}
          </a>
        </nav>

        <div class="flex items-center gap-2 sm:gap-3">
          <Button as-child variant="neutral" size="sm" class="hidden sm:inline-flex">
            <RouterLink :to="{ name: 'login' }">Log in</RouterLink>
          </Button>
          <Button as-child size="sm">
            <RouterLink :to="{ name: 'register' }">
              Get started
              <ArrowRight aria-hidden="true" />
            </RouterLink>
          </Button>
          <Button
            variant="neutral"
            size="icon-sm"
            class="md:hidden"
            :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="menuOpen"
            aria-controls="mobile-menu"
            @click="menuOpen = !menuOpen"
          >
            <X v-if="menuOpen" />
            <Menu v-else />
          </Button>
        </div>
      </motion.div>
    </motion.div>

    <AnimatePresence>
      <motion.nav
        v-if="menuOpen"
        id="mobile-menu"
        aria-label="Mobile"
        :initial="{ opacity: 0, y: -8 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -8 }"
        :transition="{ duration: 0.18 }"
        class="absolute inset-x-3 top-[4.75rem] rounded-base border-2 border-border bg-secondary-background p-3 shadow-shadow md:hidden"
      >
        <ul class="flex flex-col gap-1">
          <li v-for="link in links" :key="link.href">
            <a
              :href="link.href"
              class="block rounded-base px-3 py-3 font-bold hover:bg-main focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
              @click="menuOpen = false"
            >
              {{ link.label }}
            </a>
          </li>
          <li>
            <RouterLink
              :to="{ name: 'login' }"
              class="block rounded-base px-3 py-3 font-bold hover:bg-main focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
            >
              Log in
            </RouterLink>
          </li>
        </ul>
      </motion.nav>
    </AnimatePresence>
  </header>
</template>
