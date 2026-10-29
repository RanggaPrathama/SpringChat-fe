import { http } from '@/lib/http/client'

import type { AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types'

export const authService = {
  async login(request: LoginRequest): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/login', request)
    return data
  },

  async register(request: RegisterRequest): Promise<AuthResponse> {
    const { data } = await http.post<AuthResponse>('/auth/register', request)
    return data
  },

  async logout(): Promise<void> {
    await http.post('/auth/logout')
  },
}
