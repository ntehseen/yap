# 05 — Feed and Composer

**Date:** 2026-08-03  
**Phase:** 2

## Goal

Replace the Instagram-style home feed with a Threads-inspired conversation feed: text-first composer, compact posts, and For You / Following tabs.

## Existing behavior

- Home showed stories + card-style image posts for each followed user (latest post only).
- Creating posts required an image via the header modal.

## Architectural decision

- Inline `FeedComposer` at top of home (avatar, autosize textarea, optional image, **Yap** CTA).
- `publishYap` supports **text-only** posts (`imgURL` may be `''`).
- Post cards become separator-based conversation rows (not bordered cards).
- Tabs: **Following** = follow list; **For You** = you + follow list until a global query exists.
- Stories remain but sit below the composer (de-emphasized).
- Modal `AddNewPost` still available from nav Create for image-first flow.

## Files changed

- `util/handleAddNewPost.ts` — `publishYap`, optional image
- `components/homePage/FeedComposer.tsx` — new
- `components/homePage/HomePagePost.tsx` — conversation layout
- `components/homePage/NoPostsFiller.tsx` — Yappers empty copy
- `pages/index.tsx` — tabs + composer wiring

## Firebase / data impact

- Post documents still live in `{username}Posts`
- `imgURL` can be empty string for text yaps
- No collection shape migration

## How to test

1. Sign in
2. Post a text-only yap from the home composer
3. Post a yap with an image
4. Switch For You / Following
5. Like and open replies (popup still works)

## Known limitations

- Still one latest post per followed user (not a full chronological merge)
- For You is not algorithmic yet
- Reply UI still uses the legacy popup + embedded comments array

## Next step

Phase 3 — post detail / conversation thread route.
