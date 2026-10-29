<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { computed } from 'vue'

import UserSearch from '@/modules/users/components/UserSearch.vue'
import type { User } from '@/modules/users/types/user.types'

const props = defineProps<{ selected: User[]; disabled?: boolean }>()
const emit = defineEmits<{ toggle: [user: User] }>()

const selectedIds = computed(() => props.selected.map((user) => user.id))
</script>

<template>
  <div class="flex min-h-0 flex-col gap-3">
    <ul v-if="selected.length > 0" class="flex flex-wrap gap-2" aria-label="Selected members">
      <li v-for="user in selected" :key="user.id">
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border-2 border-border bg-main py-0.5 pl-3 pr-2 text-sm font-bold focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          :aria-label="`Remove ${user.displayName}`"
          :disabled="disabled"
          @click="emit('toggle', user)"
        >
          {{ user.displayName }}
          <X class="size-3.5" aria-hidden="true" />
        </button>
      </li>
    </ul>

    <UserSearch selectable :selected-ids="selectedIds" :disabled="disabled" @select="emit('toggle', $event)" />
  </div>
</template>
