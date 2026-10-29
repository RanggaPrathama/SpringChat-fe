# Module: Auth (P0)

**Routes:** `/login`, `/register`; protected routes handled by router guards.

## Structure
```text
modules/auth/
├── components/{LoginForm,RegisterForm}.vue
├── composables/useAuth.ts
├── services/auth.service.ts
├── types/auth.types.ts
├── store/auth.store.ts
└── views/{LoginView,RegisterView}.vue
```

## Types
`LoginRequest {email,password}`, `RegisterRequest {username,email,password}`, `AuthResponse {accessToken,user,expiresAt?}` pending backend agreement.

## Service
`login()`, `register()`, `logout()` (if supported), `getMe()` delegated to users module when appropriate.

## Composables & store
`useAuth` wraps mutations with loading/error handling. `useAuthStore` holds auth status and current user, not message lists. Refresh strategy requires backend contract.

## UI
Cyan canvas, white bordered card with hard shadow, yellow primary CTA, doodle accents. Inputs labelled and keyboard accessible.

## Acceptance
Validation, pending/error states, authenticated redirect, logout clears sessions/cache and closes WebSocket.
