# Quality Gates — Definition of Done

## Build and static checks
- `vue-tsc --noEmit` success, lint/format success, `vite build` success.
- No unchecked `any`, ignored `@ts-expect-error`, dead imports, or console debug output.
- Secrets only through appropriate config; no token printed in logs.

## Visual and accessibility checks
- Verify at 375px, 768px, 1024px, 1440px; no overflow and coherent spacing.
- Keyboard focus and navigation functional for dialogs, message composer, route changes.
- Button labels/aria-label, visible focus, alt/initials avatars, `prefers-reduced-motion` support.
- Text contrast verified on white/yellow/lime/cyan backgrounds; visual tokens centralized.

## Functional tests
- Auth: required fields, wrong credentials, redirected protected route.
- Conversation: filter/search, empty, loading, create existing/new thread.
- Message: send, pending, failed/retry, incoming dedupe, 403, scroll anchor, pagination.
- Realtime: disconnect/reconnect, no duplicate events, resubscribe, logout closes socket.

## Suggested commands
```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm lint
pnpm test
pnpm build
pnpm exec playwright test
```
These assume corresponding scripts/dependencies are added in `package.json`. If project uses npm instead, use equivalent commands.

## Release bar
P0 only ships when two-account chat scenario works, primary screens have no major layout bugs, and security boundary errors are surfaced rather than hidden.
