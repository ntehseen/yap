# 02c — Firebase finish checklist (+ Google Auth)

**Date:** 2026-08-03

## Goal

Finish Firebase console setup for Yap and enable Google sign-in alongside email/password.

## Console checklist

### Authentication
1. **Authentication → Sign-in method**
2. Enable **Email/Password**
3. Enable **Google**
   - Choose a support email
   - Save
4. **Authentication → Settings → Authorized domains**
   - Confirm `localhost` is listed (default)
   - Add your production domain later

### Firestore
1. Create database (test mode for local development)
2. First signup (email or Google) auto-creates:
   - `users/{username}`
   - `userList/{username}`
   - `{username}Posts/userPosts`

### Storage
Skip Firebase Storage — Yap uses **Cloudinary** for media.

### Env (`.env.local`)
Confirm Firebase `NEXT_PUBLIC_*` values match Project settings → Your apps → Web config.

## Google sign-in behavior in Yap

- Popup Google OAuth via `signInWithPopup`
- `ensureUserProfile` creates Firestore docs if missing
- Username is derived from a sanitized email prefix (or compact display name)
- Google avatar is stored on the profile when available

## Files

- `util/handleGoogleSignIn.ts`
- `util/ensureUserProfile.ts`
- `components/auth/GoogleSignInButton.tsx`
- `pages/Login.tsx`, `pages/SignUp.tsx`

## How to test

1. Restart `npm run dev`
2. Open `/Login` → **Continue with Google**
3. Pick a Google account
4. Confirm redirect to home
5. In Firebase console: Authentication user exists; Firestore `users` doc exists

## Common errors

| Error | Fix |
| --- | --- |
| `auth/operation-not-allowed` | Enable Google provider in Firebase |
| `auth/unauthorized-domain` | Add domain under Authorized domains |
| Popup blocked | Allow popups for localhost |
| Firestore permission denied | Use test-mode rules or auth-aware rules |

## Next step

Smoke-test Google login + create a Cloudinary-backed post, then continue Phase 2.
