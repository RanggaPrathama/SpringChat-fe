# Phase 2 Modules: Groups, Presence and Attachments

These are **P1** and must not block P0 delivery. Each keeps `services/`, `types/`, `views/` (if it owns routes), `composables/`, and `components/`.

## Groups
```text
modules/groups/
├── components/{GroupMemberPicker,CreateGroupDialog,GroupDetails}.vue
├── composables/{useGroups,useGroupMembers}.ts
├── services/groups.service.ts
├── types/group.types.ts
└── views/GroupDetailsView.vue
```
Status: **create flow implemented** (`CreateGroupForm`, `GroupMemberPicker`; creation call lives in `conversations`; details shown via `ConversationDetails`). Member management (add/remove, admin) still waits for backend permissions.
Flow: select >=2 other users -> name group -> create -> navigate to thread. Admin-only member management after backend permission checks. Confirm group API before integration.

## Presence
```text
modules/presence/
├── components/{PresenceDot,TypingIndicator}.vue
├── composables/{usePresence,useTyping}.ts
├── services/presence.service.ts
├── types/presence.types.ts
└── views/README.md  # no dedicated screen initially
```
Transient websocket-driven `ONLINE`, `OFFLINE`, `TYPING` states with TTL. Never claim exact online accuracy under disconnect.

## Attachments
```text
modules/attachments/
├── components/{AttachmentPicker,UploadProgress,AttachmentPreview}.vue
├── composables/useUploadAttachment.ts
├── services/attachments.service.ts
├── types/attachment.types.ts
└── views/README.md  # integrated into chat composer
```
Validate type, size, backend allowlist and malware/security posture; progress, cancel, retry and secure attachment URLs. Don't invent storage API.
