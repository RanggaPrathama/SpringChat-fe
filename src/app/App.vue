<script setup lang="ts">
import { MotionConfig } from 'motion-v'
import { RouterView } from 'vue-router'

import NetworkStatusBanner from '@/components/shared/NetworkStatusBanner.vue'
</script>

<template>
  <MotionConfig reduced-motion="user">
    <NetworkStatusBanner />
    <RouterView />
  </MotionConfig>
</template>
