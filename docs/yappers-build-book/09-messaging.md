# 09 — Messaging and notifications (Phase 5)

## Goals

- Restyle chat rooms to match the Threads-inspired Yap shell
- Clearer unread indicators on conversation list + nav badge
- Consolidate activity notifications UI
- Stop stacking Firestore listeners on every user-doc snapshot

## Inbox layout

Route: `pages/Inbox.tsx` inside `AppShell` (640px feed column).

- Sticky **Messages** header (60px) with compose action
- Conversation list with avatar, name, last preview, unread dot
- Thread pane: header, bubbles, composer (emoji + send)
- Mobile: list ↔ thread with back control
- Desktop: list (240px) + thread side-by-side when a chat is open

## Data model (unchanged)

- User doc: `chatRoomIds: string[]`
- Each chat room is a Firestore collection named by room id
- Special `users` doc in the room holds `{user}ChatName`, `{user}NewMessage`, avatars
- Messages: `{ name, text, createdAt }` queried `orderBy createdAt desc` limit 50

## Listener cleanup

`hooks/useGetUserDetailsOnAuth.ts` now keeps per-id unsubscribe maps for:

- chat rooms
- following home posts
- following stories

Re-running sync on user-doc updates only adds/removes listeners for id diffs instead of stacking duplicates. Sign-out still unsubscribes via `atoms.listeners`.

## Notifications

`HeartNotificationsWindow` restyled as an Activity panel (rounded popover, deep-link to post thread when `postId` exists).

## Files

- `pages/Inbox.tsx`
- `components/InboxPage/ChatRoom.tsx`
- `components/InboxPage/SendMessage.tsx`
- `components/InboxPage/CreateChatRoom.tsx`
- `components/header/HeartNotificationsWindow.tsx`
- `hooks/useGetUserDetailsOnAuth.ts`
