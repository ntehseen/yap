# FILE-INDEX — Yappers / Starter Map

Maps features to important files at the Yap repo root. Update this file whenever features move or new Yappers modules appear.

**Last updated:** 2026-08-03 (Phase 1 foundation)  
**Related chapter:** [`01-starter-codebase-audit.md`](./01-starter-codebase-audit.md)

---

## How to use

- Paths are relative to the Yap repo root unless noted.
- When a Yappers replacement exists, add a note under the feature.

---

## App bootstrap

| Concern | Files | Docs |
| --- | --- | --- |
| App shell / global hooks | `pages/_app.tsx` | 01, 04 |
| Global CSS / tokens | `styles/globals.css` | 03 |
| Next config (images domain) | `next.config.js` | 01 |
| Tailwind | `tailwind.config.js`, `postcss.config.js` | 03 |
| TypeScript + `@/` alias | `tsconfig.json` | 01, 03 |
| ESLint / Prettier | `.eslintrc.json`, `.prettierrc.json` | 01 |
| Env example | `.env.example` | 02 |
| Project instructions | `cursor.md` | — |
| `cn` helper | `lib/utils.ts` | 03 |
| UI primitives | `components/ui/*` | 03 |
| App shell | `components/layout/AppShell.tsx`, `SideNav.tsx`, `MobileBottomNav.tsx`, `RightSidebar.tsx`, `navItems.ts` | 04 |
| Brand logo | `components/brand/YappersLogo.tsx` | 04 |

---

## Routes

| Feature | Route | Page file | Docs |
| --- | --- | --- | --- |
| Home feed | `/` | `pages/index.tsx` | 05 |
| Login | `/Login` | `pages/Login.tsx` | 02 |
| Sign up | `/SignUp` | `pages/SignUp.tsx` | 02 |
| Explore users | `/Explore` | `pages/Explore.tsx` | 08 |
| Messages | `/Inbox` | `pages/Inbox.tsx` | 09 |
| Profile | `/[Profile]` | `pages/[Profile].tsx` | 07 |
| Stub API | `/api/hello` | `pages/api/hello.ts` | — |

---

## Authentication

| Concern | Files | Collections / services | Docs |
| --- | --- | --- | --- |
| Firebase app init | `util/firbaseConfig.ts` | Firebase project | 02, 12 |
| Guest credentials helper | `util/guestAccess.ts` | Auth | 02 |
| Sign in handler | `util/handleSignIn.ts`, `hooks/useHandleSignIn.ts` | Auth | 02 |
| Sign up handler | `util/handleCreateUser.ts` | Auth + `users`, `userList`, `{username}Posts` | 02 |
| Form validation | `util/validate.ts`, `hooks/useSetFormErrors.ts`, `hooks/useCheckNameLength.ts` | — | 02 |
| Auth state + subscriptions | `hooks/useGetUserDetailsOnAuth.ts` | Auth + Firestore listeners | 01, 12 |
| Sign out | `hooks/useHandleSignOut.ts` | Auth; clears `listeners` | 02 |
| Username query tokens | `util/handleCreateUsernameQueryArray.ts` | written on user create | 08 |

---

## State (Jotai)

| Concern | Files | Atoms (export `atoms`) | Docs |
| --- | --- | --- | --- |
| Atom definitions / shared types | `util/atoms.ts` | `darkMode`, `userStatus`, `userDetails`, `userNotifications`, `userPosts`, `homePagePosts`, `stories`, `storiesArray`, `followingArray`, `followingArrayStatus`, `allChatRoomMessages`, `usersListArray`, `spotlightUsers`, `listeners`, loading flags, `newMessage` | 01 |

---

## Header / navigation

| Concern | Files | Docs |
| --- | --- | --- |
| Top header (legacy) | `components/header/Header.tsx` | 04 |
| Search window | `components/header/HeaderSearchWindow.tsx`, `hooks/useCheckUserName.ts` | 08 |
| Create post modal entry | `components/header/AddNewPost.tsx` | 05 |
| Heart notifications UI | `components/header/HeartNotificationsWindow.tsx`, `hooks/useHandleHeartDropDown.ts`, `hooks/useHandleOpenHeartPost.ts` | 10 |
| Dark mode toggle | `components/header/DarkModeButton.tsx`, `hooks/useSetUserDarkModePreference.ts` | 03 |
| Avatar dropdown / sign out UI | `hooks/useHandleAvatarDropDown.ts` | 04 |
| Brand logo | `components/brand/YappersLogo.tsx` | 01, 04 |
| Nav icons (legacy SVG) | `components/svgComps/{Home,Index,Explore,Heart,NewPost,SearchBtn}SVG.tsx` etc. | 04 |
| Shell icons | `lucide-react` via `components/layout/*` | 04 |

---

## Home feed & stories

| Concern | Files | Data | Docs |
| --- | --- | --- | --- |
| Home page layout | `pages/index.tsx` | `followingArray`, `homePagePosts` | 05 |
| Post card | `components/homePage/HomePagePost.tsx` | `{username}Posts` latest | 05 |
| Caption / header comments snippet | `components/homePage/HomePagePostHeaderComments.tsx` | post `comments` | 06 |
| Empty feed filler | `components/homePage/NoPostsFiller.tsx` | — | 05 |
| Suggestions sidebar | `components/homePage/UserSuggestions.tsx`, `hooks/useGetSpotlightUsers.ts` | `users` | 08 |
| Following shuffle for feed order | `hooks/useShuffleFollowingArray.ts` | `following` | 05 |
| Stories board | `components/homePage/StoryBoard.tsx`, `StoryBoardTag.tsx`, `ViewAllStories.tsx`, `AddStory.tsx`, `ProgressBar.tsx` | `users.story` | 05 |
| Story helpers | `hooks/useExtractStoriesArray.ts`, `hooks/useProgressBar.ts`, `util/handleUpdateUserStory.ts`, `handleWatchedStory.ts`, `handleRemoveStory.ts`, `handleSwipeEvents.ts` | `users`, Storage `stories/` | 05 |
| Feed loading UI | `components/loadingComps/LoadingPosts.tsx`, `LoadingSuggestions.tsx`, `LoadingPage.tsx` | — | 05 |

---

## Posts: create, like, comment, popup

| Concern | Files | Data | Docs |
| --- | --- | --- | --- |
| Create post (upload + caption) | `components/header/AddNewPost.tsx`, `util/handleAddNewPost.ts` | Storage `posts/`, `{username}Posts`, `users.postCount` | 05 |
| Generic image upload helper | `util/handleUploadImage.ts` | Storage | 05 |
| Like / unlike | `util/handleLikePost.ts` | post `likes`, `users.likedPosts` | 06 |
| Heart notification write | `util/handleUpdateHeartNotification.ts`, `handleResetNewHears.ts` | `users.heartNotifications`, `newHeart` | 10 |
| Comment send | `util/handleSendPostMessage.ts`, `components/PostTextArea.tsx` | post `comments` array | 06 |
| Post detail modal | `components/PostPopUp.tsx` | same post doc | 06 |
| Emoji UI | `components/EmojiSelector.tsx`, `util/emojiArray.ts`, `hooks/useHandleEmojiPopUp.ts` | — | 05 |
| Autosize textarea | `react-textarea-autosize` via `PostTextArea` | — | 05 |

---

## Profiles & follows

| Concern | Files | Data | Docs |
| --- | --- | --- | --- |
| Profile page | `pages/[Profile].tsx` | `users`, `{username}Posts` | 07 |
| Profile posts grid item | `components/profilePages/UserPost.tsx` | posts | 07 |
| Other user posts fetch | `hooks/useGetOtherUserPosts.ts` | `{name}Posts` | 07 |
| Add / change profile photo | `components/profilePages/AddProfilePhoto.tsx`, `util/handleUpdateProfilePhoto.ts`, `handleRemoveProfilePhoto.ts` | Storage `profilePhotos/`, Auth photoURL, chat meta | 07 |
| Follow | `util/handleFollowUser.ts` | `followers` / `following` arrays | 07 |
| Unfollow UI + util | `components/profilePages/UnfollowUser.tsx`, `util/handleUnfollow.ts` | same | 07 |
| Followers / following lists | `FollowerFollowingDisplay.tsx`, `FollowingFollowerDropDown.tsx`, `util/handleGetFollowersOrFollowings.ts`, `hooks/useHandleFollowerFollowingDropDown.ts` | `users` | 07 |
| Missing user | `components/profilePages/UserDoesNotExist.tsx` | — | 07 |
| Profile loading | `components/loadingComps/LoadingUserPosts.tsx` | `userPorfileLoading` atom | 07 |

---

## Search & explore

| Concern | Files | Data | Docs |
| --- | --- | --- | --- |
| Header search | `HeaderSearchWindow.tsx`, `useCheckUserName.ts` | `users` + `usernameQuery` | 08 |
| Explore page | `pages/Explore.tsx`, `hooks/useExploreUsers.ts` | `users` paginated | 08 |
| User list mirror | `useGetUserDetailsOnAuth` → `userList` | `userList` | 08 |

---

## Messaging

| Concern | Files | Data | Docs |
| --- | --- | --- | --- |
| Inbox page | `pages/Inbox.tsx` | `chatRoomIds`, messages | 09 |
| Chat room view | `components/InboxPage/ChatRoom.tsx` | `{uidA}{uidB}` | 09 |
| Create chat | `CreateChatRoom.tsx`, `util/handleCreateChatRoom.ts`, `handleCheckChatRoomExists.ts` | chat collection + `users.chatRoomIds` | 09 |
| Send message | `SendMessage.tsx`, `util/handleSendChatRoomMessage.ts` | message docs + unread flags | 09 |
| Unread reset | `util/handleResetNewMessage.ts` | chat `users` meta doc | 09 |
| New message indicator | `hooks/useCheckNewMessages.ts`, atom `newMessage` | chat meta | 09, 10 |
| Scroll helper | `hooks/useScrollToLatestMessage.ts` | — | 09 |
| Chat loading | `components/loadingComps/LoadingChatRooms.tsx` | — | 09 |

---

## Notifications (activity)

| Concern | Files | Data | Docs |
| --- | --- | --- | --- |
| Heart dropdown UI | `HeartNotificationsWindow.tsx` | `heartNotifications`, `newHeart` | 10 |
| Open notifying post | `useHandleOpenHeartPost.ts` | posts | 10 |
| Loading hearts | `LoadingHeartPosts.tsx` | — | 10 |

---

## Shared / misc UI

| Concern | Files | Docs |
| --- | --- | --- |
| Window size | `hooks/useWindowSize.ts` | 04 |
| Profile placeholder SVG | `components/svgComps/ProfilePicSVG.tsx` | 07 |
| Spinners / media SVGs | `components/svgComps/*` | — |
| Public assets | `public/` (`instagram.png`, login frames, moon/sun) | 01 |

---

## Firestore collections (quick map)

| Collection / pattern | Written/read primarily by |
| --- | --- |
| `users` | `handleCreateUser`, follow/unfollow, stories, hearts, chat room id updates, profile photo, live via `useGetUserDetailsOnAuth` |
| `userList` | `handleCreateUser`, `getAllUsersList` |
| `{username}Posts` | `handleAddNewPost`, like, comment, profile/home listeners |
| `{uidA}{uidB}` | `handleCreateChatRoom`, send/reset message handlers, inbox listeners |

Storage paths: `posts/`, `profilePhotos/`, `stories/` (see README + upload handlers).

---

## Documentation book

| File | Purpose |
| --- | --- |
| `docs/yappers-build-book/01-starter-codebase-audit.md` | Phase 0 audit + migration plan |
| `docs/yappers-build-book/02-environment-setup.md` | Firebase env scaffolding |
| `docs/yappers-build-book/03-design-system.md` | Tokens + UI kit |
| `docs/yappers-build-book/04-application-shell.md` | App shell |
| `docs/yappers-build-book/FILE-INDEX.md` | This index |
| `docs/yappers-build-book/CHANGELOG.md` | Change log |
| `docs/yappers-build-book/00-project-overview.md` | Planned |
| `docs/yappers-build-book/05-feed-and-composer.md` | Planned (Phase 2) |
| `docs/yappers-build-book/06-posts-comments-and-replies.md` | Planned (Phase 3) |
| `docs/yappers-build-book/07-profiles-and-follows.md` | Planned (Phase 4) |
| `docs/yappers-build-book/08-search-and-discovery.md` | Planned (Phase 4) |
| `docs/yappers-build-book/09-messaging.md` | Planned (Phase 5) |
| `docs/yappers-build-book/10-notifications.md` | Planned (Phase 5) |
| `docs/yappers-build-book/11-xclash-features.md` | Planned (Phase 6) |
| `docs/yappers-build-book/12-testing-security-and-deployment.md` | Planned (Phase 7) |

---

## Yappers-specific (Phase 1)

| Feature | Status |
| --- | --- |
| shadcn-compatible UI kit | Installed manually under `components/ui/` |
| Aceternity UI | Not installed |
| lucide-react | Installed (shell nav) |
| Design tokens / Yappers accent | Defined in `globals.css` |
| Three-region desktop shell | `AppShell` + `SideNav` + `RightSidebar` |
| Text-first composer / re-yap | Not built (Phase 2) |
| Post detail route / nested replies | Not built |
| X-Clash profile fields | Not built |
