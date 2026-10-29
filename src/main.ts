import './assets/styles/main.css'

import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './app/App.vue'
import { setupAuthHttp } from './app/providers/authHttp'
import { queryClient } from './app/providers/queryClient'
import { router } from './app/router'
import { env } from './lib/env'

async function bootstrap() {
  if (env.useMocks) {
    const { worker } = await import('./mocks/browser')
    await worker.start({ onUnhandledRequest: 'bypass' })
  }

  const app = createApp(App)

  app.use(createPinia())
  app.use(VueQueryPlugin, { queryClient })
  setupAuthHttp(router)
  app.use(router)

  app.mount('#app')
}

bootstrap()
