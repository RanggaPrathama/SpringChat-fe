import type { ConversationSummary } from '@/modules/conversations/types/conversation.types'
import type { Message } from '@/modules/messages/types/message.types'
import type { User } from '@/modules/users/types/user.types'

// Dev-only fixtures: served by MSW when VITE_USE_MOCKS=true, never shipped to production.
export const DEMO_EMAIL = 'demo@springchat.dev'
export const DEMO_PASSWORD = 'password123'

export const mockDemoUser: User = {
  id: 1,
  username: 'demo',
  displayName: 'Jordan Lee',
  avatarUrl: null,
}

const ava: User = { id: 2, username: 'ava.chen', displayName: 'Ava Chen', avatarUrl: null }
const sam: User = { id: 3, username: 'sam.rivera', displayName: 'Sam Rivera', avatarUrl: null }
const priya: User = { id: 4, username: 'priya.k', displayName: 'Priya Kapoor', avatarUrl: null }
const theo: User = { id: 5, username: 'theo.b', displayName: 'Theo Baptiste', avatarUrl: null }
const mina: User = { id: 6, username: 'mina.park', displayName: 'Mina Park', avatarUrl: null }

/** Everyone searchable in the directory (registered users are appended at runtime). */
export const directory: User[] = [mockDemoUser, ava, sam, priya, theo, mina]

export const peerReplies = [
  'Sounds good!',
  'Haha, nice one.',
  'Let me check and get back to you.',
  'Can we talk about it tomorrow?',
  'Got it, thanks!',
  'On my way.',
]

export const messageStore = new Map<number, Message[]>()
export const conversationStore: ConversationSummary[] = []

let nextMessageId = 5000
let nextConversationId = 200

export function newMessageId(): number {
  return nextMessageId++
}

export function newConversationId(): number {
  return nextConversationId++
}

const MINUTE = 60_000

function msg(id: number, conversationId: number, senderId: number, content: string, minutesAgo: number): Message {
  return {
    id,
    conversationId,
    senderId,
    content,
    createdAt: new Date(Date.now() - minutesAgo * MINUTE).toISOString(),
    status: 'READ',
  }
}

function seed(
  id: number,
  type: 'PRIVATE' | 'GROUP',
  name: string | null,
  participants: User[],
  messages: Message[],
  unreadCount: number,
) {
  const last = messages[messages.length - 1] ?? null
  messageStore.set(id, messages)
  conversationStore.push({
    id,
    type,
    name,
    participants,
    lastMessage: last,
    unreadCount,
    updatedAt: last?.createdAt ?? new Date().toISOString(),
  })
}

const avaTalk = [
  'Hey! Did you see the new design?',
  'Not yet, send it over?',
  'Sure, one sec.',
  'Here you go: https://example.com/a-really-long-link-that-should-wrap-and-never-overflow-the-bubble-container/page',
  'Love the yellow.',
  'Right? Neobrutalism all the way.',
  'Are we still on for 5pm?',
  'Yes! Bringing the notes.',
]

// 120 messages so the first page (30) leaves older history to paginate through.
const longHistory: Message[] = Array.from({ length: 120 }, (_, i) => {
  const mine = i % 3 === 1
  const text = avaTalk[i % avaTalk.length]
  return msg(1000 + i, 101, mine ? mockDemoUser.id : ava.id, `${text}${i < 100 ? ` (#${i + 1})` : ''}`, (120 - i) * 38)
})
longHistory.push(msg(1120, 101, ava.id, 'See you at 5pm then!', 4))

seed(101, 'PRIVATE', null, [mockDemoUser, ava], longHistory, 2)
seed(
  102,
  'PRIVATE',
  null,
  [mockDemoUser, sam],
  [
    msg(2001, 102, sam.id, 'Invoice is attached.', 180),
    msg(2002, 102, mockDemoUser.id, 'Sounds good, thank you!', 60),
  ],
  0,
)
seed(
  103,
  'PRIVATE',
  null,
  [mockDemoUser, priya],
  [msg(3001, 103, priya.id, 'Can you send the file again?', 24 * 60)],
  1,
)
seed(
  104,
  'GROUP',
  'Weekend Hiking',
  [mockDemoUser, ava, sam, theo],
  [
    msg(4001, 104, theo.id, 'Trail is open this Saturday.', 300),
    msg(4002, 104, sam.id, 'I can drive!', 280),
    msg(4003, 104, mockDemoUser.id, 'Count me in.', 270),
    msg(4004, 104, ava.id, 'Bringing snacks.', 120),
  ],
  0,
)
