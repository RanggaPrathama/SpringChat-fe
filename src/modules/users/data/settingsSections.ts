import { Bell, Info, KeyRound, Lock, MessageSquare, UserRound } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface SettingsSection {
  key: string
  label: string
  description: string
  icon: Component
  routeName: string
  soon?: boolean
}

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    key: 'profile',
    label: 'Profile',
    description: 'Name, photo, username',
    icon: UserRound,
    routeName: 'profile',
  },
  {
    key: 'account',
    label: 'Account',
    description: 'Account info, log out',
    icon: KeyRound,
    routeName: 'settings-account',
  },
  {
    key: 'about',
    label: 'About & help',
    description: 'SpringChat, shortcuts, developer',
    icon: Info,
    routeName: 'settings-about',
  },
  {
    key: 'notifications',
    label: 'Notifications',
    description: 'Message, group and sound alerts',
    icon: Bell,
    routeName: 'settings-notifications',
    soon: true,
  },
  {
    key: 'privacy',
    label: 'Privacy',
    description: 'Blocked contacts and disappearing messages',
    icon: Lock,
    routeName: 'settings-privacy',
    soon: true,
  },
  {
    key: 'chat',
    label: 'Chat settings',
    description: 'Theme, wallpaper and chat history',
    icon: MessageSquare,
    routeName: 'settings-chat',
    soon: true,
  },
]

export function filterSections(sections: SettingsSection[], query: string): SettingsSection[] {
  const term = query.trim().toLowerCase()
  if (!term) return sections
  return sections.filter(
    (section) =>
      section.label.toLowerCase().includes(term) ||
      section.description.toLowerCase().includes(term),
  )
}
