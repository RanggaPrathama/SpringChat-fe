import { z } from 'zod'

const envSchema = z.object({
  apiBaseUrl: z.string().url(),
  wsUrl: z.string().min(1),
  useMocks: z.boolean(),
})

export const env = envSchema.parse({
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  wsUrl: import.meta.env.VITE_WS_URL,
  useMocks: import.meta.env.VITE_USE_MOCKS === 'true',
})
