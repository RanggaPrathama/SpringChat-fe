# Design System and Tokens — Neobrutalism

Visual brief: **Neobrutalism** (thick black borders, hard offset shadows, flat saturated color blocks, chunky display type, playful doodles). Reference style: the Mentorix landing screenshot supplied by the product owner. Component recipes are ported from https://www.neobrutalism.dev (React/base-ui there; here hand-written Vue + reka-ui + cva).

## Colors
| Token | Hex | Usage |
|---|---|---|
| `background` | `#FFFDF5` | page background |
| `secondary-background` | `#FFFFFF` | cards, inputs, incoming bubbles |
| `main` | `#FFC72C` | primary CTA, active states, outgoing bubble (black text) |
| `main-foreground` | `#0A0A0A` | text on `main` |
| `foreground` / `border` | `#0A0A0A` | text, 2px borders, hard shadow |
| `lime` | `#C6F432` | secondary CTA, success, highlights |
| `blue` | `#3F5EFB` | accent text, links, info (white text allowed) |
| `cyan` | `#4DFFE0` | large section blocks, canvas |
| `danger` | `#E5384B` | errors (dark text or white text on solid red) |

Rules: never put white text on yellow/lime/cyan; black text on those passes WCAG AA. Colors are applied through semantic tokens, never raw hex in components.

## Shape, shadow, motion
- Border: `2px solid var(--border)` on all interactive/surface elements.
- Hard shadow: `4px 4px 0 0 var(--border)` (`shadow-shadow`). Press feedback: `hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`, disabled under `prefers-reduced-motion`.
- Radius: `radius-base` 6px for controls; section blocks 28px; avatars/pills full.
- Focus: `ring-2 ring-black ring-offset-2`, always visible.

## Typography
- Headings: **Bricolage Grotesque** 800 (fallback `ui-sans-serif, system-ui`), tight leading (1.05–1.15). Body: **Inter** 500. Mobile composer text >= 16px.
- H1 40–64, section 28–40, row title 15–16/700, body 14–16, meta 12–13.

## Components (src/components/ui, reka-ui + cva + `cn`)
`Button` (default yellow, neutral white, lime, blue, noShadow, reverse; sizes xs/sm/default/lg/icon*), `Input`, `Label`, `Card` (+Header/Title/Description/Content/Footer), `Badge`, `Avatar`/`AvatarImage`/`AvatarFallback`, `Skeleton`, `Separator`, `Dialog`. Domain/shared: `Sticker`, `UserAvatar`, `EmptyState`, `AppLogo`, `NetworkStatusBanner`, decor (`StarBurst`, `Squiggle`, `ArrowDoodle`).

## Motion
- Library: `motion-v` (Motion for Vue). `MotionConfig reduced-motion="user"` wraps the app, plus a global CSS reduced-motion rule; every effect must degrade to no motion.
- Where: landing (hero stagger, spring pops, scroll reveal via `Reveal`, floating stars, footer marquee), landing navbar morph, newly arrived chat messages only, dialog/popover open (scale + fade).
- Where not: message history and prepended pages, form inputs, anything that moves while the user is reading or typing.
- Presets live in `src/lib/motion.ts`. Animate transform/opacity; the navbar is the only element that animates width/radius (rAF-throttled).

## Landing navbar and footer
- Navbar is sticky: a floating pill (max 1040px, radius full, 2px border, hard shadow) at the top that widens to a full-width flat bar with a bottom border after ~24px of scroll. Mobile: logo, Get started, menu button (dropdown with Escape to close).
- Footer: yellow marquee band, near-black block with brand, Product and Account links, a tilted Developer card (name + mailto), giant solid wordmark, copyright row.

## Iconography
`lucide-vue-next`; every icon-only control needs `aria-label`. Decorative doodles are `aria-hidden`.

## Responsive
Tailwind defaults (`md` 768, `lg` 1024, `xl` 1280), mobile first. Test 375, 768, 1024, 1440; no horizontal overflow.

## Design QA
- Contrast verified on yellow/lime/cyan/white.
- Touch targets >= 44px on mobile.
- No placeholder-only labels in forms.
- Reduced-motion support.
