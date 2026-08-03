# 07 — Profiles

**Date:** 2026-08-03  
**Phase:** 4

## Goal

Rebuild profiles in the Yappers visual language with Posts/Media tabs, editable bio, and optional nested X-Clash fields.

## Existing behavior

Instagram-style header (large avatar, Follow/Message, POSTS label) and a 3-column image grid. No bio or game metadata. Profile posts opened the legacy popup.

## Architectural decision

- `ProfileHeader` + `ProfileTabs` + grid of `UserPost` tiles linking to `/post/...`
- Tabs: **Posts** (all) and **Media** (image-only)
- Own profile: Edit profile modal for `bio` + nested `xClash`
- Game fields stay optional under `users.{username}.xClash`
- Filter out non-post docs via `postID` + `comments` instead of `slice(0, -1)`

## Files changed

- `pages/[Profile].tsx`
- `components/profilePages/ProfileHeader.tsx`, `ProfileTabs.tsx`, `EditProfileModal.tsx`, `XClashBadgeRow.tsx`, `UserPost.tsx`, `FollowerFollowingDisplay.tsx`
- `util/handleUpdateProfile.ts`, `atoms.ts` (`bio`, `xClash`)
- `util/ensureUserProfile.ts`, `handleCreateUser.ts` defaults

## Firebase / data impact

New optional fields on `users/{username}`:

```json
{
  "bio": "",
  "xClash": {
    "server": "",
    "alliance": "",
    "castleLevel": "",
    "combatPower": "",
    "role": ""
  }
}
```

Existing profiles work without migration; empty UI until edited.

## How to test

1. Open your profile → Edit profile → set bio + X-Clash → Save
2. Confirm badges and bio render
3. Switch Posts / Media tabs
4. Open a grid tile → thread route
5. Follow / Message still work on other profiles

## Known limitations

- No cover image yet
- Replies tab deferred
- Other-user profile fetch is still one-shot (not live)

## Next step

Search/discovery chapter (`08`); then Phase 5 messaging.
