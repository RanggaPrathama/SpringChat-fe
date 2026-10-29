# Product Requirements Document (PRD)

## 1. Summary
SpringChat is a modern, real-time, web-first chat application inspired by core WhatsApp workflows, **not a WhatsApp replica**. Primary goal: clean, usable frontend that integrates with a Java Spring Boot backend through REST and WebSocket.

## 2. Problem and users
Users want to find contacts, start direct chats, exchange realtime messages, follow their conversations, and manage groups without learning a complex interface.
- **User:** registered member communicating with other registered members.
- **Group admin:** member allowed to manage membership and group details (phase 2).
- **Guest:** unauthenticated visitor who can access only auth pages.

## 3. Product goals
- Compose and receive text messages with clear sent/delivered/read state.
- Make conversations easy to discover, search, and revisit.
- Responsive, touch-friendly interface consistent with design reference.
- Sensible loading, offline, and error behaviors.
- Maintainability: feature-based Vue modules, typed contracts, shared component library.

## 4. Non-goals (MVP)
- Calls/audio/video; E2EE claims; contact-book upload; stories; payments; bots; multi-tenant admin; complex notification system.
- Any promise of guaranteed delivery based solely on WebSocket events.

## 5. MVP features (P0)
| ID | Capability | Expected behavior |
|---|---|---|
| AUTH-01 | Register/login/logout | Forms validate; auth state persists via approved token strategy; protected routes redirect. |
| USER-01 | Me/profile | View and edit display name/avatar when backend supports it; fallback initials avatar. |
| USER-02 | User search | Search registered people; debounced input and empty state. |
| CHAT-01 | Conversation list | Ordered by latest message; preview, unread count, timestamp, search. |
| CHAT-02 | Start direct chat | Select person; open existing direct thread if one exists. |
| MSG-01 | Text messages | Send nonblank messages, bubble alignment by sender, timestamp and delivery state. |
| MSG-02 | Message history | Page/cursor load older messages; preserve scroll anchoring. |
| RT-01 | Realtime incoming | Reconnect with backoff and refetch missed messages. |
| SYS-01 | UX states | Skeleton, empty, error, retry, offline banner, accessible focus. |

## 6. Next features (P1)
- Group creation, participants and membership management, group details.
- Online presence/last seen; typing indicators (transient, no DB requirement).
- Read receipts and unread marker; edit/delete own message if backend permits.
- Image/file upload with progress, restrictions and error states.

## 7. Later features (P2)
- Voice/video calls, browser push, emoji reaction, pin/archive/mute, full message search, advanced media gallery.

## 8. Acceptance criteria
1. New user can sign in, see their empty conversation state, find another user and create a direct chat.
2. With two accounts in separate browsers, a sent message displays in both conversations without refresh when connection is healthy.
3. On connection loss, sender sees a coherent failed/pending indicator; reconnect triggers resync and does not duplicate a message.
4. Users cannot access conversations they are not members of; 403/404 routes to an understandable error state.
5. 375px viewport has no horizontal overflow; at desktop >=1024px, sidebar and active chat are visible together.
6. Forms and interactive items can be reached and used with keyboard; no icon-only controls without labels.
7. Service calls are typed, centralized and mocked for standalone UI demos.

## 9. Success metrics (targets, not current results)
- Core task completion >=95% across manual happy-path QA scenarios.
- No critical accessibility issues in primary flows.
- No console/runtime errors in core user journeys.
- Smooth message scroll on mid-range mobile devices; avoid unbounded rendered lists.

## 10. Decisions and open questions
- Confirm whether backend returns cursor or page pagination; prefer cursor for history.
- Confirm auth token storage policy and refresh endpoint; **do not invent endpoints**.
- Confirm group-specific permissions and file storage contract before implementing P1.
