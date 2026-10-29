import { http } from '@/lib/http/client'
import type { ID } from '@/modules/users/types/user.types'

import type { Conversation, ConversationSummary, CreateConversationRequest } from '../types/conversation.types'

async function create(request: CreateConversationRequest): Promise<Conversation> {
  const { data } = await http.post<Conversation>('/conversations', request)
  return data
}

export const conversationsService = {
  async listConversations(): Promise<ConversationSummary[]> {
    const { data } = await http.get<ConversationSummary[]>('/conversations')
    return data
  },

  async getConversation(id: ID): Promise<Conversation> {
    const { data } = await http.get<Conversation>(`/conversations/${id}`)
    return data
  },

  createPrivateConversation(memberId: ID): Promise<Conversation> {
    return create({ type: 'PRIVATE', memberIds: [memberId] })
  },

  createGroupConversation(name: string, memberIds: ID[]): Promise<Conversation> {
    return create({ type: 'GROUP', name, memberIds })
  },
}
