<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <div class="my-4 flex justify-center" role="separator" :aria-label="label">
    <span class="rounded-full border-2 border-border bg-secondary-background px-3 py-0.5 text-xs font-bold">
      {{ label }}
    </span>
  </div>
</template>
