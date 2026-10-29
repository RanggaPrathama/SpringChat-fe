<script setup lang="ts">
import { WifiOff } from 'lucide-vue-next'
import { onMounted, onUnmounted, ref } from 'vue'

const isOnline = ref(navigator.onLine)

function updateStatus() {
  isOnline.value = navigator.onLine
}

onMounted(() => {
  window.addEventListener('online', updateStatus)
  window.addEventListener('offline', updateStatus)
})

onUnmounted(() => {
  window.removeEventListener('online', updateStatus)
  window.removeEventListener('offline', updateStatus)
})
</script>

<template>
  <div
    v-if="!isOnline"
    role="status"
    class="flex items-center justify-center gap-2 border-b-2 border-border bg-danger px-4 py-2 text-sm font-bold text-white"
  >
    <WifiOff class="size-4" aria-hidden="true" />
    You're offline. Messages will send once you're back online.
  </div>
</template>
