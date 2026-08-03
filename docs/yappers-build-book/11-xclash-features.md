# 11 — X-Clash features (Phase 6 lite)

**Date:** 2026-08-03  
**Phase:** 6

## Goal

Make Yap feel X-Clash-aware without full community infrastructure: typed posts, server/alliance context on posts, and discovery filters.

## Existing behavior

- Profiles already store optional nested `users.{username}.xClash` (server, alliance, castle, CP, role)
- Posts were untyped (`comments`, `imgURL`, likes, etc.)

## Architectural decision

Extend `{username}Posts` documents with optional fields. Legacy posts omit them and render as normal yaps.

```json
{
  "yapType": "yap | recruitment | battleReport | heroBuild",
  "xClashContext": { "server": "", "alliance": "" },
  "tags": ["optional", "strings"]
}
```

No new Firestore collections for servers/alliances in this slice.

## Files changed

- `util/atoms.ts` — `YapPostKind`, `postXClashContext`, `postType` fields
- `util/yapTypes.ts` — labels / placeholders
- `util/handleAddNewPost.ts` — persist type + context
- `components/homePage/FeedComposer.tsx` — type chips + server/alliance inputs (profile prefills)
- `components/header/AddNewPost.tsx` — same options on create modal
- `components/post/YapTypeBadge.tsx` — shared badges
- `HomePagePost`, `PostThread`, `UserPost` — display badges
- `pages/Explore.tsx` — client-side server/alliance filters + “My server” chip
- `components/layout/RightSidebar.tsx` — “On your server” from spotlight users

## Firebase / data impact

- Additive fields only; no migration
- Writes still go to `{username}Posts` via `publishYap`
- Explore filters operate on already-fetched user docs (no new indexes)

## How to test

1. Edit profile → set Server / Alliance → Save
2. Home composer → pick Recruit / Battle / Build → confirm prefills → Post
3. Feed shows type badge + `S{server}` / alliance chips
4. Open thread → badges persist
5. Explore → filter by server/alliance; use “My server”
6. Profile media grid shows short type label on non-yap tiles

## Known limitations / Phase 6b

- No dedicated `servers/` or `alliances/` pages or membership
- No event tools, polls, or moderation roles
- Explore filter is client-side on loaded results only
- Community-wide chronological feed of a single server still deferred

## Next step

Phase 7 quality/release, or Phase 6b community pages when needed.
