# Implementation Plan: Klip — Web (Next.js) + Mobile (Expo) Monorepo

## Overview

Arsitektur **monorepo** dengan satu codebase yang menghasilkan:
- **Web** → Next.js (SSR/SSG untuk SEO)
- **Mobile** → Expo + EAS (APK/IPA)

```
klip/
├── apps/
│   ├── web/          → Next.js
│   └── mobile/       → Expo
├── packages/
│   ├── ui/           → Shared components
│   ├── api/          → API calls & hooks
│   ├── utils/        → Shared utilities
│   └── tsconfig/     → Shared TypeScript config
├── turbo.json        → Turborepo config
└── package.json      → Root workspace
```

---

## Tech Stack

### Web (apps/web)
| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS 4 |
| Components | shadcn/ui |
| State | TanStack Query |
| Routing | Next.js file-based |
| SSR/SSG | Next.js built-in |

### Mobile (apps/mobile)
| Layer | Technology |
|-------|------------|
| Framework | Expo SDK 51+ |
| Routing | Expo Router |
| Styling | NativeWind (Tailwind untuk RN) |
| State | TanStack Query |
| Animations | react-native-reanimated |
| Gestures | react-native-gesture-handler |
| Video | expo-av |
| List | @shopify/flash-list |
| Build | EAS Build |

### Shared (packages/)
| Package | Purpose |
|---------|---------|
| `@klip/api` | API client, hooks, types |
| `@klip/utils` | Formatters, validators, constants |
| `@klip/ui` | Shared component logic (not visual) |
| `@klip/tsconfig` | Base TypeScript config |

---

## Folder Structure Detail

```
klip/
│
├── apps/
│   ├── web/
│   │   ├── app/
│   │   │   ├── (feed)/
│   │   │   │   ├── page.tsx           → Feed utama
│   │   │   │   ├── explore/page.tsx   → Explore
│   │   │   │   └── following/page.tsx → Following
│   │   │   ├── profile/
│   │   │   │   └── [handle]/page.tsx  → Profile user
│   │   │   ├── upload/page.tsx        → Upload clip
│   │   │   ├── inbox/page.tsx         → Inbox/notifikasi
│   │   │   ├── layout.tsx             → Root layout
│   │   │   └── page.tsx               → Home/redirect
│   │   ├── components/
│   │   │   ├── feed/
│   │   │   ├── ui/
│   │   │   └── layout/
│   │   ├── public/
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   └── mobile/
│       ├── app/
│       │   ├── (tabs)/
│       │   │   ├── index.tsx          → Feed utama
│       │   │   ├── explore.tsx        → Explore
│       │   │   ├── upload.tsx         → Upload
│       │   │   ├── inbox.tsx          → Inbox
│       │   │   └── profile.tsx        → Profile
│       │   ├── _layout.tsx            → Root layout
│       │   └── [handle].tsx           → Profile dynamic
│       ├── components/
│       │   ├── feed/
│       │   └── ui/
│       ├── app.json
│       ├── metro.config.js
│       ├── tailwind.config.ts
│       └── package.json
│
├── packages/
│   ├── api/
│   │   ├── src/
│   │   │   ├── client.ts             → Fetch/axios instance
│   │   │   ├── hooks/
│   │   │   │   ├── useFeed.ts
│   │   │   │   ├── useProfile.ts
│   │   │   │   └── useAuth.ts
│   │   │   ├── types/
│   │   │   │   ├── feed.ts
│   │   │   │   ├── user.ts
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/
│   │   ├── src/
│   │   │   ├── format.ts             → Date, number formatters
│   │   │   ├── validators.ts         → Zod schemas
│   │   │   ├── constants.ts          → App constants
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── tsconfig/
│       ├── base.json
│       ├── next.json
│       ├── expo.json
│       └── package.json
│
├── turbo.json
├── package.json                        → Workspace root
└── pnpm-workspace.yaml
```

---

## File Mapping: Codebase Lama → Next.js

### Routing (1:1 mapping, layout TIDAK berubah)

| File Lama (TanStack Start) | Next.js | Notes |
|---|---|---|
| `src/routes/__root.tsx` | `app/layout.tsx` | Root layout, tetap sama |
| `src/routes/index.tsx` | `app/page.tsx` | Feed utama |
| `src/routes/explore.tsx` | `app/explore/page.tsx` | Explore page |
| `src/routes/following.tsx` | `app/following/page.tsx` | Following feed |
| `src/routes/friends.tsx` | `app/friends/page.tsx` | Friends page |
| `src/routes/live.tsx` | `app/live/page.tsx` | Live streaming |
| `src/routes/inbox.tsx` | `app/inbox/page.tsx` | Inbox/notifikasi |
| `src/routes/upload.tsx` | `app/upload/page.tsx` | Upload clip |
| `src/routes/activity.tsx` | `app/activity/page.tsx` | Activity |
| `src/routes/profile.$handle.tsx` | `app/profile/[handle]/page.tsx` | Dynamic profile |
| `src/routes/more.tsx` | `app/more/page.tsx` | More menu |
| `src/routes/more.$section.tsx` | `app/more/[section]/page.tsx` | Dynamic section |

### Layout Components (TETAP, tidak diubah)

| File | Tujuan | Status |
|---|---|---|
| `src/components/feed/PageShell.tsx` | Wrapper layout utama | ✅ Tetap |
| `src/components/feed/TopBar.tsx` | Header/top navigation | ✅ Tetap |
| `src/components/feed/BottomNav.tsx` | Mobile bottom navigation | ✅ Tetap |
| `src/components/feed/SideNav.tsx` | Desktop sidebar navigation | ✅ Tetap |
| `src/components/feed/DesktopHeader.tsx` | Desktop header | ✅ Tetap |

### Feed Components (TETAP, tidak diubah)

| File | Tujuan | Status |
|---|---|---|
| `src/components/feed/ClipCard.tsx` | Card video clip | ✅ Tetap |
| `src/components/feed/CommentSheet.tsx` | Bottom sheet komentar | ✅ Tetap |
| `src/components/feed/DesktopClipView.tsx` | View clip desktop | ✅ Tetap |

### UI Components (TETAP, shadcn/ui sudah kompatibel Next.js)

| File | Status |
|---|---|
| `src/components/ui/button.tsx` | ✅ Tetap |
| `src/components/ui/dialog.tsx` | ✅ Tetap |
| `src/components/ui/drawer.tsx` | ✅ Tetap |
| `src/components/ui/sheet.tsx` | ✅ Tetap |
| `src/components/ui/scroll-area.tsx` | ✅ Tetap |
| `src/components/ui/avatar.tsx` | ✅ Tetap |
| `src/components/ui/badge.tsx` | ✅ Tetap |
| `src/components/ui/input.tsx` | ✅ Tetap |
| `src/components/ui/tabs.tsx` | ✅ Tetap |
| `src/components/ui/separator.tsx` | ✅ Tetap |
| `src/components/ui/skeleton.tsx` | ✅ Tetap |
| `src/components/ui/sonner.tsx` | ✅ Tetap |
| Semua `src/components/ui/*` | ✅ Tetap (sudah shadcn/ui) |

### Hooks & Utils (TETAP)

| File | Tujuan | Status |
|---|---|---|
| `src/hooks/use-mobile.tsx` | Detect mobile viewport | ✅ Tetap |
| `src/lib/utils.ts` | `cn()` utility | ✅ Tetap |
| `src/lib/error-capture.ts` | Error handling | ✅ Tetap |
| `src/lib/error-page.ts` | Error page | ✅ Tetap |

### Data & Config (TETAP)

| File | Tujuan | Status |
|---|---|---|
| `src/data/feed.ts` | Mock data feed | ✅ Tetap |
| `src/lib/config.server.ts` | Server config | ✅ Tetap |

### Styles (TETAP)

| File | Tujuan | Status |
|---|---|---|
| `src/styles.css` | Global styles + Tailwind | ✅ Tetap |

### Router & Server (PERLU ADAPTASI)

| File Lama | Next.js Equivalent | Notes |
|---|---|---|
| `src/router.tsx` | Tidak perlu | Next.js pakai file-based routing |
| `src/routeTree.gen.ts` | Tidak perlu | Auto-generated oleh TanStack, Next.js tidak perlu |
| `src/server.ts` | `app/api/` routes | Pindah ke Next.js API routes |
| `src/start.ts` | Tidak perlu | Next.js punya entry point sendiri |

---

## Implementation Phases

### Phase 1: Monorepo Setup ✅
- [x] Init pnpm workspace (`pnpm-workspace.yaml`)
- [x] Setup Turborepo (`turbo.json`)
- [x] Create shared `tsconfig` package (`packages/tsconfig/`)
- [x] Setup `packages/api` dengan TanStack Query
- [x] Setup `packages/utils` (cn, formatNumber, formatDate)

### Phase 2: Web (Next.js) ✅
- [x] Create Next.js app di `apps/web` (App Router)
- [x] Install Tailwind CSS 4 + shadcn/ui
- [x] Copy langsung dari codebase lama (TANPA ubah layout):
  - [x] `src/styles.css` → `apps/web/app/globals.css`
  - [x] `src/components/ui/*` → `apps/web/components/ui/` (sudah shadcn/ui)
  - [x] `src/components/feed/*` → `apps/web/components/feed/`
  - [x] `src/hooks/*` → `apps/web/hooks/`
  - [x] `src/lib/*` → `apps/web/lib/`
  - [x] `src/data/*` → `apps/web/data/`
  - [x] `src/assets/*` → `apps/web/public/`
- [x] Adaptasi routing (hanya ganti nama file):
  - [x] `__root.tsx` → `layout.tsx`
  - [x] `index.tsx` → `page.tsx`
  - [x] `explore.tsx` → `explore/page.tsx`
  - [x] `following.tsx` → `following/page.tsx`
  - [x] `friends.tsx` → `friends/page.tsx`
  - [x] `live.tsx` → `live/page.tsx`
  - [x] `inbox.tsx` → `inbox/page.tsx`
  - [x] `upload.tsx` → `upload/page.tsx`
  - [x] `activity.tsx` → `activity/page.tsx`
  - [x] `profile.$handle.tsx` → `profile/[handle]/page.tsx`
  - [x] `more.tsx` → `more/page.tsx`
  - [x] `more.$section.tsx` → `more/[section]/page.tsx`
- [x] Hapus file yang tidak perlu:
  - [x] `router.tsx` (Next.js pakai file-based)
  - [x] `routeTree.gen.ts` (auto-generated TanStack)
  - [x] `start.ts` (entry point TanStack)
- [x] Setup SEO (metadata di layout.tsx, Open Graph)
- [ ] Testing & deploy (Vercel)

### Phase 3: Mobile (Expo)
- [ ] Create Expo app di `apps/mobile`
- [ ] Setup NativeWind + Tailwind
- [ ] Install dependencies (reanimated, gesture-handler, flash-list)
- [ ] Migrate components ke React Native
  - [ ] Feed (FlatList/FlashList + video player)
  - [ ] Bottom tabs navigation
  - [ ] Profile screen
  - [ ] Upload screen
  - [ ] Inbox screen
- [ ] Setup Expo Router (file-based)
- [ ] Testing di simulator/device

### Phase 4: EAS Build & Deploy
- [ ] Setup EAS project
- [ ] Configure `eas.json`
  - [ ] Development build
  - [ ] Preview build (APK)
  - [ ] Production build (AAB)
- [ ] Build & test APK
- [ ] Setup "Get App" button di web → redirect ke download

### Phase 5: Shared Logic Integration
- [ ] Connect web & mobile ke shared `@klip/api`
- [ ] Sync shared `@klip/utils`
- [ ] Ensure consistent types across platforms

---

## Key Configurations

### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### turbo.json
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "typecheck": {}
  }
}
```

### packages/api/package.json
```json
{
  "name": "@klip/api",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "@tanstack/react-query": "^5.83.0"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
```

### packages/utils/package.json
```json
{
  "name": "@klip/utils",
  "version": "0.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "dependencies": {
    "zod": "^3.24.2"
  },
  "devDependencies": {
    "typescript": "^5.8.3"
  }
}
```

---

## Shared Code Strategy

### Bisa di-share (packages/):
- API client & hooks (`useFeed`, `useProfile`, `useAuth`)
- Types & interfaces (`User`, `Clip`, `Comment`)
- Validators (Zod schemas)
- Utilities (formatters, constants)
- Business logic

### TIDAK bisa di-share (harus pisah):
- UI components (web pakai HTML, mobile pakai RN)
- Routing (Next.js vs Expo Router)
- Styling (CSS vs StyleSheet/NativeWind)
- Platform-specific code (camera, file system)

---

## Dependencies Summary

### Root
```json
{
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.8.3"
  }
}
```

### apps/web
```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@klip/api": "workspace:*",
    "@klip/utils": "workspace:*",
    "@tanstack/react-query": "^5.83.0",
    "tailwindcss": "^4.2.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0",
    "lucide-react": "^0.575.0"
  }
}
```

### apps/mobile
```json
{
  "dependencies": {
    "expo": "~51.0.0",
    "expo-router": "~3.5.0",
    "expo-av": "~14.0.0",
    "react": "^19.2.0",
    "react-native": "^0.74.0",
    "@klip/api": "workspace:*",
    "@klip/utils": "workspace:*",
    "@tanstack/react-query": "^5.83.0",
    "nativewind": "^4.0.0",
    "react-native-reanimated": "~3.10.0",
    "react-native-gesture-handler": "~2.16.0",
    "@shopify/flash-list": "^1.6.0"
  }
}
```

---

## "Get App" Strategy

Di web, tambahkan tombol/redirect:

```tsx
// apps/web/components/GetAppBanner.tsx
export function GetAppBanner() {
  return (
    <a href="/download" className="...">
      <SmartphoneIcon />
      Get the App
    </a>
  );
}
```

Halaman `/download` akan:
1. Detect platform (Android/iOS)
2. Redirect ke Play Store / App Store
3. Atau download APK langsung (untuk Android)

---

## Timeline Estimasi

| Phase | Duration |
|-------|----------|
| Phase 1: Monorepo Setup | 1-2 hari |
| Phase 2: Web (Next.js) | 5-7 hari |
| Phase 3: Mobile (Expo) | 7-10 hari |
| Phase 4: EAS Build | 2-3 hari |
| Phase 5: Integration | 2-3 hari |
| **Total** | **~3-4 minggu** |

---

## Catatan

1. **Mulai dari web dulu** → karena codebase lama sudah ada, migrate ke Next.js lebih cepat
2. **Mobile menyusul** → reuse logic dari `packages/api` dan `packages/utils`
3. **EAS di akhir** → setelah mobile stabil
4. **Monorepo** → pnpm workspace + Turborepo untuk manage dependencies dan build

---

## Status Monorepo Setup

### Struktur yang Sudah Dibuat
```
D:/tik-tok-vibe-26-main/
├── apps/
│   └── web/                    ✅ Next.js app lengkap
│       ├── app/                ✅ 12 routes (page.tsx)
│       ├── components/         ✅ feed/ + ui/ (40+ shadcn)
│       ├── hooks/              ✅ use-mobile.tsx
│       ├── lib/                ✅ utils, api, config, error
│       ├── data/               ✅ feed.ts
│       ├── public/             ✅ klip-logo.png
│       ├── globals.css         ✅ Tailwind + theme
│       ├── layout.tsx          ✅ Root layout + SEO
│       ├── next.config.ts      ✅ Next.js config
│       ├── tailwind.config.ts  ✅ Tailwind config
│       ├── tsconfig.json       ✅ extends @klip/tsconfig
│       ├── package.json        ✅ Dependencies
│       └── components.json     ✅ shadcn/ui config
├── packages/
│   ├── api/                    ✅ Shared API (types + client)
│   ├── utils/                  ✅ cn, formatNumber, formatDate
│   └── tsconfig/               ✅ base.json + next.json
├── turbo.json                  ✅ Turborepo config
├── pnpm-workspace.yaml         ✅ Workspace definition
├── package.json                ✅ Root workspace
└── tsconfig.json               ✅ Base config
```

### File yang Sudah Dihapus
- `src/` (dipindah ke apps/web/)
- `package-lock.json` (akan pakai pnpm-lock.yaml)
- `app.config.ts` (TanStack Start config)
- `bun.lock`, `bunfig.toml` (tidak dipakai)
- `components.json` (pindah ke apps/web/)
- `eslint.config.js` (pindah ke apps/web/)

### Next Steps
1. `pnpm install` → Install dependencies
2. `pnpm dev` → Jalankan Next.js dev server
3. Testing & fix issues
4. Deploy ke Vercel

---

## Ringkasan: Apa yang Berubah vs Tetap

### ✅ TETAP (copy langsung, tidak diubah)
- Semua `components/ui/*` (shadcn/ui sudah kompatibel)
- Semua `components/feed/*` (ClipCard, TopBar, BottomNav, SideNav, dll)
- `hooks/*` (use-mobile, dll)
- `lib/*` (utils, error handling, config)
- `data/*` (mock data)
- `styles.css` (Tailwind globals)
- `assets/*` (logo, images)

### 🔄 ADAPTASI (hanya ganti nama/struktur file)
- Routes: `__root.tsx` → `layout.tsx`, `index.tsx` → `page.tsx`, `profile.$handle.tsx` → `profile/[handle]/page.tsx`
- Import paths: sesuaikan jika ada perbedaan

### ❌ HAPUS (tidak perlu di Next.js)
- `router.tsx` (Next.js pakai file-based routing otomatis)
- `routeTree.gen.ts` (auto-generated TanStack Router)
- `start.ts` (entry point TanStack Start)
- `server.ts` (pindah ke `app/api/` routes)

### 🆕 TAMBAH (baru untuk Next.js)
- `app/layout.tsx` (root layout dengan metadata SEO)
- `next.config.ts`
- `app/api/*` (API routes kalau butuh server-side)
