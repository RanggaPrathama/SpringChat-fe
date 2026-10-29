<script setup lang="ts">
import StarBurst from './decor/StarBurst.vue'

withDefaults(
  defineProps<{
    title: string
    description?: string
  }>(),
  { description: '' },
)
</script>

<template>
  <div class="flex flex-col items-center gap-3 px-6 text-center">
    <StarBurst class="size-14 fill-main" />
    <p class="font-heading text-xl">{{ title }}</p>
    <p v-if="description" class="max-w-xs text-sm font-medium text-foreground/70">{{ description }}</p>
    <slot />
  </div>
</template>
