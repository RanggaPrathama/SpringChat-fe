import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useRouter } from 'vue-router'

import { toAppError } from '@/lib/errors'
import { disconnectRealtime } from '@/lib/realtime/stomp'

import { useOutboxStore } from '@/modules/messages/store/outbox.store'

import { authService } from '../services/auth.service'
import { useAuthStore } from '../store/auth.store'

export function authErrorMessage(error: unknown, context: 'login' | 'register'): string {
  const appError = toAppError(error)

  switch (appError.kind) {
    case 'unauthorized':
      return 'Email or password is incorrect.'
    case 'conflict':
      return 'An account with this email or username already exists.'
    case 'validation':
      return 'Please check the highlighted fields and try again.'
    case 'offline':
      return appError.message
    case 'rate_limited':
      return 'Too many attempts. Please wait a moment and try again.'
    default:
      return context === 'login'
        ? 'We could not sign you in. Please try again.'
        : 'We could not create your account. Please try again.'
  }
}

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const queryClient = useQueryClient()
  const outbox = useOutboxStore()

  const login = useMutation({
    mutationFn: authService.login,
    onSuccess: (session) => {
      authStore.setSession(session)
      router.replace({ name: 'inbox' })
    },
  })

  const register = useMutation({
    mutationFn: authService.register,
    onSuccess: (session) => {
      authStore.setSession(session)
      router.replace({ name: 'inbox' })
    },
  })

  async function logout() {
    try {
      await authService.logout()
    } catch {
      // the local session is cleared regardless of the server response
    }
    disconnectRealtime()
    authStore.clear()
    outbox.clearAll()
    queryClient.clear()
    router.replace({ name: 'landing' })
  }

  return { login, register, logout }
}
