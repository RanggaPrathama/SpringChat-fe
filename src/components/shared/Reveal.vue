<script setup lang="ts">
import { motion } from 'motion-v'

import { easeOutQuick, REVEAL_VIEWPORT } from '@/lib/motion'

withDefaults(defineProps<{ delay?: number; y?: number }>(), { delay: 0, y: 28 })
</script>

<template>
  <motion.div
    :initial="{ opacity: 0, y }"
    :while-in-view="{ opacity: 1, y: 0 }"
    :in-view-options="REVEAL_VIEWPORT"
    :transition="{ ...easeOutQuick, delay }"
  >
    <slot />
  </motion.div>
</template>
