# UI/UX PRD — Neobrutalism Messaging

## Named visual vibe
**Neobrutalism**: thick black borders, hard offset shadows, flat saturated color blocks (yellow, lime, blue, cyan), chunky display type, playful doodles (stars, squiggles, arrows). Reference: the Mentorix landing screenshot from the product owner. Avoid blur, gradients and soft shadows; keep text always legible.

## Product feeling
Bold, playful, modern, high-contrast. Conversation content takes precedence over ornament; decoration lives on the landing/auth pages and empty states, not inside message lists.

## Target screens and layout
### A. Desktop (>= 1024px)
- Full-bleed app shell (WhatsApp Web style): no outer frame or max-width. Sidebar and thread are edge-to-edge, separated by a 2px black border. Cyan is an accent only (thread header, decorative blob), never a page frame.
- Left sidebar width 340–384px: profile header, search, conversation list, bottom user/settings.
- Right panel flexible width: chat header, scrollable message list, sticky message composer.
- Optional details drawer width 320px on wide screens (P1), not open by default.
- Avoid multiple independent visible scrollbars outside list and message panels.
### B. Tablet (768–1023px)
- Sidebar 300px; active thread fills remaining space; optional details drawer overlays.
### C. Mobile (<768px)
- Full-screen list by default; selecting chat navigates to full-screen thread.
- Header 64px, composer anchored to viewport with safe-area handling.
- Bottom navigation only on list/home where needed; do not show it over chat composer.
- Large 44px minimum touch targets; avoid desktop hover-only affordances.

## Screen inventory (P0)
| Screen | Route | Contents |
|---|---|---|
| Landing | `/` | Sticky morphing nav (pill → full width on scroll), hero with 3-color headline + CTAs, feature block (cyan), how it works, final CTA, footer; guest only |
| Sign in | `/login` | Logo, welcome copy, email/password, errors, register link |
| Sign up | `/register` | Profile basics and password validation |
| Inbox | `/chats` | User header, mini story/avatar strip (decorative or P1; hide if not functional), search, chat list, unread count, new chat FAB |
| Chat detail | `/chats/:id` | Header/avatar, message bubbles, date separators, loading older, composer, typing placeholder |
| New message | `/new-message` or modal | Directory search, user rows, empty/result state |
| Settings | `/settings`, `/settings/profile`, `/settings/account`, `/settings/about` | Full-bleed two-pane shell like WhatsApp Web: left menu (search, avatar, sections with icon + subtitle), right pane with the selected section; mobile list → detail with back; coming-soon sections show a placeholder |
| Empty | within shell | Illustration optional, welcoming CTA to start chat |
| Error | route/inline | Retry, return to inbox; avoid raw stack traces |

## Visual screen details
### Conversation list
- White surface with 2px black border and hard shadow; 6px control radius.
- Header: “Chats” large bold; yellow “New” button.
- Item: round avatar 44–52px, name bold, preview muted, time right, unread yellow badge with black border.
- Selected row lime with black border; hover press effect (translate + shadow removal).
### Chat detail
- Header: back (mobile), avatar(s), title, status, overflow menu.
- Bubbles max width 75% desktop / 84% mobile; incoming white; outgoing yellow; always black text, 2px black border and hard shadow.
- 6–12px radius bubbles; flat corner on the sender side.
- Timestamp and sent/delivered/read indicators secondary, no UI clutter.
- Composer: white bordered bar, attachment left, textarea auto-grow max 5 lines, yellow send button right.
### Group creation (P1)
- Bottom sheet/modal member selector with avatar grid, selected chips and yellow “Create group” CTA.
- Cannot create without required member selection and nonempty group name.

## Motion
- 140–220ms transitions, mostly opacity/translateY 4px; reduced-motion variant mandatory.
- New message slides/fades minimally; never animate entire history list.

## Content and microcopy
- Friendly but concise; keep system messages explicit (“Message not sent. Retry”).
- Use consistent language per release (default: English unless project config changes).
- Real data only; mock fixtures are clearly marked in development.

## Component states
For every interactive component define: default, hover (pointer), active/pressed, focus-visible, disabled, loading, error, empty as relevant.

## Accessibility
WCAG AA contrast for text and controls; keyboard and screen reader navigation; accessible avatar alt/initials; meaningful aria labels for icon buttons; distinguish read state by more than color; support text scaling.

## Reference fidelity rules
- Borrow palette, visual rhythm and soft rounded shapes.
- Do not reproduce Figma branding, copyrighted avatar photos, arbitrary lorem ipsum or floating phone mockups in the working application.
- The reference is a collage of mobile concepts; create a functional responsive chat workspace from it.
