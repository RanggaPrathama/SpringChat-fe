# User Flows and Permissions

## Landing
1. Visit `/`: marketing page (hero, features, how it works, CTA).
2. "Get started" → `/register`; "Log in" → `/login`. Authenticated users visiting `/`, `/login` or `/register` are redirected to `/chats`.
3. After register or login success → `/chats`. Logout → `/`.

## Settings
1. Open from the inbox footer (your name) → `/settings/profile`.
2. Desktop: left menu (search, avatar, sections) + right pane for the selected section; mobile: menu first, then one section with a back arrow.
3. Sections: Profile (edit name/avatar URL), Account (info, log out), About & help (shortcuts, developer). Notifications, Privacy and Chat settings are listed as "soon" and open a placeholder.

## Login
1. Visit `/login`; email + password validated client-side.
2. Call `POST /api/v1/auth/login`; loading and server-error states.
3. On success, update auth store, fetch `/users/me`, redirect to `/chats`.
4. On 401, show neutral form error; don't reveal which credential failed.

## New direct chat
1. Open New Message via header/sidebar FAB.
2. Debounced user search; results show avatar, display name, handle.
3. Selecting user calls create/open conversation; navigate `/chats/:conversationId`.
4. Disable duplicate submission; tolerate backend returning pre-existing thread.

## Send message
1. Compose plain text, trim whitespace and validate max length 5000.
2. Create local pending message with stable `clientMessageId` (UUID).
3. Call REST send endpoint; replace pending with canonical server record.
4. Realtime echo with same `clientMessageId` must reconcile, not duplicate.
5. On failure, mark failed and offer retry; preserve draft when appropriate.

## Receive message
1. On chat open, fetch latest history and subscribe to authorized events.
2. New message for current chat appends (unless already present); other chat updates preview and unread badge.
3. Auto-scroll only if viewer is near bottom; otherwise display “New messages” indicator.
4. On reconnect, refetch since last known message/time rather than assuming events were retained.

## Mobile navigation
- `/chats` shows only conversation list.
- `/chats/:id` shows thread with back-to-list action.
- New-message and group-create have full-screen/sheet behavior.

## Permissions
- Guest: only auth routes.
- Authenticated: own profile, directory, membership-scoped conversations.
- Conversation member: view thread and send messages.
- Group admin: manage group membership **only after backend permissions exist**.
- UI gating improves experience; backend authorization is mandatory.

## Error cases
- Expired auth -> clear authenticated context and redirect to login without redirect loops.
- Not member -> 403/404 safe screen with return-to-list.
- Offline -> show banner and local pending draft; prevent silent data loss.
- Validation -> per-field errors and accessible summary where useful.
