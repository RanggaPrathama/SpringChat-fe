# Module: Messages (P0)

**Route:** `/chats/:conversationId`.

## Structure
```text
modules/messages/
├── components/{ChatHeader,MessageBubble,MessageList,MessageComposer,DateSeparator,DeliveryStatus}.vue
├── composables/{useMessages,useSendMessage,useChatRealtime,useScrollAnchor}.ts
├── services/messages.service.ts
├── types/message.types.ts
└── views/ChatView.vue
```

## Types
`Message`, `MessagePage`, `SendMessageRequest`, `MessageStatus`, `MessageCreatedEvent`; see API contract.

## Service
`getPage(conversationId,cursor?)`, `send(conversationId,{content,clientMessageId})`.

## Composables
- `useMessages`: infinite history query and message normalization.
- `useSendMessage`: optimistic update, deduplication and retry state.
- `useChatRealtime`: subscription and query invalidation/reconciliation.
- `useScrollAnchor`: maintain scroll position on older-page insertion.

## UI
Incoming white bubbles; outgoing yellow bubbles (black text); date separators, canonical timestamps, subtle sent/delivered/read icon. Composer fixed within thread panel (not globally overlayed); autosize textarea max 5 rows, Enter send, Shift+Enter newline (desktop), send button accessible.

## Implementation notes
- Pending/failed messages live in `store/outbox.store.ts` (not the Vue Query cache) and are merged with server history by `utils/mergeMessages.ts` (dedupe by id, then `clientMessageId`).
- `useChatRealtime` polls + merges the newest page (`utils/mergeLatest.ts`); STOMP replaces only the transport.
- Emoji: composer has an emoji popover (`EmojiPicker`, curated offline dataset in `data/emojis.ts`, search + categories + recents kept in localStorage, guarded). Inserts at the caret; no network, no extra dependency.
- Mobile: shell height follows the visual viewport (`lib/viewport.ts`, `.h-app`), composer is not auto-focused on touch so the keyboard never covers the thread.
- Composer: Enter sends on desktop, newline on touch devices; max 5000 chars; autosize up to 5 rows.

## Acceptance
A and B exchange messages in two browser sessions; message appears once; retry on failure; no forced scroll if reading older messages; membership errors show safe error view; long text wraps and links don't overflow.
