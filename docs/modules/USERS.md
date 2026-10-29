# Module: Users (P0)

**Routes:** `/settings` shell (`SettingsLayout`) with children `profile`, `account`, `about` and coming-soon `notifications` / `privacy` / `chat`; user search lives in the new-conversation flow.

## Structure
```text
modules/users/
├── components/{UserSearch,UserListItem,ProfileForm}.vue
├── composables/{useMe,useUserSearch}.ts
├── services/users.service.ts
├── types/user.types.ts
└── views/ProfileView.vue
```

## Types
`User { id, username, displayName, avatarUrl }`; `UpdateProfileRequest` matches backend.

## Service
`getMe`, `findUsers(search)`, `updateMe` if supported.

## Composables
`useMe()` caches profile; `useUserSearch()` debounces input, cancels stale requests and reports empty/error states.

## Acceptance
Default initials avatar, no broken-image icons, handles no result, only public profile fields exposed in search.
