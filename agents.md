# agents.md — Aturan Kerja Agent di Repo Klip

Panduan ini untuk AI agent (Claude Code, Cursor, dll) atau siapa pun yang baru masuk ke repo ini. Baca dulu sebelum ubah apa pun.

## Apa Ini Project

Klip = platform video singkat gaya TikTok untuk promosi UMKM Indonesia. Monorepo pnpm + Turborepo:

```
apps/web/       → Next.js 15 (App Router)
apps/mobile/    → Expo SDK 51 (Expo Router)
packages/api/          → @klip/api — types + API client, dipakai web & mobile
packages/utils/        → @klip/utils — cn(), formatNumber(), formatDate()
packages/tsconfig/      → @klip/tsconfig — base/next/expo tsconfig
packages/eslint-config/ → @klip/eslint-config — flat config base/next/react-native
```

Semua command dijalankan dari **root**, lewat Turborepo — jangan `cd apps/web && npm run build`, pakai `pnpm --filter @klip/web build` atau cukup `pnpm build` (jalanin semua package).

## Command Wajib

```bash
pnpm install              # sekali di awal / setelah ubah dependency
pnpm dev                  # jalankan web + mobile dev server bareng
pnpm lint                 # wajib 0 error sebelum commit
pnpm typecheck             # wajib lolos di semua package sebelum commit
pnpm build                 # build web (mobile pakai EAS, bukan `build` biasa)
pnpm format                # prettier --write .

# Mobile — build APK (dari apps/mobile/, butuh login, tidak bisa dijalankan agent):
eas login
eas init                    # sekali saja, link project ke akun EAS
eas build --profile preview --platform android
```

Kalau agent bikin perubahan kode, **selalu jalankan `pnpm typecheck` dan `pnpm lint` sebelum bilang selesai**. Jangan asumsikan kode benar cuma karena "terlihat benar".

## Gotcha yang Sudah Pernah Kejadian

Jangan ulangi ini:

1. **`ignoreDeprecations` di `apps/web/tsconfig.json`** — pernah ke-set ke `"6.0"` (tidak valid untuk TypeScript versi yang terpasang, TS 6.0 belum ada) dan bikin `pnpm typecheck` gagal total di seluruh monorepo dengan `error TS5103`. Sekarang di-set `"5.0"`. Kalau upgrade TypeScript, cek dulu apakah value ini masih valid — cabut kalau nggak perlu lagi.
2. **`next build` butuh akses internet** untuk fetch font `Space Grotesk` dari Google Fonts (`apps/web/app/layout.tsx`, pakai `next/font/google`). Di sandbox/CI tanpa akses internet ke `fonts.googleapis.com`, build akan gagal dengan error font — ini bukan bug kode, cuma keterbatasan jaringan environment.
3. **`@klip/api` dan `@klip/utils` harus benar-benar dipakai**, bukan cuma didaftarkan di `package.json`. Pernah ada insiden dua package ini menganggur (unused) setelah refactor besar. Cek dengan `grep -rn "@klip/api\|@klip/utils" apps/` kalau ragu.
4. **`eas.json` sudah ada** di `apps/mobile/` (3 profile: development/preview/production, semuanya `buildType: "apk"` — bukan `app-bundle`, karena tujuannya distribusi APK langsung bukan Play Store). Sebelum `eas build` bisa jalan, masih perlu `eas login` + `eas init` (link project ke akun EAS, otomatis isi `extra.eas.projectId` di `app.json`) — dua langkah ini butuh kredensial jadi tidak bisa dijalankan agent, harus manual oleh dev.

## Konvensi Kode

- **UI components** (`apps/web/components/ui/*`) = shadcn/ui, jangan edit manual kecuali emergency — biasanya di-regenerate lewat shadcn CLI.
- **Feed components** (`apps/web/components/feed/*`) = hasil migrasi 1:1 dari codebase lama (TanStack Start). Kalau ubah, cek `docs/implementation-plan.md` bagian "File Mapping" dulu supaya tahu asal-usulnya.
- **Shared logic** (types, API calls, formatters) masuk `packages/api` atau `packages/utils` — **bukan** di-duplicate antara `apps/web` dan `apps/mobile`.
- **Platform-specific** (UI, routing, styling) tetap terpisah web vs mobile — jangan coba share komponen visual lintas platform.
- Komentar kode boleh Bahasa Inggris (ikuti gaya file yang sudah ada), dokumentasi (`docs/`, `agents.md`) boleh Bahasa Indonesia.

## Sebelum Mulai Kerja

1. Baca `docs/implementation-plan.md` untuk arsitektur & roadmap.
2. Baca `docs/memory.md` untuk histori keputusan & kenapa sesuatu dibuat begitu.
3. Jalankan `pnpm install && pnpm typecheck && pnpm lint` untuk pastikan baseline bersih sebelum mulai ubah apa pun.

## Setelah Selesai Kerja

1. `pnpm typecheck` — harus 0 error.
2. `pnpm lint` — harus 0 error (warning boleh, tapi sebutkan ke user kalau ada yang baru muncul).
3. Kalau ubah `apps/web`, coba `pnpm --filter @klip/web build` (butuh akses internet untuk Google Fonts).
4. Update `docs/memory.md` kalau ada keputusan arsitektur baru atau pelajaran penting yang didapat.