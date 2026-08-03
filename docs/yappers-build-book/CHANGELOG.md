# Changelog

## 2026-08-03

### Stack upgrade
- Upgraded to **Next.js 16.2**, **React 19**, **Tailwind CSS 4.3**, and **TypeScript 7** (CLI via `@typescript/native`).
- Tooling that still needs the compiler API (Next build typecheck, ESLint) uses TypeScript **6.0.3** via `typescript` → `@typescript/typescript6` (Microsoft’s recommended side-by-side setup until TS 7.1 API lands).
- Migrated PostCSS to `@tailwindcss/postcss`; CSS uses `@import 'tailwindcss'` + `@config`.
- Replaced `next/future/image` with `next/image`; unwrapped legacy `<Link><a>` patterns; ESLint flat config (`eslint.config.mjs`).

### Organization
- Flattened starter from `instagram-clone/` into the Yap repo root.
- Renamed npm package to `yap`; added `typecheck` script.

### Phase 0
- Starter audit and `FILE-INDEX.md` created.

### Phase 1
- Environment scaffolding via `.env.example` and env-backed Firebase config.
- Yappers design tokens, branding rename, UI kit primitives, and application shell.
- Cloudinary replaces Firebase Storage for image uploads (see `02b-cloudinary-media.md`).
- Google sign-in added on Login/SignUp with Firestore profile bootstrap (`02c-firebase-google-auth.md`).
- Phase 2 feed: Threads-style composer, conversation posts, For You / Following tabs (`05-feed-and-composer.md`).
- Phase 3 conversations: `/post/[username]/[postId]` thread route, reply composer, notification deep links (`06-post-conversations.md`).
- Phase 4 profiles & discovery: restyled profiles, Posts/Media tabs, bio + nested `xClash`, Explore search (`07-profiles.md`, `08-search-and-discovery.md`).
- Phase 5 messaging: Threads-shell Inbox, Activity panel, keyed Firestore listener cleanup (`09-messaging.md`).
