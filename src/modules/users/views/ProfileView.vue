<script setup lang="ts">
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'

import ProfileForm from '../components/ProfileForm.vue'
import { useMe } from '../composables/useMe'

const { data: me } = useMe()
</script>

<template>
  <section aria-labelledby="profile-title">
    <Card>
      <CardHeader>
        <h1 id="profile-title" class="font-heading text-3xl">Your profile</h1>
        <CardDescription>This is how other people see you in SpringChat.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm v-if="me" :user="me" />
      </CardContent>
    </Card>
  </section>
</template>
