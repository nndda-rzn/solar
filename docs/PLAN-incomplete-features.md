# Plan: Penyelesaian Fitur Setengah Jadi

**Tanggal:** 17 Juli 2026  
**Status:** Disetujui, siap eksekusi  
**Bahasa:** Bilingual EN + ID (dipertahankan)

---

## Konteks

Audit codebase menemukan 9 item yang belum selesai — 2 bug logic, 2 paritas UI, 3 string hardcoded (i18n), 1 dead code, dan 1 masalah visual. Semua item terisolasi dan tidak membutuhkan perubahan arsitektur.

Keputusan strategis yang sudah dikonfirmasi:

- **rememberMe:** Opsi C — panggil `signOut()` saat `beforeunload` jika `rememberMe=false`
- **HowItWorksSection ilustrasi:** Opsi B — buat SVG illustration berbeda per step
- **Bahasa:** Tetap bilingual EN + ID, tambahkan `id/landing.json` yang hilang

---

## Item & Urutan Eksekusi

### A — Bug Logic (prioritas tertinggi)

#### A1. `simulation-store.ts` — `reset()` tidak reset `dayOffset`

- **File:** `src/lib/store/simulation-store.ts:50`
- **Masalah:** `reset: () => set({ isPlaying: true, speed: 1 })` — `dayOffset` tidak kembali ke `0` saat reset
- **Fix:**
  ```ts
  reset: () => set({ isPlaying: true, speed: 1, dayOffset: 0 }),
  ```
- **Estimasi:** 1 menit
- **Risiko:** Sangat rendah

---

#### A2. `login/page.tsx` — `rememberMe` diabaikan

- **File:** `src/app/[locale]/login/page.tsx:16-37`
- **Masalah:** `values.rememberMe` diterima dari `LoginForm` tapi tidak dipakai sama sekali di `signInWithPassword`
- **Pendekatan:** Simpan flag `rememberMe` ke `sessionStorage`. Jika `false`, daftarkan event listener `beforeunload` yang memanggil `supabase.auth.signOut()` saat tab/browser ditutup
- **Detail implementasi:**
  1. Setelah login berhasil, jika `rememberMe === false`, simpan `sessionStorage.setItem('rememberMe', 'false')`
  2. Di `AuthProvider`, cek flag ini dan pasang `window.addEventListener('beforeunload', handleSignOut)` jika ada
  3. Cleanup listener saat komponen unmount
- **File yang diubah:**
  - `src/app/[locale]/login/page.tsx`
  - `src/components/auth/AuthProvider.tsx`
- **Estimasi:** 15 menit
- **Risiko:** Sedang — perlu test di berbagai browser

---

### B — Paritas UI

#### B1. `settings/page.tsx` — kontrol audio tidak ada

- **File:** `src/app/[locale]/settings/page.tsx`
- **Masalah:** Page hanya tampilkan `perfMode`. `SettingsModal` punya 4 kontrol (perfMode, mute, volume, ambient) tapi page tidak
- **Pendekatan:** Ekstrak semua kontrol dari `SettingsModal` ke komponen shared baru `SettingsForm`, pakai di kedua tempat — eliminasi duplikasi sekaligus memperbaiki paritas
- **File yang diubah/dibuat:**
  - `src/components/settings/SettingsForm.tsx` _(baru)_ — semua kontrol settings
  - `src/app/[locale]/settings/page.tsx` — pakai `<SettingsForm />`
  - `src/components/ui/SettingsModal.tsx` — pakai `<SettingsForm />`
- **Estimasi:** 20 menit
- **Risiko:** Rendah

---

#### B2. `AuthProvider.tsx` — `setLoading` dead code

- **File:** `src/components/auth/AuthProvider.tsx:16,36`
- **Masalah:** `setLoading` di-destructure dan masuk deps array `useEffect` tapi tidak pernah dipanggil. Loading state tidak pernah di-set ke `false` setelah hydrate awal
- **Fix:**
  1. Hapus `setLoading` dari destructure
  2. Hapus dari deps array `useEffect`
  3. Pertimbangkan apakah perlu memanggil `setLoading(false)` setelah `getUser()` resolve — cek apakah ada UI yang depend pada `isLoading` dari auth store
- **Estimasi:** 5 menit
- **Risiko:** Rendah — perlu verifikasi `auth-store.ts` dulu

---

### C — Konten & i18n

#### C1. `help/page.tsx` — FAQ hardcoded `[1, 2, 3]`

- **File:** `src/app/[locale]/help/page.tsx:16`
- **Masalah:** Jumlah FAQ dikunci di kode, bukan dari data. Hanya 3 item, tidak bisa dikembangkan tanpa ubah kode
- **Fix:** Pindahkan FAQ ke translation files sebagai array, render dinamis
- **Struktur data di translation:**
  ```json
  "pages": {
    "help": {
      "title": "Help",
      "faqs": [
        { "q": "...", "a": "..." },
        ...
      ]
    }
  }
  ```
- **Konten FAQ yang akan ditambahkan (minimal 6 per bahasa):**
  - Cara navigasi explorer 3D
  - Cara mengubah skala (solar/stellar/galactic/cosmic)
  - Cara menyimpan bookmark
  - Cara melihat achievements
  - Cara mengubah kecepatan simulasi waktu
  - Perbedaan mode High Quality vs Low Quality
- **File yang diubah:**
  - `src/messages/en/common.json` — tambah `pages.help.faqs` array
  - `src/messages/id/common.json` — sama, dalam Bahasa Indonesia
  - `src/app/[locale]/help/page.tsx` — render dari array translation
- **Estimasi:** 20 menit
- **Risiko:** Rendah

---

#### C2. `LibraryDetail.tsx` — "Close" hardcoded

- **File:** `src/components/library/LibraryDetail.tsx:102`
- **Masalah:** `<button>Close</button>` — tidak menggunakan `t()`
- **Fix:** Ganti dengan `{t("close")}`, tambah key `"close"` ke `en/common.json` dan `id/common.json` jika belum ada
- **Estimasi:** 5 menit
- **Risiko:** Sangat rendah

---

#### C3. `BookmarkSaveModal.tsx` — "Cancel" hardcoded

- **File:** `src/components/ui/BookmarkSaveModal.tsx:178`
- **Masalah:** `"Cancel"` hardcoded, tidak pakai `t()`
- **Fix:** Ganti dengan `{t("cancel")}`, tambah key ke kedua translation files
- **Estimasi:** 5 menit
- **Risiko:** Sangat rendah

---

#### C4. `useAchievementTracker.ts` — "Achievement Unlocked!" hardcoded

- **File:** `src/hooks/useAchievementTracker.ts:70`
- **Masalah:** Hook tidak punya akses `useTranslations()` secara langsung. String toast title hardcoded Inggris
- **Pendekatan:** Hook menerima `titleKey` dari parent atau title dipindahkan ke komponen Toast yang sudah punya akses `useTranslations`. Opsi terbaik: emit event dengan `titleKey: "achievements.unlocked"` dan biarkan Toast component yang translate
- **File yang diubah:**
  - `src/hooks/useAchievementTracker.ts` — kirim key bukan string
  - `src/components/ui/Toast.tsx` (atau nama file toast) — translate di sini
  - `src/messages/en/common.json` — tambah key
  - `src/messages/id/common.json` — tambah key
- **Estimasi:** 15 menit
- **Risiko:** Sedang — perlu cek struktur Toast component

---

#### C5. `id/landing.json` — file tidak ada

- **Masalah:** `src/messages/en/landing.json` ada (83 baris) tapi tidak ada padanan `id/landing.json`. Semua teks landing page fallback ke EN untuk user bahasa Indonesia
- **Fix:** Buat `src/messages/id/landing.json` dengan terjemahan penuh dari EN
- **File yang dibuat:**
  - `src/messages/id/landing.json` _(baru)_
- **Estimasi:** 10 menit
- **Risiko:** Sangat rendah

---

### D — Visual / Landing Page

#### D1. `HowItWorksSection.tsx` — ilustrasi semua identik

- **File:** `src/components/landing/HowItWorksSection.tsx:98-110`
- **Masalah:** Semua 3 step render div placeholder abstrak yang sama persis
- **Pendekatan:** Buat 3 ilustrasi SVG inline berbeda yang mencerminkan konteks masing-masing step:
  - **Step 01 (Create Account):** Ilustrasi form signup dengan input email/password dan tombol
  - **Step 02 (Launch Explorer):** Ilustrasi mini solar system dengan orbit planet berputar
  - **Step 03 (Discover & Learn):** Ilustrasi achievement badge dengan XP counter dan bintang
- **Implementasi:** SVG inline langsung di komponen, tidak perlu asset eksternal. Tetap gunakan warna `[#4a9eff]` dan `white/8` yang sudah ada untuk konsistensi visual
- **File yang diubah:**
  - `src/components/landing/HowItWorksSection.tsx`
- **Estimasi:** 45 menit
- **Risiko:** Rendah (hanya visual, tidak ada logika)

---

## Ringkasan Urutan Eksekusi

| #   | Item                         | File Utama                            | Estimasi | Risiko        |
| --- | ---------------------------- | ------------------------------------- | -------- | ------------- |
| 1   | A1: Fix `reset()` dayOffset  | `simulation-store.ts`                 | 1 mnt    | Sangat rendah |
| 2   | C2: Fix "Close" hardcoded    | `LibraryDetail.tsx`                   | 5 mnt    | Sangat rendah |
| 3   | C3: Fix "Cancel" hardcoded   | `BookmarkSaveModal.tsx`               | 5 mnt    | Sangat rendah |
| 4   | C5: Buat `id/landing.json`   | `messages/id/landing.json`            | 10 mnt   | Sangat rendah |
| 5   | B2: Remove dead `setLoading` | `AuthProvider.tsx`                    | 5 mnt    | Rendah        |
| 6   | C1: Help FAQ dinamis         | `help/page.tsx` + translation         | 20 mnt   | Rendah        |
| 7   | B1: Settings page paritas    | `SettingsForm.tsx` + 2 consumers      | 20 mnt   | Rendah        |
| 8   | A2: Fix `rememberMe`         | `login/page.tsx` + `AuthProvider.tsx` | 15 mnt   | Sedang        |
| 9   | C4: Achievement i18n         | `useAchievementTracker.ts` + Toast    | 15 mnt   | Sedang        |
| 10  | D1: HowItWorks ilustrasi SVG | `HowItWorksSection.tsx`               | 45 mnt   | Rendah        |

**Total estimasi:** ~2.5 jam

---

## File yang Akan Diubah

```
src/
├── lib/store/simulation-store.ts              # A1
├── app/[locale]/login/page.tsx                # A2
├── components/auth/AuthProvider.tsx           # A2, B2
├── components/settings/SettingsForm.tsx       # B1 (baru)
├── app/[locale]/settings/page.tsx             # B1
├── components/ui/SettingsModal.tsx            # B1
├── app/[locale]/help/page.tsx                 # C1
├── components/library/LibraryDetail.tsx       # C2
├── components/ui/BookmarkSaveModal.tsx        # C3
├── hooks/useAchievementTracker.ts             # C4
├── components/ui/Toast.tsx (atau sejenisnya)  # C4
├── components/landing/HowItWorksSection.tsx   # D1
├── messages/en/common.json                    # C1, C2, C3, C4
├── messages/id/common.json                    # C1, C2, C3, C4
└── messages/id/landing.json                   # C5 (baru)
```

---

## Catatan Tambahan

- Semua perubahan bersifat backward compatible — tidak ada breaking change
- Tidak ada perubahan skema database
- Tidak ada dependency baru
- TypeScript strict mode tetap terpenuhi
- Setiap item bisa di-rollback secara independen
