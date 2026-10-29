import { useInfiniteQuery } from '@tanstack/vue-query'
import { computed, type Ref } from 'vue'

import { toAppError } from '@/lib/errors'
import { queryKeys } from '@/lib/queryKeys'

import { messagesService } from '../services/messages.service'
import { useOutboxStore } from '../store/outbox.store'
import { mergeMessages } from '../utils/mergeMessages'

export function useMessages(conversationId: Ref<number>) {
  const outbox = useOutboxStore()

  const query = useInfiniteQuery({
    queryKey: computed(() => queryKeys.messages(conversationId.value)),
    queryFn: ({ pageParam }) => messagesService.getPage(conversationId.value, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    retry: false,
  })

  const messages = computed(() =>
    mergeMessages(
      query.data.value?.pages.flatMap((page) => page.items) ?? [],
      outbox.forConversation(conversationId.value),
    ),
  )

  const errorKind = computed(() => (query.error.value ? toAppError(query.error.value).kind : null))

  return {
    messages,
    errorKind,
    isPending: query.isPending,
    hasOlder: query.hasNextPage,
    isFetchingOlder: query.isFetchingNextPage,
    loadOlder: () => {
      if (query.hasNextPage.value && !query.isFetchingNextPage.value) query.fetchNextPage()
    },
  }
}
