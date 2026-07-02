# memory.md — Keputusan & Pelajaran Penting

Log ini isinya keputusan arsitektur dan hal-hal yang sudah pernah gagal/dicoba, supaya tidak diulang. Tambahkan entri baru di atas (paling baru di atas), format: `## YYYY-MM-DD — Judul singkat`.

---

## 2026-07-02 — Bug tsconfig `ignoreDeprecations` bikin typecheck mati total

**Masalah:** `apps/web/tsconfig.json` punya `"ignoreDeprecations": "6.0"`. TypeScript yang terpasang di project ini adalah 5.9.3, dan versi tersebut tidak mengenali `"6.0"` sebagai value valid untuk opsi ini → `error TS5103: Invalid value for '--ignoreDeprecations'`. Karena Turborepo menjalankan typecheck untuk semua package dalam satu pipeline, ini bikin `pnpm typecheck` gagal total, bukan cuma di `@klip/web`.

**Fix:** Diubah ke `"5.0"` (value yang valid untuk TS 5.9.3).

**Pelajaran:** Kalau upgrade TypeScript versi mayor, cek ulang value `ignoreDeprecations` — ini bukan "set once forget forever", valid values-nya berubah tergantung versi TS yang terpasang.

---

## 2026-07-02 — Audit menyeluruh: struktur monorepo sudah solid

**Konteks:** Full audit repo (clone, install, typecheck, lint, build) untuk pastikan implementation-plan.md benar-benar tercermin di kode, bukan cuma checklist yang dicentang di dokumen.

**Temuan:**
- Struktur `apps/web` + `apps/mobile` + `packages/{api,utils,tsconfig,eslint-config}` sudah sesuai rencana di `implementation-plan.md`.
- `@klip/api` dan `@klip/utils` **sudah benar-benar dipakai** (mobile hooks `useFeed`/`useProfile` import dari `@klip/api`; `apps/web/lib/utils.ts` re-export dari `@klip/utils`) — sebelumnya ini pernah jadi masalah (package menganggur/unused setelah refactor besar).
- Asset Expo (`icon.png`, `adaptive-icon.png`, `splash.png`, `favicon.png`) semua file PNG valid, bukan placeholder kosong.
- `pnpm lint` bersih (0 error, beberapa warning kecil unused-vars di mobile — non-blocking).

**Gap yang masih terbuka:** `eas.json` belum ada di `apps/mobile/` — perlu dibuat sebelum bisa `eas build` untuk distribusi APK.

---

## Keputusan Arsitektur (dari implementation-plan.md, diringkas)

- **Kenapa monorepo pnpm + Turborepo:** supaya web dan mobile bisa share types, API client, dan utils tanpa duplikasi, sambil tetap bisa build/deploy independen.
- **Kenapa migrasi dari TanStack Start ke Next.js:** SEO (SSR/SSG built-in) untuk web app yang butuh discoverability publik (profil UMKM, video promosi).
- **Kenapa Next.js 15 (bukan 14 seperti draft awal di implementation-plan.md):** upgrade mengikuti rilis stabil terbaru saat implementasi jalan. Implementation-plan.md belum di-update untuk mencerminkan ini — anggap kode di `apps/web/package.json` sebagai source of truth versi, bukan dokumen plan.
- **Kenapa `packages/ui` disebut di plan tapi tidak ada di kode:** komponen UI web (shadcn/ui) dan mobile (React Native) tidak bisa di-share secara visual, jadi keputusan akhirnya UI components tetap lokal di masing-masing app; `packages/ui` di plan dropped, hanya *logic* (bukan visual) yang di-share lewat `@klip/api`/`@klip/utils`.

---

## Belum Selesai / Next Steps

- [ ] Buat `eas.json` untuk build APK via EAS (profile development/preview/production)
- [ ] Testing & deploy web ke Vercel (Phase 2 di implementation-plan.md masih belum dicentang untuk item ini)
- [ ] Setup backend nyata (saat ini `packages/api` masih fetch ke `https://api.klip.app` placeholder / pakai mock data di `apps/web/data/feed.ts`)
