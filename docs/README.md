# SpringChat — Frontend Agent Documentation

**Purpose:** Source of truth for building a responsive, WhatsApp-inspired chat product using Vue 3, TypeScript, Vite, shadcn-vue, Tailwind CSS, and Pinia.

**Visual direction:** Neobrutalism (thick black borders, hard shadows, yellow/lime/blue/cyan blocks, chunky type, doodles). The supplied Mentorix screenshot is the primary visual brief, not a layout to copy. Component recipes follow https://www.neobrutalism.dev.

## Read in this order
1. `product/PRD.md` — goals, personas, feature scope, acceptance criteria.
2. `product/USER_FLOWS.md` — full flows and permissions.
3. `design/UI_UX_PRD.md` — design direction, screens, responsive rules, states.
4. `design/DESIGN_SYSTEM.md` — color, spacing, components, tokens, a11y.
5. `architecture/FRONTEND_ARCHITECTURE.md` — folder layout, dependencies, rules.
6. `architecture/API_CONTRACT.md` — endpoint assumptions and realtime events.
7. `architecture/STATE_AND_DATA.md` — Pinia/query ownership, caching, auth, optimistic updates.
8. `modules/*.md` — module-level deliverables, views, services, types, composables.
9. `implementation/AGENT_TASKS.md` — staged execution plan for coding agent.
10. `implementation/QUALITY_GATES.md` — definition of done and testing.

## Implementation decisions
- Vue 3 Composition API, `<script setup lang="ts">`, strict TypeScript.
- Vite, Vue Router, Tailwind CSS, shadcn-vue, Pinia, `@tanstack/vue-query`, `lucide-vue-next`.
- Feature-first `src/modules/*`: **services, types, views, composables** plus module-local `components/` and optional `store/`.
- Shared primitives under `src/components/ui/`; domain UI under the feature module.
- HTTP via typed Axios client; WebSocket via native WebSocket + STOMP client (`@stomp/stompjs`).
- REST API is assumed to be Spring Boot; contract is provisional until synchronized with backend.
- Mock Service Worker (MSW) for design development without backend.
- All layouts mobile-first, usable with keyboard, sufficiently high contrast.

## Agent rules
- Follow this docs tree as product source of truth; don't add features to MVP not stated here.
- Preserve the reference's character: black 2px borders, 4px hard shadows, yellow CTA, lime/blue/cyan accents, display headings. Never white text on yellow/lime/cyan.
- Don't reproduce literal text/avatars from the reference image.
- Build UI with real components and tokens, not one giant page or hardcoded screenshot.
- Keep private chat access gated by the authenticated user's membership; backend remains authority.
- Never hard-code backend URLs, credentials, or JWT secrets in frontend source.
- Prefer small composables and testable service functions; store only cross-view app state in Pinia.

## Artifacts
Use screenshot `assets/reference-chat-ui.png` as visual inspiration. Suggested start: see `implementation/AGENT_TASKS.md`.
