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
