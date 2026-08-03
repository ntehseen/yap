# 03 — Design System

**Date:** 2026-08-03  
**Phase:** 1

## Goal

Establish a dark-first Yappers visual language with CSS variables, Tailwind token mapping, and a small shadcn-compatible UI kit that works on Next.js 12 Pages Router.

## Existing behavior

Starter used hardcoded Instagram colors (`#fafafa`, `#0095f6`, stone borders) and custom SVG icons. No shared design tokens or component primitives.

## Architectural decision

- CSS variables on `:root` / `.dark` for semantic colors
- Tailwind **v4** loads via `@import 'tailwindcss'` + `@config '../tailwind.config.js'`
- Class dark mode via `@custom-variant dark (&:where(.dark, .dark *));`
- Accent: restrained mint/teal (`hsl(162 …)`), not purple
- Manual UI kit (not `shadcn` CLI) for controlled primitives on Pages Router
- `@/` path alias (`tsconfig` paths without deprecated `baseUrl`)

## Files changed

- `styles/globals.css` — token definitions
- `tailwind.config.js` — color/radius mapping; content includes `lib/`
- `tsconfig.json` — `baseUrl` + `@/*`
- `lib/utils.ts` — `cn()` helper
- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/textarea.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/separator.tsx`
- `components/ui/avatar.tsx`
- Dependencies: `class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `@radix-ui/react-slot`, `@radix-ui/react-separator`, `@radix-ui/react-avatar`

## Important code explanation

Tokens follow the shadcn pattern (`hsl(var(--background))`) so future primitives drop in easily. Dark mode still toggles the `.dark` class via Jotai `darkMode`, defaulting to dark-first when no preference is stored.

## Firebase / data impact

None.

## How to test

1. `npm run dev`
2. Toggle dark/light from the More menu
3. Confirm shell and auth pages use mint accent and near-black dark background

## Known limitations

- Many legacy feed/profile components still use Instagram-era hardcoded classes (Phase 2+ will migrate them).
- Aceternity not installed yet.

## Next step

Application shell documentation (`04-application-shell.md`); then Phase 2 feed transformation.
