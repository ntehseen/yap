# 02 — Environment Setup

**Date:** 2026-08-03  
**Phase:** 1

## Goal

Load Firebase (and optional guest) credentials from environment variables instead of hardcoding placeholders in source.

## Existing behavior

Previously `util/firbaseConfig.ts` and `util/guestAccess.ts` contained literal placeholder strings. The README instructed developers to paste Firebase config into source.

## Architectural decision

Use Next.js `NEXT_PUBLIC_*` variables so the browser SDK can read config at build/runtime without committing secrets. Keep empty-string fallbacks so `lint` / `typecheck` / `build` still succeed before a project is configured.

## Files changed

- `.env.example` — placeholder keys only
- `.gitignore` — ignore `.env` and `.env.local`
- `util/firbaseConfig.ts` — reads env; reuses existing Firebase app via `getApps()`
- `util/guestAccess.ts` — reads guest email/password from env

## Important code explanation

```ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  // ...
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
```

## Firebase / data impact

None. Document shapes unchanged. Auth still requires Email/Password enabled and collections `users` / `userList` plus Storage folders `posts`, `profilePhotos`, `stories`.

## How to test

1. Copy `.env.example` → `.env.local`
2. Fill Firebase web config values
3. Optionally set guest credentials
4. `npm run dev` and sign in / sign up

## Known limitations

- Without `.env.local`, demo Firebase config placeholders are used so `next build` can prerender; real auth will not work until env is filled.
- Guest login fails until guest env vars are set.

## Next step

Document design tokens (`03-design-system.md`) and keep credentials out of git.
