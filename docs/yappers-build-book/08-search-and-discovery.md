# 08 — Search and discovery

**Date:** 2026-08-03  
**Phase:** 4

## Goal

Improve player search and Explore so discovery feels useful for finding Yappers, including optional alliance/server context.

## Existing behavior

Sidebar search used `usernameQuery` array-contains. Explore paginated the `users` collection five at a time with Instagram-era list UI. Right sidebar showed initials only.

## Architectural decision

- Lowercase search needles to match normalized `usernameQuery`
- Explore page has inline search (same query path) plus paginated discover list
- Player rows show bio or X-Clash meta when present
- Right sidebar suggestions use avatars + meta and link to Explore
- Search results in the shell overlay show richer rows

## Files changed

- `pages/Explore.tsx`
- `hooks/useCheckUserName.ts`
- `util/handleCreateUsernameQueryArray.ts` (lowercase prefixes)
- `components/header/HeaderSearchWindow.tsx`
- `components/layout/RightSidebar.tsx`

## Firebase / data impact

Saving a profile refreshes `usernameQuery` via `handleUpdateProfile`. New accounts get lowercase query prefixes. Older mixed-case prefixes may need a profile save to refresh.

## How to test

1. Search from the shell for a partial username
2. On Explore, search and clear to return to Discover
3. Load more players
4. Confirm suggested players in the home right rail

## Known limitations

- No server/alliance indexed filters yet
- Spotlight still random five from `userList`

## Next step

Phase 5 — messaging and notifications.
