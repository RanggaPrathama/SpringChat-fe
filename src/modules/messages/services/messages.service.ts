import { http } from '@/lib/http/client'
import type { ID } from '@/modules/users/types/user.types'

import type { Message, MessagePage, SendMessageRequest } from '../types/message.types'

export const messagesService = {
  async getPage(conversationId: ID, cursor?: string): Promise<MessagePage> {
    const { data } = await http.get<MessagePage>(`/conversations/${conversationId}/messages`, {
      params: { cursor, limit: 30 },
    })
    return data
  },

  async send(conversationId: ID, request: SendMessageRequest): Promise<Message> {
    const { data } = await http.post<Message>(`/conversations/${conversationId}/messages`, request)
    return data
  },
}
