import { createRouter, createWebHistory } from 'vue-router'

import { useAuthStore } from '@/modules/auth/store/auth.store'

const routes = [
  {
    path: '/',
    name: 'landing',
    meta: { guestOnly: true },
    component: () => import('@/modules/landing/views/LandingView.vue'),
  },
  {
    path: '/',
    component: () => import('@/app/layouts/AuthLayout.vue'),
    meta: { guestOnly: true },
    children: [
      { path: 'login', name: 'login', component: () => import('@/modules/auth/views/LoginView.vue') },
      { path: 'register', name: 'register', component: () => import('@/modules/auth/views/RegisterView.vue') },
    ],
  },
  {
    path: '/chats',
    component: () => import('@/app/layouts/ChatLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'inbox' },
      {
        path: ':conversationId',
        name: 'chat',
        component: () => import('@/modules/messages/views/ChatView.vue'),
        props: true,
      },
    ],
  },
  {
    path: '/new-message',
    name: 'new-message',
    meta: { requiresAuth: true },
    component: () => import('@/modules/conversations/views/NewMessageView.vue'),
  },
  {
    path: '/settings',
    component: () => import('@/app/layouts/SettingsLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'settings' },
      { path: 'profile', name: 'profile', component: () => import('@/modules/users/views/ProfileView.vue') },
      { path: 'account', name: 'settings-account', component: () => import('@/modules/users/views/AccountView.vue') },
      { path: 'about', name: 'settings-about', component: () => import('@/modules/users/views/AboutView.vue') },
      {
        path: 'notifications',
        name: 'settings-notifications',
        meta: { title: 'Notifications', description: 'Message, group and sound alerts' },
        component: () => import('@/modules/users/views/ComingSoonView.vue'),
      },
      {
        path: 'privacy',
        name: 'settings-privacy',
        meta: { title: 'Privacy', description: 'Blocked contacts and disappearing messages' },
        component: () => import('@/modules/users/views/ComingSoonView.vue'),
      },
      {
        path: 'chat',
        name: 'settings-chat',
        meta: { title: 'Chat settings', description: 'Theme, wallpaper and chat history' },
        component: () => import('@/modules/users/views/ComingSoonView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/app/views/NotFoundView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'inbox' }
  }

  return true
})
