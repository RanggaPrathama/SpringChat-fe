import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it } from 'vitest'
import { createMemoryHistory, createRouter } from 'vue-router'

import App from './App.vue'

describe('App', () => {
  it('mounts without crashing', async () => {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: '/', component: { template: '<div>home</div>' } }],
    })

    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    await router.isReady()
    expect(wrapper.exists()).toBe(true)
  })
})
