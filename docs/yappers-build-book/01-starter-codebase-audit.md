# 01 — Starter Codebase Audit

**Date:** 2026-08-03  
**Source:** [`Pierce-44/instagram-clone`](https://github.com/Pierce-44/instagram-clone)  
**Local path:** Yap repo root (starter flattened out of `instagram-clone/`)  
**Phase:** 0 complete → Phase 1 foundation  
**Status:** Audit complete. App sources live at repo root beside `cursor.md` and `docs/`.

---

## 1. Goal

Understand and preserve the working Instagram clone starter before any Yappers branding, design-system, or feature migration work.

---

## 2. Existing behavior

The starter is a full client-side Instagram-style social app:

| Feature | Status in starter |
| --- | --- |
| Email/password auth (sign up, sign in, sign out) | Working (needs Firebase config) |
| Guest login helper | Present; placeholders only |
| User profiles (dynamic `/[Profile]`) | Working |
| Profile photo upload / remove | Working |
| Follow / unfollow | Working |
| Image posts with caption | Working (media-required posts) |
| Likes | Working |
| Comments | Working (flat comments array on post doc) |
| Stories | Working |
| User search (prefix / case-sensitive style) | Working |
| Explore users (paginated) | Working |
| Chat rooms + unread flags | Working |
| Heart / activity notifications | Working |
| Dark mode (localStorage + class) | Working |
| Responsive header + layouts | Working |

Posts are **image-first** (Instagram model), not text-first (Threads / Yappers model). There is no dedicated post-detail route; post detail opens via `PostPopUp` modal.

---

## 3. Stack and tooling

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js **16.2** (Pages Router) | Upgraded from 12; App Router not adopted yet |
| UI | React **19.2** | |
| Language | TypeScript **7** CLI (`@typescript/native`) + TS **6** API package for Next/ESLint | See CHANGELOG stack upgrade note |
| Styling | Tailwind CSS **4.3** + `@tailwindcss/postcss` | `darkMode` via `@custom-variant` |
| State | Jotai **1.13** | Centralized in `util/atoms.ts` |
| Backend | Firebase **9.23** (compat modular SDK) | Auth, Firestore, Storage |
| Images | `next/image` + `browser-image-compression` | Firebase Storage via `remotePatterns` |
| Lint | ESLint 9 flat config + `eslint-config-next` | `npm run lint` |
| Format | Prettier 3 + `prettier-plugin-tailwindcss` | |

**Missing vs Yappers plan:** no shadcn/ui, no Aceternity, no lucide-react, no CSS design tokens / brand variables, no `.env` / `.env.example` (config is hardcoded placeholders in source).

---

## 4. Repository layout

```
yap/
├── cursor.md                          # Project instructions
├── docs/yappers-build-book/           # Development book
├── pages/                             # Routes
├── components/                        # UI by feature folder
├── hooks/                             # Auth, listeners, UI hooks
├── util/                              # Firebase helpers + atoms
├── styles/globals.css
├── public/
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 5. Routes

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `pages/index.tsx` | Home feed + stories + suggestions |
| `/Login` | `pages/Login.tsx` | Sign in |
| `/SignUp` | `pages/SignUp.tsx` | Create account |
| `/Explore` | `pages/Explore.tsx` | Browse registered users |
| `/Inbox` | `pages/Inbox.tsx` | Chat rooms |
| `/[Profile]` | `pages/[Profile].tsx` | User profile by username |
| `/api/hello` | `pages/api/hello.ts` | Default Next API stub (unused by app) |

Unauthenticated users are redirected to `/Login` from `useGetUserDetailsOnAuth`.

`_app.tsx` mounts global side effects: auth listener, following shuffle, stories extraction, spotlight users, dark mode preference, new-message check.

---

## 6. Firebase data model

Config lives in `util/firbaseConfig.ts` (**typo in filename**) with placeholder strings. Guest credentials live in `util/guestAccess.ts` (also placeholders).

### Auth

- Email/password via Firebase Auth
- `displayName` set to username on signup
- Username is the primary Firestore document key (not UID) for `users/{username}`

### Named collections (stable)

| Collection | Doc ID / shape | Purpose |
| --- | --- | --- |
| `users` | username | Profile, follows, stories, chatRoomIds, heart notifications, counters |
| `userList` | username | Global username registry (empty docs; IDs are the list) |

### Per-user dynamic collections

| Pattern | Purpose |
| --- | --- |
| `{username}Posts` | User’s posts; includes sentinel doc `userPosts` with `postsListArray` |
| `{uidA}{uidB}` | Chat room collection; meta doc `users` + message docs |

### Storage folders (README)

- `posts/`
- `profilePhotos/`
- `stories/`

### User document shape (`users/{username}`)

From `handleCreateUser` / `notificationTypes`:

```ts
{
  userId: string;
  avatarURL: string;
  chatRoomIds: string[];
  messageCount: number;
  likes: boolean;          // legacy/odd flag
  likedPosts: string[];
  username: string;
  postCount: number;
  followers: string[];
  following: string[];
  story: string;
  storyViews: string[];
  heartNotifications: heartDetails[];
  newHeart: boolean;
  usernameQuery: string[]; // prefix search tokens
}
```

### Post document shape (`{username}Posts/{postId}`)

```ts
{
  createdAt: Timestamp;     // serverTimestamp
  imgURL: string;
  likeCount: number;
  likes: string[];
  comments: postCommentTypes[]; // first entry often used as caption
  postID: string;
}
```

### Architectural risks for Yappers

1. **Username-keyed docs** couple identity to display name renames.
2. **Per-user post collections** (`{username}Posts`) and **per-chat collections** scale poorly and complicate security rules / querying a global “For You” feed.
3. **Home feed** loads **one latest post per followed user** (`limit(1)`), not a chronological global feed.
4. **Comments are embedded arrays**, not a reply tree — nested replies need a model change later.
5. **No text-only posts** — composer assumes image upload.
6. Firebase config and guest credentials are **in source**, not env vars.

Do **not** reshape collections until Phase 0–2 UI migration is stable; document any future schema change with migration impact first (see `cursor.md` §12).

---

## 7. State (Jotai atoms)

Defined in `util/atoms.ts`:

| Atom | Role |
| --- | --- |
| `darkMode` | Theme class |
| `userStatus` | Auth boolean |
| `userDetails` | Firebase Auth user / details |
| `userNotifications` | Live `users/{username}` snapshot |
| `userPosts` | Current user’s posts |
| `homePagePosts` | Map of followed username → latest post |
| `stories` / `storiesArray` | Story URLs + view state |
| `followingArray` / `followingArrayStatus` | Shuffled following list for feed |
| `allChatRoomMessages` | Chat room ID → messages |
| `usersListArray` | Usernames from `userList` |
| `spotlightUsers` | Suggestion cards |
| `listeners` | Unsubscribe fns (cleared on logout / signup) |
| Loading flags | `loggingIn`, `postsLoading`, `storiesLoading`, `suggestionsLoading`, `chatRoomLoading`, `userPorfileLoading` (typo), `newMessage` |

---

## 8. Validation results (Phase 0)

Commands run from the Yap repo root:

| Check | Result |
| --- | --- |
| `npm install` | Success (398 packages); deprecated `core-js@3.6.5` transitive warning |
| `npm run lint` | **Pass** — no ESLint warnings or errors |
| `npx tsc --noEmit` | **Pass** |
| `npm run build` | **Pass** — all pages compiled |
| `npm run dev` | **Pass** — Login and `/` return HTTP 200 |
| Auth / Firestore E2E | **Blocked** — Firebase config is placeholders |

Build notes:

- Experimental Next image feature warning (`allowFutureImage`)
- Outdated `caniuse-lite` / Browserslist data warning
- First Load JS for home ≈ **281 kB** (heavy client bundle; `_app` alone ≈ 136 kB chunk)

---

## 9. Package health (no automatic upgrades)

| Package | Locked | Latest (approx.) | Assessment |
| --- | --- | --- | --- |
| `next` | 12.2.3 | 16.x | Major gap; stay on 12 until Yappers shell is stable, then plan upgrade |
| `firebase` | 9.9.1 | 12.x | 9.23 is within major; later migrate carefully |
| `jotai` | 1.7.8 | 2.x | API changes in v2; keep v1 for now |
| `typescript` | 4.7.4 | 5+/7 | Upgrade with Next |
| `tailwindcss` | 3.1.6 | 3.4 / 4.x | Prefer Tailwind 3.4 before considering v4 |
| `eslint` | 8.20 | 9/10 | Tied to Next 12 tooling |

**npm audit:** 28 vulnerabilities (8 moderate, 17 high, 3 critical), largely transitive (`websocket-driver`, `ws`, `tmp`, etc.). Do **not** run `npm audit fix --force` blindly — it can jump Next majors. Prefer targeted fixes after Firebase env is configured.

**Known starter issues (non-blocking for audit):**

- Filename typo: `firbaseConfig.ts`
- Atom typo: `userPorfileLoading`
- Util typo: `handleResetNewHears.ts`
- README clone URL incorrectly points at `netflix-clone`
- Example Firebase keys appear in README (illustrative; local config still placeholders)
- `eslint-config-airbnb` listed under `dependencies` instead of `devDependencies`
- No `typecheck` script
- No `.env.example`

---

## 10. Phased migration plan (tied to real files)

### Phase 0 — Audit and stabilization (current)

- [x] Inspect structure, configs, routes, atoms, Firebase usage
- [x] Install deps; lint; typecheck; build; smoke-run dev
- [x] Document audit + file index
- [ ] Add Firebase via env + `.env.example` (blocker for real E2E)
- [ ] Optional: fix only runtime blockers once real Firebase is wired

### Phase 1 — Foundation

Touch first:

- Branding: `InstagramSVG`, page `<Head>` titles, `public/instagram*.png`
- Design tokens: `styles/globals.css`, `tailwind.config.js`
- Shell: replace/adapt `components/header/Header.tsx`; add left nav + mobile bottom nav primitives
- Introduce shadcn-compatible UI kit under `components/ui/`
- Keep pages and Firebase handlers unchanged where possible

### Phase 2 — Feed transformation

- Rewrite `pages/index.tsx`, `components/homePage/HomePagePost.tsx`, `components/header/AddNewPost.tsx`
- Text-first composer; keep `handleAddNewPost` until text-only schema is decided
- Stories (`StoryBoard*`) can remain but de-emphasize visually

### Phase 3 — Post conversations

- Promote `PostPopUp.tsx` / comment flow toward a real post route
- Extend beyond `handleSendPostMessage` array comments only after flat replies work

### Phase 4 — Profiles and discovery

- Restyle `pages/[Profile].tsx`, `components/profilePages/*`
- Extend user doc carefully for optional X-Clash fields (`server`, `alliance`, etc.)
- Improve `useCheckUserName`, `useExploreUsers`, `HeaderSearchWindow`

### Phase 5 — Messaging and notifications

- Restyle `pages/Inbox.tsx`, `components/InboxPage/*`, `HeartNotificationsWindow.tsx`
- Review listener fan-out in `useGetUserDetailsOnAuth`

### Phase 6 — X-Clash layer

- New collections/features only after social core is restyled and stable

### Phase 7 — Quality and release

- Security rules, a11y, performance, deployment, monitoring

---

## 11. Architectural decisions (Phase 0)

1. **App sources live at the Yap repo root**; migrate in place.
2. **Do not upgrade Next / React / Firebase majors** until Phase 1 shell lands and Firebase env is real.
3. **Preserve Firestore shapes** during UI migration; prefer adapters at the UI boundary.
4. **Documentation lives in `docs/yappers-build-book/`** alongside `cursor.md`.

---

## 12. How to test (after Firebase is configured)

1. Create Firebase project; enable Email/Password auth.
2. Create Firestore collections `users`, `userList`; Storage folders `posts`, `profilePhotos`, `stories`.
3. Put config in env (once Phase 0 env work is done) or temporarily in `firbaseConfig.ts`.
4. `npm install && npm run dev`
5. Sign up → create post → like/comment → follow → inbox → explore → dark mode.

Until then: `npm run lint`, `npx tsc --noEmit`, and `npm run build` are the regression gates.

---

## 13. Known limitations

- App cannot authenticate or load social data without real Firebase credentials.
- Feed model is “latest post per follow,” not a true chronological or algorithmic feed.
- No nested replies, text-only posts, communities, or X-Clash fields.
- Instagram branding and layout throughout.
- Listener strategy attaches many `onSnapshot` subscriptions per following list (performance risk at scale).

---

## 14. Next step

1. Configure Firebase (env + `.env.example`) and verify full auth → feed smoke path.  
2. Begin **Phase 1**: Yappers design tokens, branding rename, shadcn/ui, application shell — without changing Firestore schemas.

**Stop here per first assignment:** no visual rewrite until this audit is accepted.
