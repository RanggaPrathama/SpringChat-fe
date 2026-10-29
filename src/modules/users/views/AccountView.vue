<script setup lang="ts">
import { LogOut } from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card'
import { useAuth } from '@/modules/auth/composables/useAuth'

import { useMe } from '../composables/useMe'

const { data: me } = useMe()
const { logout } = useAuth()
</script>

<template>
  <section aria-labelledby="account-title" class="flex flex-col gap-6">
    <Card>
      <CardHeader>
        <h1 id="account-title" class="font-heading text-3xl">Account</h1>
        <CardDescription>Details of the account you are signed in with.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl v-if="me" class="flex flex-col gap-3">
          <div class="rounded-base border-2 border-border bg-background px-3 py-2">
            <dt class="text-xs font-bold uppercase tracking-wide text-foreground/70">
              Display name
            </dt>
            <dd class="font-bold">{{ me.displayName }}</dd>
          </div>
          <div class="rounded-base border-2 border-border bg-background px-3 py-2">
            <dt class="text-xs font-bold uppercase tracking-wide text-foreground/70">Username</dt>
            <dd class="font-bold">@{{ me.username }}</dd>
          </div>
          <div class="rounded-base border-2 border-border bg-background px-3 py-2">
            <dt class="text-xs font-bold uppercase tracking-wide text-foreground/70">User ID</dt>
            <dd class="font-bold">{{ me.id }}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <h2 class="font-heading text-2xl">Log out</h2>
        <CardDescription>
          You will be signed out on this device. Your session is kept in memory only, so reloading
          the page also signs you out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="neutral" class="w-full sm:w-auto" @click="logout">
          <LogOut aria-hidden="true" />
          Log out
        </Button>
      </CardContent>
    </Card>
  </section>
</template>
