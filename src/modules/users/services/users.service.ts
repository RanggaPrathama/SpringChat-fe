import { http } from '@/lib/http/client'

import type { UpdateProfileRequest, User } from '../types/user.types'

export const usersService = {
  async getMe(): Promise<User> {
    const { data } = await http.get<User>('/users/me')
    return data
  },

  async findUsers(search: string, signal?: AbortSignal): Promise<User[]> {
    const { data } = await http.get<User[]>('/users', { params: { search }, signal })
    return data
  },

  async updateMe(request: UpdateProfileRequest): Promise<User> {
    const { data } = await http.patch<User>('/users/me', request)
    return data
  },
}
