<script setup lang="ts">
import CtaSection from '../components/CtaSection.vue'
import FeaturesSection from '../components/FeaturesSection.vue'
import HeroSection from '../components/HeroSection.vue'
import HowItWorks from '../components/HowItWorks.vue'
import LandingFooter from '../components/LandingFooter.vue'
import LandingNav from '../components/LandingNav.vue'
</script>

<template>
  <div class="min-h-dvh overflow-x-clip bg-background">
    <LandingNav />
    <main >
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <CtaSection />
    </main>
    <LandingFooter />
  </div>
</template>
