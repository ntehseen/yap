# 04 — Application Shell

**Date:** 2026-08-03  
**Phase:** 1

## Goal

Replace the Instagram top header chrome with a Threads-inspired shell: desktop left nav, mobile bottom nav, optional right sidebar, while preserving search, create-post, notifications, and account actions.

## Existing behavior

Authenticated pages rendered a sticky `Header` with logo, search, home/inbox/create/heart/avatar. Layout was a centered Instagram column.

## Architectural decision

- New `AppShell` owns chrome state (search, create, hearts, more/avatar menu)
- Reuse existing feature windows: `HeaderSearchWindow`, `HeartNotificationsWindow`, `AddNewPost`
- `lucide-react` icons for navigation
- Login / SignUp stay full-bleed (no shell)
- Right sidebar is a lightweight stub (suggestions + placeholder copy)

## Files changed

- `components/brand/YappersLogo.tsx`
- `components/layout/navItems.ts`
- `components/layout/SideNav.tsx`
- `components/layout/MobileBottomNav.tsx`
- `components/layout/RightSidebar.tsx`
- `components/layout/AppShell.tsx`
- Pages wired: `pages/index.tsx`, `Explore.tsx`, `Inbox.tsx`, `[Profile].tsx`
- `components/loadingComps/LoadingPage.tsx`, `components/profilePages/UserDoesNotExist.tsx`
- Branding updates on Login/SignUp and dark-mode storage key (`darkModeYap` with legacy fallback)

## Important code explanation

```tsx
<AppShell page="Home" showRightSidebar title="Home">
  {/* existing feed content */}
</AppShell>
```

Nav items map routes (`/`, `/Explore`, `/Inbox`, `/{username}`) and actions (`search`, `create`, `notifications`, `more`).

## Firebase / data impact

None. Same listeners and handlers.

## How to test

1. With Firebase configured, sign in
2. Desktop (≥1280px): left nav, home feed, right suggestions on Home
3. Mobile: top bar + bottom nav; Create opens existing post modal
4. Search / notifications / More → Profile / Explore / Log out / dark mode

## Known limitations

- Legacy `components/header/Header.tsx` remains but authenticated routes no longer mount it
- Heart notification panel still uses older absolute positioning styles
- Feed posts themselves are still Instagram-card UI (Phase 2)

## Next step

Phase 2 — text-first composer and Yappers post component.
