import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/modules/auth/store/auth.store'

import { router } from './index'

const user = { id: 1, username: 'demo', displayName: 'Demo', avatarUrl: null }

describe('router guard', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    await router.replace('/login').catch(() => undefined)
  })

  it('redirects guests away from protected routes', async () => {
    await router.push('/chats')
    expect(router.currentRoute.value.name).toBe('login')
  })

  it('lets guests open the landing page', async () => {
    await router.push('/')
    expect(router.currentRoute.value.name).toBe('landing')
  })

  it('redirects authenticated users away from guest-only routes', async () => {
    await router.replace('/register')
    useAuthStore().setSession({ user, accessToken: 'token' })
    await router.push('/login')
    expect(router.currentRoute.value.name).toBe('inbox')
  })
})
