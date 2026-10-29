import axios from 'axios'

import { env } from '@/lib/env'

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
})

interface AuthHandlers {
  getToken: () => string | null
  onUnauthorized: () => void
}

// lib/ must not import feature code, so the auth module registers its handlers here.
export function registerAuthHandlers({ getToken, onUnauthorized }: AuthHandlers): void {
  http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.set('Authorization', `Bearer ${token}`)
    return config
  })

  http.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      const status = axios.isAxiosError(error) ? error.response?.status : undefined
      const url = axios.isAxiosError(error) ? (error.config?.url ?? '') : ''
      if (status === 401 && !url.startsWith('/auth/')) onUnauthorized()
      return Promise.reject(error)
    },
  )
}
