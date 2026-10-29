import { fileURLToPath } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    testTimeout: 15_000,
    env: {
      VITE_API_BASE_URL: 'http://localhost:8080/api/v1',
      VITE_WS_URL: 'ws://localhost:8080/ws',
      VITE_USE_MOCKS: 'false',
    },
    exclude: ['node_modules', 'dist', 'e2e/**'],
  },
})
