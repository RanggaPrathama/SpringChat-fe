# Implementation Plan for Coding Agent

## Operating instructions
- Inspect actual repository before writing code. Preserve working toolchain and conventions; don't overwrite existing config blindly.
- Read README, PRD, UI/UX PRD, design system and architecture first.
- Implement each milestone in small coherent commits; avoid broad unrelated refactors.
- If backend is missing, develop against MSW with realistic typed fixtures; keep service layer unchanged when switching to real HTTP.
- Do not invent endpoints as if live; place assumptions in API contract and obtain confirmation.
- Validate screenshots at mobile and desktop after major layout changes.

## Milestone 0 — Bootstrap
- Vite Vue TS strict, path alias `@`, Vue Router, Pinia, Vue Query, Tailwind and shadcn-vue.
- Add typed Axios client, env validation, error mapper, lint/format/test setup.
- Import tokens and font; add `AppLogo` and reusable `UserAvatar`.
- Outcome: app boots, zero TS errors, responsive base layout.

## Milestone 1 — Design shell
- Implement `ChatLayout`, desktop two-pane and mobile route-based list/thread.
- Components: header, search, `ConversationListItem`, skeleton and empty state.
- MSW conversation and user fixtures; no real network required.
- Outcome: reference-inspired polished inbox at 375 and 1440px.

## Milestone 2 — Auth & directory
- Login/register forms and validation; route guards; user search and new-message flow.
- Provide local mock accounts in development only; no credentials shipped to production.
- Outcome: can sign in and start a direct conversation in mock mode.

## Milestone 3 — Chat messages
- Message history, bubble variants, composer, pagination and stable scroll.
- Optimistic send state, retry, deduplication. Integrate against mock REST contract.
- Outcome: mock end-to-end happy path with successful/error states.

## Milestone 4 — Spring Boot integration
- Replace MSW with real Spring endpoints via env switch.
- Align actual names and response envelopes; implement JWT handling with agreed security contract.
- Integrate real STOMP events and authorized subscriptions; reconnect/resync.
- Outcome: two browsers exchange realtime messages and recovery works.

## Milestone 5 — Quality and P1
- Unit test composables, service error mapping, component states, E2E tests.
- Accessibility audit, performance, responsive QA, then group/presence/attachment modules if backend ready.

## Prompts for sub-agents
**Design agent:** “Read `docs/design/*` and `docs/product/PRD.md`. Build a responsive inbox and chat design using only shared tokens and shadcn-vue primitives. Show mobile/desktop QA screenshots and note deviations.”

**Frontend architecture agent:** “Read `docs/architecture/*` and each `docs/modules/*`. Generate `src/modules` with service/type/composable/view separation. Never perform direct HTTP calls from view files.”

**Integration agent:** “Read `docs/architecture/API_CONTRACT.md`; first compare it with real Spring Boot routes. Document mismatches before changing contracts; preserve typed services and retry/deduplication behavior.”

## Task completion output
For each milestone provide: files changed, user-facing behavior, test commands+results, screenshots/checks at key breakpoints, and open backend contract questions.
