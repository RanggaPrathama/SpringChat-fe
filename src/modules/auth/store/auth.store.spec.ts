import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useAuthStore } from './auth.store'

const user = { id: 1, username: 'demo', displayName: 'Demo', avatarUrl: null }

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('is unauthenticated by default', () => {
    expect(useAuthStore().isAuthenticated).toBe(false)
  })

  it('becomes authenticated after setSession and resets on clear', () => {
    const store = useAuthStore()
    store.setSession({ user, accessToken: 'token' })
    expect(store.isAuthenticated).toBe(true)
    store.clear()
    expect(store.isAuthenticated).toBe(false)
    expect(store.accessToken).toBeNull()
  })

  it('never persists the token to web storage', () => {
    const local = vi.spyOn(Storage.prototype, 'setItem')
    useAuthStore().setSession({ user, accessToken: 'token' })
    expect(local).not.toHaveBeenCalled()
    local.mockRestore()
  })
})
