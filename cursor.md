# Yappers — Cursor Project Instructions

## 1. Project identity

**Project name:** Yappers  
**Product:** A community-first social platform initially built for X-Clash players.  
**Core concept:** Instagram-level social functionality presented through a clean, conversation-focused interface inspired by Threads.

Yappers should feel playful, fast, friendly, and slightly chaotic—not like a corporate dashboard and not like a direct Instagram or Threads copy.

Possible tagline:

> Where the X-Clash community comes to yap.

## 2. Starting codebase

This project begins from:

`https://github.com/Pierce-44/instagram-clone`

The existing repository uses:

- Next.js with the Pages Router
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Firebase Storage
- Jotai for client state

The starter already includes functionality such as:

- Authentication
- User profiles and profile photos
- Follow and unfollow
- Posts
- Likes
- Comments
- Stories
- Search
- Chat rooms and unread-message notifications
- Activity notifications
- Explore users
- Dark mode
- Responsive layouts

Preserve working functionality while progressively replacing the visual system and improving the architecture.

## 3. Cursor’s role

Act as a senior full-stack engineer, UI/UX designer, and technical mentor.

For every task:

1. Inspect the relevant files before changing code.
2. Explain the existing implementation briefly.
3. Identify dependencies and possible regressions.
4. Propose the smallest safe implementation.
5. Make changes in logical, reviewable steps.
6. Run TypeScript, lint, and build checks when available.
7. Clearly report changed files, behavior, and remaining issues.

Never invent files, functions, routes, Firebase collections, packages, or APIs without confirming the repository structure first.

Do not replace a working subsystem merely because a newer approach exists. Refactor only when it supports the current milestone.

## 4. Product direction

Yappers is not merely an Instagram reskin.

It should combine:

- Threads-like reading and conversation flow
- Instagram-style media, profiles, stories, follows, likes, comments, search, notifications, and messaging
- X-Clash-specific identity and community features
- Modern shadcn/ui foundations
- Selective Aceternity UI motion and visual effects

The product should begin as an unofficial X-Clash community platform while keeping the architecture flexible enough to support other games later.

## 5. Design principles

### Overall aesthetic

Use a premium dark-first interface with restrained gaming character.

The design should be:

- Minimal
- Highly readable
- Mobile-first
- Conversation-focused
- Content-dense without feeling crowded
- Smooth but not excessively animated
- Playful in copy and microinteractions

Avoid:

- Directly copying Threads assets or exact layouts
- Instagram gradients as the primary identity
- Overusing glowing borders
- Excessive glassmorphism
- Constant background animations
- Giant dashboard cards
- Purple-everywhere “AI startup” styling
- Aceternity components added only for decoration

### Visual language

Use:

- Near-black background rather than pure black where appropriate
- Soft neutral borders
- White or near-white primary text
- Muted gray secondary text
- One restrained Yappers accent color through CSS variables
- Rounded controls, but do not make every container a floating card
- Thin separators between feed items
- Clear typography hierarchy
- Generous tap targets on mobile

The feed should resemble a continuous social conversation rather than a grid of detached cards.

### Brand personality

UI copy may occasionally use words such as:

- Yap
- Yapping
- Yappers
- Hot yap
- Re-yap

Use these selectively. Do not make every label a joke.

## 6. UI libraries

### shadcn/ui

Use shadcn/ui as the default component foundation for:

- Buttons
- Dialogs
- Drawers
- Dropdown menus
- Tabs
- Tooltips
- Toasts
- Avatars
- Inputs
- Textareas
- Command/search interfaces
- Sheets
- Skeletons
- Alerts

Wrap or customize components when needed so the app has a distinct Yappers identity.

### Aceternity UI

Use Aceternity UI only where motion creates real value, such as:

- Authentication or onboarding hero
- Subtle profile header treatment
- Empty states
- Special event announcements
- Featured community content
- Lightweight background accents
- Delightful transitions

Do not use complex Aceternity effects inside every post. Feed performance and readability come first.

### Icons

Prefer `lucide-react` for the core icon system. Maintain consistent stroke widths and sizing.

## 7. Responsive application shell

### Desktop

Use a three-region layout:

1. **Left navigation**
   - Yappers logo
   - Home
   - Explore
   - Search
   - Create
   - Notifications
   - Messages
   - Communities or Alliances
   - Profile
   - More/settings

2. **Center feed**
   - Maximum readable width around 640–720px
   - Composer at the top
   - Feed tabs such as “For You” and “Following”
   - Continuous threaded posts

3. **Right sidebar**
   - Search
   - Suggested players
   - Trending discussions
   - Active alliances or communities
   - Upcoming X-Clash events

The right sidebar can be deferred until the core feed is stable.

### Mobile

Use:

- Compact top bar
- Full-width feed
- Sticky bottom navigation
- Floating or prominent create action
- Sheets/drawers instead of desktop dialogs when suitable
- Safe-area support

Do not simply shrink the desktop interface.

## 8. Core post experience

A Yappers post may contain:

- Text
- One or multiple images
- Video later
- Battle-report screenshots
- Hero-build screenshots
- Optional tags
- Optional server/alliance context

Each feed item should display:

- Avatar
- Display name
- Username
- Optional verified, leader, R4, or R5 badge later
- Timestamp
- Text body
- Media
- Reply count
- Like count
- Re-yap/repost count later
- Share action
- Overflow menu

The interaction row should be quiet and compact. Avoid oversized Instagram-style controls.

Clicking a post should open a detail page showing the complete conversation thread.

## 9. Composer

The composer should feel closer to Threads than Instagram.

Requirements:

- Text-first
- Avatar visible
- Auto-growing textarea
- Add image/media
- Character-count support if a limit is introduced
- Audience or community selector later
- Clear disabled/loading states
- Optimistic publishing only when safe
- Accessible keyboard behavior

Use “Post” initially or “Yap” if the branded wording feels natural in the finished UI.

## 10. Profiles

Profiles should include:

- Avatar
- Cover or subtle branded header later
- Display name
- Username
- Bio
- Followers and following
- Follow/message actions
- Text-and-media feed as the default view
- Media tab
- Replies tab later

Add optional X-Clash fields without making them mandatory for future non-X-Clash users:

- Server
- Alliance
- Castle level
- Combat power
- Role such as Member, R4, R5, or Prime Minister
- Main team or favorite hero later

Store game-specific data in a nested or extensible profile structure rather than scattering individual assumptions throughout the UI.

## 11. X-Clash community features

Implement these only after the existing social foundation is stable.

Potential features:

- Server communities
- Alliance pages
- Recruitment posts
- Battle-report posts
- Hero-build posts
- Strategy-guide posts
- Event reminders
- Polls
- Community announcements
- Player badges
- Alliance role badges
- Content filters by server or alliance

Do not hard-code one alliance, server, role, or event into shared components.

## 12. Authentication and Firebase

Preserve the existing Firebase authentication and data flow during the UI migration.

Rules:

- Never expose secrets or private Firebase credentials beyond values intended for the browser.
- Move configuration to environment variables where practical.
- Provide or update `.env.example` with placeholder values only.
- Do not commit real secrets.
- Validate authenticated users before writes.
- Preserve unsubscribe cleanup for Firestore real-time listeners.
- Handle loading, empty, success, and error states explicitly.
- Avoid duplicate subscriptions and unnecessary reads.
- Use server timestamps for shared chronological data.
- Review Firebase security-rule requirements whenever data models or write behavior change.

Before modifying collections or document shapes, document:

- Existing shape
- Proposed shape
- Migration impact
- Compatibility strategy

## 13. State management

Continue using Jotai where the existing project already depends on it.

Use local component state for local UI concerns. Do not put every dialog, hover state, or input into global state.

When fetching Firestore data:

- Separate remote data from temporary UI state
- Avoid mirrored duplicate state
- Keep subscriptions close to the feature or place them in clearly named hooks
- Memoize only when justified
- Prefer predictable data flow over clever abstractions

Do not introduce Redux, Zustand, or another global-state library without a clear project-wide reason.

## 14. Code standards

Use:

- TypeScript strictness wherever the current codebase permits
- Functional React components
- Named types and interfaces for shared data
- Reusable components based on actual repetition
- Clear, descriptive names
- Early returns
- Small focused hooks
- Centralized route constants or helpers when repetition appears
- Firebase converter or typed mapping patterns when practical

Avoid:

- `any` unless unavoidable and explained
- Giant components
- Deep prop drilling when existing context/state can solve it cleanly
- Unnecessary abstraction
- Inline duplicated Firebase queries
- Silent error handling
- Commented-out dead code
- Mass file rewrites without need
- Mixing unrelated refactors into feature work

## 15. Accessibility

All new or rewritten UI must support:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Proper labels
- Alt text for meaningful images
- Screen-reader text for icon-only controls
- Sufficient contrast
- Reduced-motion preferences
- Dialog focus management
- Logical heading structure

Do not treat accessibility as a later phase.

## 16. Performance

Prioritize feed performance.

- Use Next.js image optimization when compatible with Firebase Storage.
- Define image dimensions or stable aspect ratios to prevent layout shifts.
- Lazy-load offscreen media.
- Avoid expensive animated backgrounds behind scrolling content.
- Avoid re-rendering the entire feed after a single interaction.
- Paginate or progressively load large collections.
- Clean up Firestore listeners.
- Use skeletons for meaningful loading states.
- Keep client-side bundles reasonable.

## 17. Error and empty states

Every major screen should account for:

- Loading
- Empty
- Error
- Offline or interrupted connection where practical
- Unauthenticated access
- Unauthorized action

Use playful Yappers copy sparingly, for example:

- “No yaps yet.”
- “It’s suspiciously quiet here.”
- “Be the first to start yapping.”

Error messages must still clearly explain what happened and what the user can do.

## 18. Migration strategy

Do not attempt a full rewrite in one pass.

### Phase 0 — Audit and stabilization

- Install dependencies.
- Run the current app.
- Record current routes, features, Firebase collections, state atoms, reusable components, and known errors.
- Fix only blockers required to run the starter.
- Create a baseline screenshot inventory when useful.

### Phase 1 — Foundation

- Rename visible branding from Instagram Clone to Yappers.
- Define design tokens and CSS variables.
- Install/configure shadcn/ui.
- Install only the Aceternity dependencies actually required.
- Add the shared app shell.
- Create reusable navigation and layout primitives.
- Preserve existing functionality.

### Phase 2 — Feed transformation

- Replace the old Instagram-style home layout.
- Build the Threads-inspired composer.
- Build the Yappers post component.
- Add “For You” and “Following” tabs when backed by real queries.
- Ensure likes, comments, media, and navigation still work.

### Phase 3 — Post conversations

- Build or improve post-detail routes.
- Present comments as replies.
- Add nested reply support only after the first-level reply flow is reliable.
- Improve notifications for replies and likes.

### Phase 4 — Profiles and discovery

- Rebuild profiles using the new visual language.
- Add media and post tabs.
- Improve user search.
- Add X-Clash profile fields.
- Build player suggestions and discovery.

### Phase 5 — Messaging and notifications

- Restyle chat rooms.
- Improve unread states.
- Consolidate the notification experience.
- Ensure real-time listeners are efficient and cleaned up.

### Phase 6 — X-Clash layer

- Server and alliance metadata
- Community feeds
- Recruitment posts
- Battle-report and hero-build post types
- Event tools
- Moderation roles

### Phase 7 — Quality and release

- Security review
- Firebase rules review
- Accessibility audit
- Responsive audit
- Performance audit
- Metadata and sharing previews
- Error monitoring
- Deployment configuration

Complete each phase before heavily expanding the next one.

## 19. Documentation requirements

Maintain a project development book in:

`docs/yappers-build-book/`

Suggested structure:

- `00-project-overview.md`
- `01-starter-codebase-audit.md`
- `02-environment-setup.md`
- `03-design-system.md`
- `04-application-shell.md`
- `05-feed-and-composer.md`
- `06-posts-comments-and-replies.md`
- `07-profiles-and-follows.md`
- `08-search-and-discovery.md`
- `09-messaging.md`
- `10-notifications.md`
- `11-xclash-features.md`
- `12-testing-security-and-deployment.md`
- `CHANGELOG.md`
- `FILE-INDEX.md`

After every meaningful implementation step, update the relevant chapter with:

1. Goal
2. Existing behavior
3. Architectural decision
4. Files changed
5. Important code explanation
6. Firebase/data impact
7. How to test
8. Known limitations
9. Next step

`FILE-INDEX.md` must map features to their important files, components, hooks, functions, atoms, routes, collections, and documentation chapters.

Documentation must explain enough for a developer to rebuild and understand the application; do not merely paste complete source files.

## 20. Testing and validation

After changes, run the closest available commands, such as:

```bash
npm run lint
npm run typecheck
npm run build
```

If a script is missing, inspect `package.json` before adding it.

Test relevant behavior manually, including:

- Signed-out state
- Sign-up and sign-in
- Feed loading
- Creating a post
- Media upload
- Like/unlike
- Comment/reply
- Follow/unfollow
- Profile navigation
- Search
- Notifications
- Messaging
- Mobile navigation
- Dark theme

Never claim a check passed unless it was actually run successfully.

## 21. Git discipline

Keep changes reviewable.

Suggested commit style:

- `chore: audit starter repository`
- `feat: add yappers application shell`
- `feat: redesign feed post component`
- `refactor: isolate firestore post queries`
- `fix: clean up realtime message listener`
- `docs: document feed architecture`

Do not commit generated secrets, build output, local environment files, or unrelated editor files.

## 22. Response format for implementation tasks

Before editing, respond with:

### Current understanding
A brief summary of the requested feature and relevant existing implementation.

### Files involved
The files expected to be inspected or modified.

### Implementation approach
A short ordered plan.

After editing, respond with:

### Completed
What changed and how it behaves.

### Files changed
Each file and its purpose.

### Validation
Commands and tests actually performed.

### Documentation
The build-book chapter and index entries updated.

### Remaining issues
Only real limitations, risks, or follow-up work.

## 23. First assignment after cloning

When this file is first added to the cloned repository, do not immediately redesign the application.

Perform the following:

1. Inspect the entire repository structure.
2. Read `README.md`, `package.json`, TypeScript config, Tailwind config, Firebase configuration, pages, components, hooks, atoms/state, and utilities.
3. Install dependencies and run the app.
4. Run lint and build.
5. Identify outdated or broken packages without upgrading everything automatically.
6. Create `docs/yappers-build-book/01-starter-codebase-audit.md`.
7. Create `docs/yappers-build-book/FILE-INDEX.md`.
8. Produce a phased migration plan tied to the actual files found.
9. Stop and report the audit before beginning the visual rewrite.

The first goal is to understand and preserve the working application. The second goal is to transform it safely into Yappers.
