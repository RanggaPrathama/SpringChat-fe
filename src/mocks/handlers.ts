import { delay, http, HttpResponse } from 'msw'

import { env } from '@/lib/env'
import type { ConversationSummary } from '@/modules/conversations/types/conversation.types'
import type { Message } from '@/modules/messages/types/message.types'
import type { User } from '@/modules/users/types/user.types'

import {
  conversationStore,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  directory,
  messageStore,
  mockDemoUser,
  newConversationId,
  newMessageId,
  peerReplies,
} from './data'

const base = env.apiBaseUrl

interface Account {
  email: string
  password: string
  user: User
}

const accounts: Account[] = [{ email: DEMO_EMAIL, password: DEMO_PASSWORD, user: mockDemoUser }]
const sessions = new Map<string, User>()
const failedOnce = new Set<string>()
let nextUserId = 100

const json = <T>(body: T, status = 200) => HttpResponse.json(body as never, { status })
const unauthorized = () => json({ message: 'Unauthorized' }, 401)
const forbidden = () => json({ message: 'Not a member of this conversation' }, 403)
const notFound = () => json({ message: 'Not found' }, 404)
const invalid = (message: string) => json({ message }, 422)

function issueSession(user: User) {
  const accessToken = `mock-token-${user.id}-${Math.random().toString(36).slice(2)}`
  sessions.set(accessToken, user)
  return { accessToken, user }
}

function authenticate(request: Request): User | null {
  const header = request.headers.get('Authorization')
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null
  return token ? (sessions.get(token) ?? null) : null
}

const isMember = (conversation: ConversationSummary, user: User) =>
  conversation.participants.some((participant) => participant.id === user.id)

const findConversation = (id: string | readonly string[] | undefined) =>
  conversationStore.find((conversation) => String(conversation.id) === id)

function touch(conversation: ConversationSummary, message: Message) {
  conversation.lastMessage = message
  conversation.updatedAt = message.createdAt
}

function scheduleReply(conversation: ConversationSummary, me: User) {
  setTimeout(() => {
    const others = conversation.participants.filter((participant) => participant.id !== me.id)
    if (others.length === 0) return
    const peer = others[Math.floor(Math.random() * others.length)]
    const history = messageStore.get(conversation.id) ?? []
    history.forEach((item) => {
      if (item.senderId === me.id) item.status = 'READ'
    })
    const reply: Message = {
      id: newMessageId(),
      conversationId: conversation.id,
      senderId: peer.id,
      content: peerReplies[Math.floor(Math.random() * peerReplies.length)],
      createdAt: new Date().toISOString(),
      status: 'SENT',
    }
    history.push(reply)
    touch(conversation, reply)
    conversation.unreadCount += 1
  }, 2500)
}

export const handlers = [
  http.post(`${base}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email?: string; password?: string }
    const account = accounts.find(
      (item) => item.email === body.email?.trim().toLowerCase() && item.password === body.password,
    )
    if (!account) return json({ message: 'Invalid credentials' }, 401)
    return json(issueSession(account.user))
  }),

  http.post(`${base}/auth/register`, async ({ request }) => {
    const body = (await request.json()) as { username?: string; email?: string; password?: string }
    const username = body.username?.trim() ?? ''
    const email = body.email?.trim().toLowerCase() ?? ''

    if (username.length < 3 || !email.includes('@') || (body.password?.length ?? 0) < 8) {
      return invalid('Invalid input')
    }

    const taken = accounts.some(
      (item) => item.email === email || item.user.username.toLowerCase() === username.toLowerCase(),
    )
    if (taken) return json({ message: 'Account already exists' }, 409)

    const user: User = { id: nextUserId++, username, displayName: username, avatarUrl: null }
    accounts.push({ email, password: body.password as string, user })
    directory.push(user)
    return json(issueSession(user), 201)
  }),

  http.post(`${base}/auth/logout`, ({ request }) => {
    const header = request.headers.get('Authorization')
    if (header?.startsWith('Bearer ')) sessions.delete(header.slice(7))
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${base}/users/me`, ({ request }) => {
    const user = authenticate(request)
    return user ? json(user) : unauthorized()
  }),

  http.patch(`${base}/users/me`, async ({ request }) => {
    const me = authenticate(request)
    if (!me) return unauthorized()
    const body = (await request.json()) as { displayName?: string; avatarUrl?: string | null }

    if (body.displayName !== undefined) {
      const name = body.displayName.trim()
      if (name.length < 1 || name.length > 40) return invalid('Display name must be 1-40 characters')
      me.displayName = name
    }
    if (body.avatarUrl !== undefined) {
      if (body.avatarUrl !== null && !/^https?:\/\//i.test(body.avatarUrl)) return invalid('Invalid avatar URL')
      me.avatarUrl = body.avatarUrl
    }
    return json({ ...me })
  }),

  http.get(`${base}/users`, async ({ request }) => {
    const me = authenticate(request)
    if (!me) return unauthorized()
    await delay(150)
    const search = new URL(request.url).searchParams.get('search')?.trim().toLowerCase() ?? ''
    const results = directory
      .filter((user) => user.id !== me.id)
      .filter((user) => user.displayName.toLowerCase().includes(search) || user.username.toLowerCase().includes(search))
      .slice(0, 20)
    return json(results)
  }),

  http.get(`${base}/conversations`, async ({ request }) => {
    const me = authenticate(request)
    if (!me) return unauthorized()
    await delay(150)
    const visible = conversationStore
      .filter((conversation) => isMember(conversation, me))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    return json(visible)
  }),

  http.post(`${base}/conversations`, async ({ request }) => {
    const me = authenticate(request)
    if (!me) return unauthorized()
    await delay(200)
    const body = (await request.json()) as { type?: string; name?: string; memberIds?: number[] }
    const memberIds = [...new Set(body.memberIds ?? [])].filter((id) => id !== me.id)
    const members = memberIds.map((id) => directory.find((user) => user.id === id))
    if (members.some((member) => !member)) return invalid('Unknown member')
    const users = members as User[]

    if (body.type === 'PRIVATE') {
      if (users.length !== 1) return invalid('A private chat needs exactly one other member')
      const existing = conversationStore.find(
        (conversation) =>
          conversation.type === 'PRIVATE' &&
          isMember(conversation, me) &&
          isMember(conversation, users[0]),
      )
      if (existing) return json(existing)
    } else if (body.type === 'GROUP') {
      const name = body.name?.trim() ?? ''
      if (name.length < 1 || name.length > 50) return invalid('Group name must be 1-50 characters')
      if (users.length < 2) return invalid('A group needs at least two other members')
    } else {
      return invalid('Unknown conversation type')
    }

    const conversation: ConversationSummary = {
      id: newConversationId(),
      type: body.type,
      name: body.type === 'GROUP' ? (body.name as string).trim() : null,
      participants: [me, ...users],
      lastMessage: null,
      unreadCount: 0,
      updatedAt: new Date().toISOString(),
    }
    conversationStore.push(conversation)
    messageStore.set(conversation.id, [])
    return json(conversation, 201)
  }),

  http.get(`${base}/conversations/:id`, ({ request, params }) => {
    const me = authenticate(request)
    if (!me) return unauthorized()
    const conversation = findConversation(params.id)
    if (!conversation) return notFound()
    return isMember(conversation, me) ? json(conversation) : forbidden()
  }),

  http.get(`${base}/conversations/:id/messages`, async ({ request, params }) => {
    const me = authenticate(request)
    if (!me) return unauthorized()
    const conversation = findConversation(params.id)
    if (!conversation) return notFound()
    if (!isMember(conversation, me)) return forbidden()
    await delay(150)

    const url = new URL(request.url)
    const cursor = url.searchParams.get('cursor')
    const limit = Number(url.searchParams.get('limit') ?? 30)
    const all = messageStore.get(conversation.id) ?? []
    const older = cursor ? all.filter((item) => item.id < Number(cursor)) : all
    const page = older.slice(-limit)

    if (!cursor) conversation.unreadCount = 0

    return json({
      items: [...page].reverse(),
      nextCursor: older.length > limit ? String(page[0].id) : null,
    })
  }),

  http.post(`${base}/conversations/:id/messages`, async ({ request, params }) => {
    const me = authenticate(request)
    if (!me) return unauthorized()
    const conversation = findConversation(params.id)
    if (!conversation) return notFound()
    if (!isMember(conversation, me)) return forbidden()
    await delay(400)

    const body = (await request.json()) as { content?: string; clientMessageId?: string }
    const content = body.content?.trim() ?? ''
    if (content.length < 1 || content.length > 5000) return invalid('Message must be 1-5000 characters')

    // Dev hook: a message containing "[fail]" fails once per clientMessageId so retry can be tried.
    if (content.includes('[fail]') && body.clientMessageId && !failedOnce.has(body.clientMessageId)) {
      failedOnce.add(body.clientMessageId)
      return json({ message: 'Simulated failure' }, 500)
    }

    const history = messageStore.get(conversation.id) ?? []
    const duplicate = body.clientMessageId
      ? history.find((item) => item.clientMessageId === body.clientMessageId)
      : undefined
    if (duplicate) return json(duplicate)

    const message: Message = {
      id: newMessageId(),
      conversationId: conversation.id,
      senderId: me.id,
      content,
      createdAt: new Date().toISOString(),
      clientMessageId: body.clientMessageId,
      status: 'SENT',
    }
    history.push(message)
    messageStore.set(conversation.id, history)
    touch(conversation, message)
    scheduleReply(conversation, me)
    return json(message, 201)
  }),
]
