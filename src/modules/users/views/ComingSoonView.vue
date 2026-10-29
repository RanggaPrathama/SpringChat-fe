<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import StarBurst from '@/components/shared/decor/StarBurst.vue'
import Sticker from '@/components/shared/Sticker.vue'

const route = useRoute()
const title = computed(() => String(route.meta.title ?? 'This setting'))
const description = computed(() => String(route.meta.description ?? ''))
</script>

<template>
  <section
    aria-labelledby="soon-title"
    class="flex flex-col items-center gap-3 rounded-base border-2 border-border bg-secondary-background px-6 py-10 text-center shadow-shadow"
  >
    <StarBurst class="size-14 fill-main" />
    <h1 id="soon-title" class="font-heading text-3xl">{{ title }}</h1>
    <p class="max-w-xs text-sm font-medium text-foreground/70">
      {{ description }}. This setting is not available yet.
    </p>
    <Sticker>Coming soon</Sticker>
  </section>
</template>
