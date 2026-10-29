import { keepPreviousData, useQuery } from '@tanstack/vue-query'
import { computed, onUnmounted, ref, watch } from 'vue'

import { queryKeys } from '@/lib/queryKeys'

import { usersService } from '../services/users.service'

const DEBOUNCE_MS = 300

export function useUserSearch() {
  const search = ref('')
  const term = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(search, (value) => {
    clearTimeout(timer)
    timer = setTimeout(() => (term.value = value.trim()), DEBOUNCE_MS)
  })
  onUnmounted(() => clearTimeout(timer))

  const query = useQuery({
    queryKey: computed(() => queryKeys.users(term.value)),
    // vue-query aborts the in-flight request via `signal` when the key changes.
    queryFn: ({ signal }) => usersService.findUsers(term.value, signal),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  })

  const results = computed(() => query.data.value ?? [])
  const isSettling = computed(() => search.value.trim() !== term.value)

  return {
    search,
    results,
    isPending: query.isPending,
    isError: query.isError,
    isSettling,
    retry: () => query.refetch(),
  }
}
