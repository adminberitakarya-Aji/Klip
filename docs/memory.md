# memory.md — Keputusan & Pelajaran Penting

Log ini isinya keputusan arsitektur dan hal-hal yang sudah pernah gagal/dicoba, supaya tidak diulang. Tambahkan entri baru di atas (paling baru di atas), format: `## YYYY-MM-DD — Judul singkat`.

---

## 2026-07-03 — Fix permanen: hapus `baseUrl` total dari tsconfig (bukan tambal `ignoreDeprecations`)

**Masalah:** Editor VS Code menunjukkan error deprecation lagi soal `baseUrl` di `apps/web/tsconfig.json`, dengan pesan yang menyarankan `"ignoreDeprecations": "6.0"`. Ini muncul lagi karena TypeScript 6.0 **baru resmi rilis** (awal Juli 2026) dan benar-benar men-deprecate `baseUrl` — beda dari kejadian sebelumnya (2026-07-02) waktu CLI project masih TS 5.9.3 yang belum mengenal value `"6.0"`.

**Kenapa nggak sekadar pasang `ignoreDeprecations: "6.0"`:** itu cuma nunda masalah. TypeScript 7.0 (rilis native compiler berikutnya) akan **menghapus total** dukungan `baseUrl`, jadi `ignoreDeprecations` cuma kerja sampai upgrade TS berikutnya, lalu masalahnya balik lagi dengan versi yang lebih mendesak.

**Fix permanen:** Hapus `baseUrl` sepenuhnya dari `apps/web/tsconfig.json` dan `apps/mobile/tsconfig.json`. Karena nilainya cuma `"."` (root project, sama dengan lokasi file tsconfig), `paths: {"@/*": ["./*"]}` tetap resolve sama persis tanpa `baseUrl` — TypeScript otomatis pakai lokasi file config sebagai root kalau `baseUrl` tidak diset. Tidak ada perubahan perilaku, `pnpm typecheck` tetap lolos bersih di semua package.

**Pelajaran:** Untuk deprecation TypeScript yang "cuma dipakai sebagai prefix `paths`" (kasus paling umum), solusi yang benar hampir selalu **hapus opsinya**, bukan suppress dengan `ignoreDeprecations`. `ignoreDeprecations` cocok dipakai kalau memang butuh waktu migrasi bertahap di codebase besar, bukan untuk proyek kecil yang bisa langsung dibenerin dalam satu baris.

---

## 2026-07-03 — Tombol "Get App" di web di-wire ke link download APK

**Sebelum:** Tombol "Get App" di `apps/web/app/page.tsx` (top-right bar versi desktop) cuma `toast("Tautan unduh aplikasi dikirim")` — placeholder, tidak benar-benar mengarahkan ke mana pun.

**Sekarang:** Tombol itu buka `APK_DOWNLOAD_URL` (konstanta di atas `apps/web/app/page.tsx`) di tab baru — saat ini di-set ke link build EAS profile `preview`.

**⚠️ Penting — ini solusi sementara:**
- Link build EAS itu **per-build dan bisa expired/berganti** setiap kali `eas build` baru dijalankan. Tiap kali ada build APK baru untuk dirilis ke tester, `APK_DOWNLOAD_URL` di `apps/web/app/page.tsx` harus di-update manual.
- Untuk jangka panjang, ganti ke salah satu: (a) link Play Store setelah publish resmi, atau (b) landing page distribusi APK permanen yang auto-update ke build terbaru (misal lewat EAS Update channel atau halaman redirect sendiri).

**Belum ada:** Tombol "Get App" versi mobile-nya sendiri (kalau nanti dibutuhkan link balik dari app ke web, atau sebaliknya) — belum ada requirement untuk itu.

---

## 2026-07-03 — Build APK pertama gagal: bug nativewind 4.2.x `react-native-worklets`

**Masalah:** Build EAS pertama (`eas build --profile preview --platform android`) lolos sampai tahap Gradle compile, tapi gagal di `createBundleReleaseJsAndAssets` dengan error:
```
Cannot find module 'react-native-worklets/plugin'
Require stack: ... react-native-css-interop/dist/metro/transformer.js ...
```

**Root cause:** `apps/mobile/package.json` menulis `"nativewind": "^4.0.0"` (range, bukan versi terkunci). Waktu `eas build` resolve dependency, nativewind ke-resolve ke **4.2.6** — versi ini punya bug dari `react-native-css-interop` yang butuh package `react-native-worklets`, padahal package itu tidak pernah jadi dependency eksplisit di project mana pun yang kena bug ini. Ini **bug upstream nativewind yang sudah dikonfirmasi luas** (GitHub issue nativewind #1574, #1580; react-native-reanimated #8239, #8242), bukan kesalahan konfigurasi kita, dan tidak bisa di-fix dengan install `react-native-worklets` manual (sudah dicoba banyak orang, tetap gagal).

**Fix:** Kunci versi nativewind ke `"4.1.23"` (versi terakhir sebelum bug ini muncul), bukan `"^4.0.0"`. Setelah `pnpm install` ulang, `react-native-css-interop` ikut ter-resolve ke versi aman (0.1.22).

**Pelajaran:**
- Untuk dependency yang punya riwayat breaking change di minor version (nativewind termasuk salah satu), **jangan pakai `^` range** — kunci versi exact.
- Error "Cannot find module 'X/plugin'" saat Metro bundling sering berarti ada **dependency transitif yang ke-upgrade tanpa sengaja**, bukan berarti file itu perlu diinstall manual — cek dulu apakah ini known issue di GitHub sebelum coba fix manual.
- `pnpm add <package>` (termasuk yang dijalankan otomatis oleh `expo install`) bisa memicu re-resolusi dependency lain lewat lockfile, jadi selalu jalankan `pnpm typecheck` + coba build lokal setelah ada perubahan dependency, sebelum push ke EAS.

---

## 2026-07-02 — `eas.json` dibuat, siap build APK

**Keputusan:** Buat `apps/mobile/eas.json` dengan 3 profile (development/preview/production), semuanya `distribution: "internal"` dan `android.buildType: "apk"` — bukan `app-bundle`. Alasan: target dekat adalah distribusi APK langsung ke tester/UMKM, bukan submit ke Play Store. Kalau nanti perlu Play Store, tinggal ganti `buildType` profile `production` ke `"app-bundle"`.

**Yang masih perlu manual (butuh kredensial, tidak bisa dijalankan agent):**
```bash
eas login     # login akun Expo
eas init      # link project ke akun EAS → auto-isi extra.eas.projectId di app.json
eas build --profile preview --platform android
```

**Catatan:** `app.json` belum ada `runtimeVersion` — tidak masalah untuk build APK biasa. Baru perlu ditambahkan kalau nanti pakai **EAS Update** (push update JS tanpa build ulang APK).

**Status:** Gap "eas.json belum ada" di entri 2026-07-02 sebelumnya (Audit menyeluruh) sudah closed.

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

- [x] Buat `eas.json` untuk build APK via EAS (profile development/preview/production) — selesai 2026-07-02
- [ ] `eas login` + `eas init` + build APK pertama (manual, butuh kredensial dev)
- [ ] Testing & deploy web ke Vercel (Phase 2 di implementation-plan.md masih belum dicentang untuk item ini)
- [ ] Setup backend nyata (saat ini `packages/api` masih fetch ke `https://api.klip.app` placeholder / pakai mock data di `apps/web/data/feed.ts`)