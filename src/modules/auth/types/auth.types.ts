import type { User } from '@/modules/users/types/user.types'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  user: User
  expiresAt?: string
}
