# Frontend Architecture — Feature-first Modular Vue

## Stack
Vue 3 + TypeScript + Vite + Vue Router + Pinia + `@tanstack/vue-query` + Axios + Tailwind CSS + shadcn-vue + `lucide-vue-next` + `@stomp/stompjs` + Zod + MSW + Vitest + Vue Test Utils + Playwright.

## Required source tree
```text
src/
├── app/
│   ├── App.vue
│   ├── router/index.ts
│   ├── layouts/AuthLayout.vue
│   ├── layouts/ChatLayout.vue
│   └── providers/queryClient.ts
├── assets/styles/
│   ├── main.css
│   └── tokens.css
├── components/
│   ├── ui/                  # shadcn-vue generated primitives
│   └── shared/              # AppLogo, NetworkBanner, EmptyState, UserAvatar
├── lib/
│   ├── http/client.ts      # Axios instance/interceptors
│   ├── realtime/stomp.ts   # STOMP transport lifecycle
│   ├── errors.ts
│   ├── env.ts
│   └── utils.ts
├── modules/
│   ├── auth/
│   │   ├── components/
│   │   ├── composables/useAuth.ts
│   │   ├── services/auth.service.ts
│   │   ├── store/auth.store.ts
│   │   ├── types/auth.types.ts
│   │   └── views/{LoginView,RegisterView}.vue
│   ├── users/
│   │   ├── components/
│   │   ├── composables/{useMe,useUserSearch}.ts
│   │   ├── services/users.service.ts
│   │   ├── types/user.types.ts
│   │   └── views/ProfileView.vue
│   ├── conversations/
│   │   ├── components/{ConversationList,ConversationItem,NewMessageDialog}.vue
│   │   ├── composables/{useConversations,useCreateConversation}.ts
│   │   ├── services/conversations.service.ts
│   │   ├── types/conversation.types.ts
│   │   └── views/{InboxView,NewMessageView}.vue
│   ├── messages/
│   │   ├── components/{MessageBubble,MessageList,MessageComposer,ChatHeader}.vue
│   │   ├── composables/{useMessages,useSendMessage,useChatRealtime,useScrollAnchor}.ts
│   │   ├── services/messages.service.ts
│   │   ├── types/message.types.ts
│   │   └── views/ChatView.vue
│   ├── groups/            # P1; same subdirectories
│   ├── presence/          # P1; same subdirectories
│   └── attachments/       # P1; same subdirectories
├── stores/ui.store.ts     # only global UI state (sidebar, active modal)
├── mocks/{handlers.ts,browser.ts,data.ts}
└── main.ts
```

## Boundaries
- `views/`: route-level composition, little domain logic.
- `components/`: presentational UI and local interaction.
- `composables/`: orchestration, reuse, view-facing queries, state derivations.
- `services/`: typed transport calls; never toast/route/navigation.
- `types/`: request/response/domain models; shared API transport types can live in `src/lib/types`.
- `store/`: Pinia only for cross-route/session state, not every fetched entity.
- One feature may import another feature's exported public types/composables; avoid circular dependencies. Prefer an `index.ts` per module to expose public API if needed.
- `lib/http` and `lib/realtime` must have no feature imports.

## Example typed service
```ts
// modules/messages/services/messages.service.ts
import { http } from '@/lib/http/client'
import type { SendMessageRequest, Message, MessagePage } from '../types/message.types'
export const messagesService = {
  async getPage(conversationId: number, cursor?: string): Promise<MessagePage> {
    const { data } = await http.get<MessagePage>(`/conversations/${conversationId}/messages`, { params: { cursor } })
    return data
  },
  async send(conversationId: number, request: SendMessageRequest): Promise<Message> {
    const { data } = await http.post<Message>(`/conversations/${conversationId}/messages`, request)
    return data
  },
}
```
This is an **illustrative client contract**. Adapt response envelopes/pagination to actual backend and document changes in `API_CONTRACT.md`.

## Coding conventions
- File names: Vue components PascalCase, composables `useX.ts`, services `feature.service.ts`, types `feature.types.ts`.
- No `any` in domain models, prefer unknown + validated parsing for external data.
- `import type` for types; never disable strict TS to bypass issues.
- No direct Axios calls from Vue templates/components.
- Use route-level lazy imports for main screens.
- Treat external API data as untrusted; validate critical responses with Zod as needed.
