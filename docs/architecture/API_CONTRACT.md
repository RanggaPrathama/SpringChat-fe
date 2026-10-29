# Proposed API Contract — Coordinate with Spring Boot Backend

> **PROVISIONAL SPEC:** This is a frontend expectation, **not proof existing endpoints are implemented**. Confirm field names, response wrapper, routes and auth format with the Java backend before wiring production calls.

## Environment
- `VITE_API_BASE_URL=http://localhost:8080/api/v1`
- `VITE_WS_URL=ws://localhost:8080/ws`
- Access token bearer in Authorization header for REST if auth strategy is JWT.
- Avoid putting long-lived credentials in localStorage as a default. Agree on secure auth architecture (e.g. access token in memory + refresh strategy) with backend.

## Proposed REST routes
| Method | Route | Request | Response |
|---|---|---|---|
| POST | `/auth/register` | `RegisterRequest` | `AuthResponse` or success |
| POST | `/auth/login` | `LoginRequest` | `AuthResponse` |
| POST | `/auth/logout` | TBD | 204 or backend-defined |
| GET | `/users/me` | — | `User` |
| PATCH | `/users/me` | `UpdateProfileRequest` | `User` |
| GET | `/users?search=...` | — | `User[]` / page |
| GET | `/conversations` | — | `ConversationSummary[]` / page |
| POST | `/conversations` | `{ type:'PRIVATE', memberIds:[id] }` or `{ type:'GROUP', name, memberIds:[id,id,…] }` (group: name 1–50, >=2 other members) | `Conversation` (existing one for PRIVATE if present) |
| GET | `/conversations/:id` | — | `Conversation` |
| GET | `/conversations/:id/messages?cursor=...&limit=30` | — | `MessagePage` (items **newest-first**; `cursor` = oldest id of previous page; no cursor = latest page, server may mark as read) |
| POST | `/conversations/:id/messages` | `{ content: string, clientMessageId?: string }` | `Message` |

## Example domain types
```ts
export type ID = number
export interface User {
  id: ID; username: string; displayName: string; avatarUrl: string | null;
}
export type ConversationType = 'PRIVATE' | 'GROUP'
export interface ConversationSummary {
  id: ID; type: ConversationType; name: string | null;
  participants: User[]; lastMessage: Message | null;
  unreadCount: number; updatedAt: string;
}
export type MessageStatus = 'PENDING' | 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'
export interface Message {
  id: ID; conversationId: ID; senderId: ID; content: string;
  createdAt: string; clientMessageId?: string; status?: MessageStatus;
}
export interface MessagePage { items: Message[]; nextCursor: string | null }
export interface SendMessageRequest { content: string; clientMessageId?: string }
```

**Frontend assumptions added with the full P0 UI (provisional):** `POST /conversations/:id/messages` is idempotent on `clientMessageId`; `GET/PATCH /users/me` accept `displayName` (1–40) and `avatarUrl` (http/https or null); 403 for non-members.

## Realtime today
Until STOMP is wired (Milestone 4) the thread polls the newest page every 4s (`useChatRealtime`), merges by id and resyncs on tab focus / back online. The mock API (MSW) replies to your messages after ~2.5s and fails once for messages containing `[fail]` (dev only).

## STOMP proposal
- WebSocket endpoint: `/ws`.
- Client sends `SEND /app/chat.send` with `{conversationId, content, clientMessageId}` if backend supports WS send; otherwise REST send + WS receive (prefer **one authoritative send path**).
- Suggested user-private delivery: `SUBSCRIBE /user/queue/messages`; server resolves authorized recipient identities.
- Suggested event payload: `{eventId, type:'MESSAGE_CREATED', conversationId, message}`.
- Never broadcast private messages over unguarded public topic destinations.
- Authenticate STOMP CONNECT and authorize subscriptions server-side; Spring Security HTTP rules alone are insufficient.
- Reconnect with bounded exponential backoff and refetch missed data after reconnect.

## Error mapping
| HTTP/status | UI |
|---|---|
| 400/422 | field validation, concise reason |
| 401 | refresh/re-auth flow |
| 403 | not authorized / not a member |
| 404 | conversation not found |
| 409 | duplicate/conflict handled idempotently |
| 429 | rate limit, retry later |
| 500/503 | retryable service problem |
| network offline | persistent offline indicator, pending drafts |

## Backend alignment checklist
- Decide snake_case vs camelCase JSON.
- Specify pagination (`cursor` preferred), sort order, timestamp ISO 8601 UTC.
- Define idempotency/reconciliation behavior via `clientMessageId`.
- Clarify file uploads and retention for P1.
- Ensure membership and rate limits on REST and WebSocket.
- Agree on whether `ApiResponse<T>` wraps resources; adapt Axios normalizer once, not each component.
