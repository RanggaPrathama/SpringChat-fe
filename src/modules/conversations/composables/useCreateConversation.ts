import { useMutation, useQueryClient } from '@tanstack/vue-query'

import { queryKeys } from '@/lib/queryKeys'
import type { ID } from '@/modules/users/types/user.types'

import { conversationsService } from '../services/conversations.service'
import type { Conversation } from '../types/conversation.types'

export function useCreateConversation() {
  const queryClient = useQueryClient()

  function onCreated(conversation: Conversation) {
    queryClient.setQueryData(queryKeys.conversation(conversation.id), conversation)
    queryClient.invalidateQueries({ queryKey: queryKeys.conversations })
  }

  const createPrivate = useMutation({
    mutationFn: (memberId: ID) => conversationsService.createPrivateConversation(memberId),
    onSuccess: onCreated,
  })

  const createGroup = useMutation({
    mutationFn: (input: { name: string; memberIds: ID[] }) =>
      conversationsService.createGroupConversation(input.name, input.memberIds),
    onSuccess: onCreated,
  })

  return { createPrivate, createGroup }
}
