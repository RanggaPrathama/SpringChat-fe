import type { Router } from 'vue-router'

import { registerAuthHandlers } from '@/lib/http/client'
import { useAuthStore } from '@/modules/auth/store/auth.store'
import { useOutboxStore } from '@/modules/messages/store/outbox.store'

import { queryClient } from './queryClient'

export function setupAuthHttp(router: Router): void {
  const authStore = useAuthStore()
  const outbox = useOutboxStore()

  registerAuthHandlers({
    getToken: () => authStore.accessToken,
    onUnauthorized: () => {
      if (!authStore.isAuthenticated) return
      authStore.clear()
      outbox.clearAll()
      queryClient.clear()
      router.replace({ name: 'login' })
    },
  })
}
