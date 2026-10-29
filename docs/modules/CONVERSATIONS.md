# Module: Conversations (P0)

**Routes:** `/chats`, `/new-message` (or dialog), conversation detail composition delegated to Messages.

## Structure
```text
modules/conversations/
├── components/{ConversationList,ConversationItem,NewMessageDialog,UnreadBadge}.vue
├── composables/{useConversations,useCreateConversation,useConversationSearch}.ts
├── services/conversations.service.ts
├── types/conversation.types.ts
└── views/{InboxView,NewMessageView}.vue
```

## Service
`listConversations`, `getConversation(id)`, `createPrivateConversation(memberId)`.

## Composables
`useConversations()` handles list query and filters; `useCreateConversation()` handles pending and existing conversation conflict.

## UI
List rows with circular avatar, bold title, muted message preview, right-aligned timestamp, compact unread badge. Selected row lightly lilac; empty CTA “Start a conversation”.

## Acceptance
List ordered by last activity; supports loading skeleton and empty states; selecting item opens the correct thread; no duplicate direct conversation when backend responds with existing one.
