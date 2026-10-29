<script setup lang="ts">
import { Search } from 'lucide-vue-next'

import EmptyState from '@/components/shared/EmptyState.vue'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

import { useUserSearch } from '../composables/useUserSearch'
import type { User } from '../types/user.types'
import UserListItem from './UserListItem.vue'

defineProps<{ selectedIds?: number[]; selectable?: boolean; disabled?: boolean }>()
defineEmits<{ select: [user: User] }>()

const { search, results, isPending, isError, isSettling, retry } = useUserSearch()
</script>

<template>
  <div class="flex min-h-0 flex-col gap-3">
    <div>
      <label for="user-search" class="sr-only">Search people</label>
      <div
        class="flex h-10 items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <Search class="size-4 shrink-0" aria-hidden="true" />
        <input
          id="user-search"
          v-model="search"
          type="search"
          autocomplete="off"
          placeholder="Search by name or username"
          class="w-full bg-transparent text-base font-medium outline-hidden placeholder:text-foreground/50"
        />
      </div>
    </div>

    <div class="min-h-40 overflow-y-auto" :aria-busy="isPending || isSettling">
      <ul v-if="isPending" class="flex flex-col gap-2" aria-hidden="true">
        <li v-for="n in 4" :key="n" class="flex items-center gap-3 px-3 py-2">
          <Skeleton class="size-9 rounded-full" />
          <Skeleton class="h-4 w-1/2" />
        </li>
      </ul>

      <div v-else-if="isError" class="flex flex-col items-center gap-3 py-6">
        <EmptyState title="Couldn't search" description="Check your connection and try again." />
        <Button size="sm" variant="neutral" @click="retry">Try again</Button>
      </div>

      <div v-else-if="results.length === 0" class="py-6">
        <EmptyState title="No people found" description="Try a different name or username." />
      </div>

      <ul v-else class="flex flex-col gap-1">
        <li v-for="user in results" :key="user.id">
          <UserListItem
            :user="user"
            :selectable="selectable"
            :selected="selectedIds?.includes(user.id)"
            :disabled="disabled"
            @select="$emit('select', $event)"
          />
        </li>
      </ul>
    </div>
  </div>
</template>
