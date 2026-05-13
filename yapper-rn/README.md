# Yapper RN

A React Native (Web) rewrite of Yapper. Dark + iridescent **liquid glass** design, animated, TypeScript end-to-end. Same Supabase backend as the original.

## Stack

- **Expo SDK 52** with **Expo Router** (file-based routing)
- **TypeScript** (strict)
- **react-native-web** for browser deployment
- **expo-blur** + custom `<GlassView>` for liquid glass surfaces
- **react-native-reanimated** + **moti** for animations
- **@supabase/supabase-js** for auth and data

## Quick start

```bash
cd yapper-rn
npm install
npm run web      # open in browser at http://localhost:8081
# or:
npm start        # opens Metro and lets you pick iOS / Android / Web
```

## Build for GitHub Pages

```bash
npm run build:web
# Output goes to ./dist — push that branch to GitHub Pages.
```

Because `web.output` is `"single"`, you get a true SPA with one `index.html`. For
GitHub Pages, copy `index.html` to `404.html` after building so deep links work:

```bash
copy dist\index.html dist\404.html   # PowerShell
```

## Project layout

```
yapper-rn/
├── app/                  # Expo Router — file-based routes
│   ├── _layout.tsx       # Root: status bar, gesture root, theme
│   ├── index.tsx         # Auth gate / redirect
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   └── (tabs)/
│       ├── _layout.tsx   # Floating glass bottom nav
│       ├── home.tsx      # Feed + compose
│       └── profile.tsx   # Profile + Yaps/Likes tabs
├── components/
│   ├── ui/
│   │   ├── GlassView.tsx        ← the liquid glass primitive
│   │   ├── AmbientBackground.tsx ← drifting iridescent aurora
│   │   ├── Wordmark.tsx         ← gradient "Yapper" text
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   └── AppText.tsx
│   ├── PostCard.tsx
│   └── ComposeBox.tsx
├── hooks/
│   └── useAuth.ts
├── lib/
│   ├── supabase.ts
│   └── types.ts
└── theme/
    └── index.ts          # colors, gradients, spacing, motion presets
```

## What works today

- Sign in / sign up against the existing Supabase project
- Home feed (For You + Following) with the compose box
- Like / unlike posts with spring animations
- Profile page with banner, avatar ring, follower/following counts, Yaps/Likes tabs
- Liquid glass on every surface — blur + iridescent gradient + specular highlight
- Drifting aurora background on every screen

## What's coming

- Post detail page with replies
- Reposts, quote posts, hashtags, bookmarks
- DMs with the realtime channel
- Explore + trending
- Notifications
- Admin / banning
- Profile setup flow for new accounts
