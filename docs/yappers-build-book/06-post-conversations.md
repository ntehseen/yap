# 06 — Post conversations

**Date:** 2026-08-03  
**Phase:** 3

## Goal

Open yaps on a dedicated thread route and present comments as first-level replies, with live updates and notification links into the conversation.

## Existing behavior

Post detail lived only in `PostPopUp` (Instagram-style modal). Comments were a flat array on the post document; `comments[0]` is the caption and the rest are replies. Heart notifications reopened the modal via `userPosts`.

## Architectural decision

- Route: `/post/[username]/[postId]` → live `onSnapshot` of `{username}Posts/{postId}`
- Threads-style `PostThread`: OP, reply list, sticky `ReplyComposer`
- Feed, profile grid, and heart notifications navigate to the route (modal kept for legacy callers)
- Nested replies deferred until first-level flow is solid
- Notification copy: “liked your yap” / “replied to your yap”
- Like handler reads `currentTarget.id` so icon clicks work

## Files changed

- `pages/post/[username]/[postId].tsx`
- `hooks/usePostDocument.ts`
- `components/post/PostThread.tsx`, `ReplyItem.tsx`, `ReplyComposer.tsx`
- `components/homePage/HomePagePost.tsx`
- `components/profilePages/UserPost.tsx`
- `components/header/HeartNotificationsWindow.tsx`
- `util/handleSendPostMessage.ts`, `handleLikePost.ts`, `handleUpdateHeartNotification.ts`

## Firebase / data impact

No schema change. Still uses embedded `comments` array. `postURL` in heart notifications may be empty for text-only yaps (UI shows a “Yap” placeholder).

## How to test

1. From Home, open a yap → `/post/{user}/{id}`
2. Reply; confirm it appears live and counts update
3. Like from the thread and from the feed
4. Open a heart notification thumbnail → same thread route
5. Open a profile post (image or text) → thread route

## Known limitations

- No nested replies yet
- `PostPopUp` still exists for any leftover callers
- Heart notifications still only cover your own posts’ likes/replies

## Next step

Phase 4 — profiles and discovery restyle.
