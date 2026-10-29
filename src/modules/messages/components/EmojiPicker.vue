<script setup lang="ts">
import { Clock, Search } from 'lucide-vue-next'
import { computed, ref } from 'vue'

import { ALL_EMOJIS, EMOJI_CATEGORIES, type Emoji, searchEmojis } from '../data/emojis'

const props = defineProps<{ recent: string[] }>()
const emit = defineEmits<{ pick: [char: string] }>()

const query = ref('')
const active = ref<string>(props.recent.length > 0 ? 'recent' : EMOJI_CATEGORIES[0].id)

const recentItems = computed<Emoji[]>(() =>
  props.recent.map((char) => ALL_EMOJIS.find((emoji) => emoji.char === char) ?? { char, name: 'emoji' }),
)

const visible = computed<Emoji[]>(() => {
  if (query.value.trim()) return searchEmojis(query.value)
  if (active.value === 'recent') return recentItems.value
  return EMOJI_CATEGORIES.find((category) => category.id === active.value)?.items ?? []
})

const tabs = computed(() => [
  ...(props.recent.length > 0 ? [{ id: 'recent', label: 'Recent', icon: null as string | null }] : []),
  ...EMOJI_CATEGORIES.map((category) => ({ id: category.id, label: category.label, icon: category.icon })),
])

function label(emoji: Emoji): string {
  return emoji.name.split(' ').slice(0, 3).join(' ')
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <div>
      <label for="emoji-search" class="sr-only">Search emoji</label>
      <div
        class="flex h-9 items-center gap-2 rounded-base border-2 border-border bg-secondary-background px-2.5 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
      >
        <Search class="size-4 shrink-0" aria-hidden="true" />
        <input
          id="emoji-search"
          v-model="query"
          type="search"
          autocomplete="off"
          placeholder="Search emoji"
          class="w-full bg-transparent text-base font-medium outline-hidden placeholder:text-foreground/50"
        />
      </div>
    </div>

    <div v-if="!query.trim()" class="flex gap-1 overflow-x-auto pb-1" role="group" aria-label="Emoji categories">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        class="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-base border-2 text-lg focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        :class="active === tab.id ? 'border-border bg-main' : 'border-transparent hover:border-border'"
        :aria-label="tab.label"
        :aria-pressed="active === tab.id"
        :title="tab.label"
        @click="active = tab.id"
      >
        <Clock v-if="tab.id === 'recent'" class="size-4" aria-hidden="true" />
        <span v-else aria-hidden="true">{{ tab.icon }}</span>
      </button>
    </div>

    <div class="h-56 overflow-y-auto pr-1" aria-live="polite">
      <p v-if="visible.length === 0" class="py-8 text-center text-sm font-bold text-foreground/70">No emoji found.</p>
      <ul v-else class="grid grid-cols-7 gap-1">
        <li v-for="emoji in visible" :key="emoji.char">
          <button
            type="button"
            class="flex size-10 w-full cursor-pointer items-center justify-center rounded-base text-2xl transition-colors hover:bg-lime focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none"
            :aria-label="label(emoji)"
            :title="label(emoji)"
            @click="emit('pick', emoji.char)"
          >
            {{ emoji.char }}
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
