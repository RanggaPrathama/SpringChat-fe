import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import type { User } from '@/modules/users/types/user.types'

import type { AuthResponse } from '../types/auth.types'

// The access token lives in memory only (docs/architecture/STATE_AND_DATA.md):
// a page refresh logs the user out until the backend refresh strategy is agreed.
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref<string | null>(null)

  const isAuthenticated = computed(() => user.value !== null && accessToken.value !== null)

  function setSession(session: Pick<AuthResponse, 'user' | 'accessToken'>) {
    user.value = session.user
    accessToken.value = session.accessToken
  }

  function setUser(next: User) {
    user.value = next
  }

  function clear() {
    user.value = null
    accessToken.value = null
  }

  return { user, accessToken, isAuthenticated, setSession, setUser, clear }
})
