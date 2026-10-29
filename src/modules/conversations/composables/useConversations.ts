import { useQuery } from '@tanstack/vue-query'

import { queryKeys } from '@/lib/queryKeys'

import { conversationsService } from '../services/conversations.service'

export function useConversations() {
  return useQuery({
    queryKey: queryKeys.conversations,
    queryFn: conversationsService.listConversations,
  })
}
