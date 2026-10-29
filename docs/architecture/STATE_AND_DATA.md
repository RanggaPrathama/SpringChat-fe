# State, Data Flow and Realtime

## Ownership rules
**Pinia:** authentication session/user, global UI preference, active layout controls. **Vue Query:** server data (conversations, history, people, profile), cache, background refetch, mutation states. **Local ref/reactive:** composer text, dialog open flags, current hover. Avoid duplicating server arrays in Pinia.

## Suggested cache keys
```ts
export const queryKeys = {
  me: ['me'] as const,
  users: (search: string) => ['users', search] as const,
  conversations: ['conversations'] as const,
  conversation: (id: number) => ['conversation', id] as const,
  messages: (id: number) => ['messages', id] as const,
}
```

## Sending
1. Validate and trim content.
2. Add optimistic message with `clientMessageId` + status `PENDING`.
3. Persist via REST (recommended default) and reconcile canonical response.
4. Use WS only to receive resulting events; avoid double-sending by REST and STOMP.
5. Incoming event deduplicated by `id`, then `clientMessageId` when available.
6. Mark failed on HTTP failure, expose retry. Do not silently drop messages.

## Realtime lifecycle
- Connect after authentication; disconnect on logout.
- Resubscribe after reconnect. On receiving event update query cache for relevant conversation, detail and history.
- When backgrounded or after reconnection, refetch; presence/typing are best-effort, not durable.
- Visibility, timeouts, heartbeat support configurable; do not promise real-time under disconnection.

## Auth
- Router guard only reads auth readiness and redirects guests; service remains security-independent.
- Never infer access rights from hidden UI; server validates membership.
- Avoid localStorage for sensitive long-lived tokens unless specifically approved. Document chosen refresh and logout semantics.

## Performance
- History load pagewise (prefer cursor) and maintain scroll position when prepending.
- Virtualize messages only when volume warrants, but keep semantic accessibility.
- Avoid refetch on every keystroke; debounce directory search 250–350ms.
- Use `AbortController`/Axios cancellation where possible for stale searches.
