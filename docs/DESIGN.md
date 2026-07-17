# Cosmic Explorer — Design System

> Panduan lengkap untuk membangun UI/UX yang konsisten, accessible, dan menarik
> untuk aplikasi edukasi interaktif tentang tata surya dan alam semesta.

---

## 1. Overview

### Design Philosophy

Cosmic Explorer dirancang dengan filosofi:

1. **Educational First** — Setiap elemen UI mendukung pembelajaran
2. **Friendly & Approachable** — Tidak intimidating untuk siswa
3. **Interactive & Engaging** — Mendorong eksplorasi aktif
4. **Clean & Organized** — Informasi tersaji dengan jelas
5. **Inclusive** — Dapat diakses oleh semua pengguna

### Target Audience

| Segmen        | Usia        | Karakteristik                    |
| ------------- | ----------- | -------------------------------- |
| **Primary**   | 14-22 tahun | Siswa SMA & Mahasiswa            |
| **Secondary** | 22-35 tahun | Educator & Astronomy enthusiasts |
| **Tertiary**  | 10-14 tahun | Siswa SMP (dengan guidance)      |

### Tone & Voice

- **Bahasa:** Indonesia (formal-informal, santun)
- **Tone:** Friendly, encouraging, educational
- **Voice:** Aktif, langsung, engaging

#### Contoh Penulisan

| ❌ Hindari                         | ✅ Gunakan                                    |
| ---------------------------------- | --------------------------------------------- |
| "Planet Mars memiliki diameter..." | "Mars adalah planet keempat dari Matahari..." |
| "Error: Data not found"            | "Oops! Data tidak ditemukan"                  |
| "Submit"                           | "Kirim Jawaban"                               |
| "Loading..."                       | "Memuat data planet..."                       |

### Design Principles

#### 1. Hierarchy yang Jelas

- Heading besar untuk judul utama
- Subheading untuk section
- Body text untuk konten
- Spacing yang konsisten

#### 2. Visual Feedback

- Hover states pada semua interaktif elemen
- Loading states untuk async operations
- Success/error feedback yang jelas
- Progress indicators

#### 3. Consistency

- Warna konsisten di seluruh aplikasi
- Spacing menggunakan scale yang sama
- Typography konsisten
- Component patterns sama

#### 4. Simplicity

- Tidak lebih dari 3 warna utama per section
- White space yang cukup
- Tidak overcrowded
- Focus pada konten utama

---

## 2. Color System

### Primary Palette

Warna utama yang digunakan di seluruh aplikasi.

| Token                 | Hex     | RGB                | Kegunaan                |
| --------------------- | ------- | ------------------ | ----------------------- |
| `--color-primary-50`  | #EFF6FF | rgb(239, 246, 255) | Background sangat light |
| `--color-primary-100` | #DBEAFE | rgb(219, 234, 254) | Background light        |
| `--color-primary-200` | #BFDBFE | rgb(191, 219, 254) | Border light            |
| `--color-primary-300` | #93C5FD | rgb(147, 197, 253) | Accent light            |
| `--color-primary-400` | #60A5FA | rgb(96, 165, 250)  | Hover state             |
| `--color-primary-500` | #3B82F6 | rgb(59, 130, 246)  | **Primary action**      |
| `--color-primary-600` | #2563EB | rgb(37, 99, 235)   | Active state            |
| `--color-primary-700` | #1D4ED8 | rgb(29, 78, 216)   | Text on light bg        |

### Secondary Palette

| Token                 | Hex     | RGB                | Kegunaan             |
| --------------------- | ------- | ------------------ | -------------------- |
| `--color-purple-50`   | #FAF5FF | rgb(250, 245, 255) | Purple light bg      |
| `--color-purple-100`  | #F3E8FF | rgb(243, 232, 255) | Purple lighter       |
| `--color-purple-200`  | #E9D5FF | rgb(233, 213, 255) | Purple light         |
| `--color-purple-500`  | #8B5CF6 | rgb(139, 92, 246)  | **Secondary accent** |
| `--color-purple-600`  | #7C3AED | rgb(124, 58, 237)  | Secondary active     |
| `--color-cyan-50`     | #ECFEFF | rgb(236, 254, 255) | Cyan light bg        |
| `--color-cyan-500`    | #06B6D4 | rgb(6, 182, 212)   | **Space feel**       |
| `--color-cyan-600`    | #0891B2 | rgb(8, 145, 178)   | Cyan active          |
| `--color-orange-50`   | #FFF7ED | rgb(255, 247, 237) | Orange light bg      |
| `--color-orange-500`  | #F97316 | rgb(249, 115, 22)  | **Highlights, CTA**  |
| `--color-orange-600`  | #EA580C | rgb(234, 88, 12)   | Orange active        |
| `--color-emerald-50`  | #ECFDF5 | rgb(236, 253, 245) | Green light bg       |
| `--color-emerald-500` | #10B981 | rgb(16, 185, 129)  | **Success states**   |
| `--color-emerald-600` | #059669 | rgb(5, 150, 105)   | Success active       |
| `--color-rose-50`     | #FFF1F2 | rgb(255, 241, 242) | Red light bg         |
| `--color-rose-500`    | #F43F5E | rgb(244, 63, 94)   | **Error, alert**     |
| `--color-rose-600`    | #E11D48 | rgb(225, 29, 72)   | Error active         |

### Planet Colors

Setiap planet memiliki warna khas yang vibrant dan recognizable.

| Planet    | Token              | Hex     | RGB                | Keterangan          |
| --------- | ------------------ | ------- | ------------------ | ------------------- |
| Matahari  | `--planet-sun`     | #FBBF24 | rgb(251, 191, 36)  | Kuning terang, warm |
| Merkurius | `--planet-mercury` | #94A3B8 | rgb(148, 163, 184) | Abu-abu, neutral    |
| Venus     | `--planet-venus`   | #FB923C | rgb(251, 146, 60)  | Oranye, warm        |
| Bumi      | `--planet-earth`   | #3B82F6 | rgb(59, 130, 246)  | Biru, trust         |
| Mars      | `--planet-mars`    | #EF4444 | rgb(239, 68, 68)   | Merah, energetic    |
| Jupiter   | `--planet-jupiter` | #F59E0B | rgb(245, 158, 11)  | Kuning-amber, warm  |
| Saturnus  | `--planet-saturn`  | #D97706 | rgb(217, 119, 6)   | Emas, premium       |
| Uranus    | `--planet-uranus`  | #22D3EE | rgb(34, 211, 238)  | Cyan, cool          |
| Neptunus  | `--planet-neptune` | #6366F1 | rgb(99, 102, 241)  | Indigo, deep        |

### Semantic Colors

| Token                 | Hex     | Kegunaan                 |
| --------------------- | ------- | ------------------------ |
| `--color-success-50`  | #F0FDF4 | Background success light |
| `--color-success-500` | #10B981 | Berhasil, benar          |
| `--color-success-600` | #059669 | Success active           |
| `--color-warning-50`  | #FFFBEB | Background warning light |
| `--color-warning-500` | #F59E0B | Peringatan               |
| `--color-warning-600` | #D97706 | Warning active           |
| `--color-error-50`    | #FFF1F2 | Background error light   |
| `--color-error-500`   | #F43F5E | Error, salah             |
| `--color-error-600`   | #E11D48 | Error active             |
| `--color-info-50`     | #EFF6FF | Background info light    |
| `--color-info-500`    | #3B82F6 | Informasi                |
| `--color-info-600`    | #2563EB | Info active              |

### Background System

| Token              | Hex     | Kegunaan                        |
| ------------------ | ------- | ------------------------------- |
| `--bg-primary`     | #F8FAFC | Background utama (sangat light) |
| `--bg-secondary`   | #F1F5F9 | Section backgrounds             |
| `--bg-tertiary`    | #E2E8F0 | Subtle backgrounds              |
| `--bg-card`        | #FFFFFF | Card backgrounds                |
| `--bg-card-hover`  | #F8FAFC | Card hover state                |
| `--bg-card-active` | #F1F5F9 | Card active/selected state      |

### Text Colors

| Token              | Hex     | Kegunaan                   |
| ------------------ | ------- | -------------------------- |
| `--text-primary`   | #1E293B | Text utama (dark slate)    |
| `--text-secondary` | #64748B | Text secondary (muted)     |
| `--text-tertiary`  | #94A3B8 | Text tertiary (very muted) |
| `--text-inverse`   | #FFFFFF | Text on dark backgrounds   |
| `--text-accent`    | #3B82F6 | Link, accent text          |
| `--text-success`   | #059669 | Success text               |
| `--text-warning`   | #D97706 | Warning text               |
| `--text-error`     | #E11D48 | Error text                 |

### Border Colors

| Token              | Hex     | Kegunaan        |
| ------------------ | ------- | --------------- |
| `--border-default` | #E2E8F0 | Default borders |
| `--border-light`   | #F1F5F9 | Light borders   |
| `--border-hover`   | #CBD5E1 | Hover state     |
| `--border-focus`   | #3B82F6 | Focus state     |
| `--border-accent`  | #3B82F6 | Accent borders  |

### Color Usage Guidelines

#### ✅ Do

- Gunakan `--color-primary-500` (#3B82F6) untuk primary actions
- Gunakan `--bg-primary` (#F8FAFC) untuk background utama
- Pastikan text contrast ratio minimal 4.5:1
- Gunakan semantic colors untuk feedback (success, error, warning)
- Gunakan planet colors untuk representasi visual planet

#### ❌ Don't

- Jangan gunakan warna gelap untuk background utama
- Jangan campur terlalu banyak warna dalam satu section (maksimal 3)
- Jangan gunakan warna untuk menyampaikan informasi saja (perlu text/icons juga)
- Jangan gunakan warna yang terlalu terang/saturated untuk background

---

## 3. Typography

### Font Stack

| Role        | Font      | Google Fonts                                        | Fallback              |
| ----------- | --------- | --------------------------------------------------- | --------------------- |
| **Heading** | Poppins   | [Link](https://fonts.google.com/specimen/Poppins)   | system-ui, sans-serif |
| **Body**    | Open Sans | [Link](https://fonts.google.com/specimen/Open+Sans) | system-ui, sans-serif |
| **Code**    | Fira Code | [Link](https://fonts.google.com/specimen/Fira+Code) | monospace             |

### Import

```css
@import url("https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap");
```

### Heading Scale

| Level | Font    | Weight          | Size | Line Height | Letter Spacing | Kegunaan      |
| ----- | ------- | --------------- | ---- | ----------- | -------------- | ------------- |
| H1    | Poppins | Bold (700)      | 36px | 1.2         | -0.02em        | Page title    |
| H2    | Poppins | Semi-Bold (600) | 28px | 1.3         | -0.01em        | Section title |
| H3    | Poppins | Medium (500)    | 20px | 1.4         | 0              | Subsection    |
| H4    | Poppins | Medium (500)    | 18px | 1.4         | 0              | Card title    |
| H5    | Poppins | Medium (500)    | 16px | 1.5         | 0.01em         | Small heading |
| H6    | Poppins | Medium (500)    | 14px | 1.5         | 0.01em         | Tiny heading  |

### Body Text

| Level      | Font      | Weight        | Size | Line Height | Kegunaan          |
| ---------- | --------- | ------------- | ---- | ----------- | ----------------- |
| Body Large | Open Sans | Regular (400) | 18px | 1.6         | Long reading text |
| Body       | Open Sans | Regular (400) | 16px | 1.6         | Default body      |
| Body Small | Open Sans | Regular (400) | 14px | 1.5         | Captions, labels  |
| Caption    | Open Sans | Regular (400) | 12px | 1.4         | Very small text   |

### Font Weights

| Weight    | Value | Kegunaan                     |
| --------- | ----- | ---------------------------- |
| Light     | 300   | Rarely used, decorative only |
| Regular   | 400   | Body text, paragraphs        |
| Medium    | 500   | Labels, buttons, emphasis    |
| Semi-Bold | 600   | Headings, strong emphasis    |
| Bold      | 700   | Strong emphasis, H1, titles  |

### Contoh Penggunaan

```css
/* H1 - Page Title */
h1 {
  font-family: "Poppins", system-ui, sans-serif;
  font-weight: 700;
  font-size: 36px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}

/* H2 - Section Title */
h2 {
  font-family: "Poppins", system-ui, sans-serif;
  font-weight: 600;
  font-size: 28px;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--text-primary);
}

/* H3 - Subsection */
h3 {
  font-family: "Poppins", system-ui, sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 1.4;
  color: var(--text-primary);
}

/* Body - Default Text */
p {
  font-family: "Open Sans", system-ui, sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text-primary);
}

/* Label - Small Text */
.label {
  font-family: "Open Sans", system-ui, sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-secondary);
}

/* Code - Monospace */
code {
  font-family: "Fira Code", monospace;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  background: var(--bg-secondary);
  padding: 2px 6px;
  border-radius: 4px;
}
```

---

## 4. Spacing & Sizing

### Spacing Scale

Gunakan spacing scale yang konsisten untuk semua margin, padding, dan gap.

| Token         | Value    | Pixel |
| ------------- | -------- | ----- |
| `--space-0`   | 0        | 0px   |
| `--space-0.5` | 0.125rem | 2px   |
| `--space-1`   | 0.25rem  | 4px   |
| `--space-1.5` | 0.375rem | 6px   |
| `--space-2`   | 0.5rem   | 8px   |
| `--space-2.5` | 0.625rem | 10px  |
| `--space-3`   | 0.75rem  | 12px  |
| `--space-3.5` | 0.875rem | 14px  |
| `--space-4`   | 1rem     | 16px  |
| `--space-5`   | 1.25rem  | 20px  |
| `--space-6`   | 1.5rem   | 24px  |
| `--space-7`   | 1.75rem  | 28px  |
| `--space-8`   | 2rem     | 32px  |
| `--space-9`   | 2.25rem  | 36px  |
| `--space-10`  | 2.5rem   | 40px  |
| `--space-11`  | 2.75rem  | 44px  |
| `--space-12`  | 3rem     | 48px  |
| `--space-14`  | 3.5rem   | 56px  |
| `--space-16`  | 4rem     | 64px  |
| `--space-20`  | 5rem     | 80px  |
| `--space-24`  | 6rem     | 96px  |
| `--space-28`  | 7rem     | 112px |
| `--space-32`  | 8rem     | 128px |

### Contoh Penggunaan

```css
/* Card padding */
.card {
  padding: var(--space-6); /* 24px */
}

/* Section gap */
.section {
  gap: var(--space-8); /* 32px */
}

/* Button padding */
.button-sm {
  padding: var(--space-2) var(--space-3); /* 8px 12px */
}
.button-md {
  padding: var(--space-2.5) var(--space-5); /* 10px 20px */
}
.button-lg {
  padding: var(--space-3) var(--space-6); /* 12px 24px */
}

/* Modal padding */
.modal {
  padding: var(--space-8); /* 32px */
}
```

### Border Radius

| Token           | Value  | Kegunaan                     |
| --------------- | ------ | ---------------------------- |
| `--radius-none` | 0      | Tanpa radius                 |
| `--radius-sm`   | 4px    | Small elements (badges)      |
| `--radius-md`   | 8px    | Medium elements (inputs)     |
| `--radius-lg`   | 12px   | Large elements (cards small) |
| `--radius-xl`   | 16px   | Extra large (cards)          |
| `--radius-2xl`  | 20px   | Extra large (modals, panels) |
| `--radius-3xl`  | 24px   | Jumbo (hero cards)           |
| `--radius-full` | 9999px | Pill shape, circular         |

### Contoh Penggunaan

```css
/* Badge */
.badge {
  border-radius: var(--radius-full); /* Pill shape */
}

/* Input */
.input {
  border-radius: var(--radius-md); /* 8px */
}

/* Card */
.card {
  border-radius: var(--radius-xl); /* 16px */
}

/* Large card */
.card-lg {
  border-radius: var(--radius-2xl); /* 20px */
}

/* Modal */
.modal {
  border-radius: var(--radius-3xl); /* 24px */
}

/* Avatar */
.avatar {
  border-radius: var(--radius-full); /* Circular */
}
```

### Component Sizing

| Component  | Size | Width | Height |
| ---------- | ---- | ----- | ------ |
| **Button** | sm   | auto  | 32px   |
| **Button** | md   | auto  | 40px   |
| **Button** | lg   | auto  | 48px   |
| **Input**  | sm   | 100%  | 32px   |
| **Input**  | md   | 100%  | 40px   |
| **Input**  | lg   | 100%  | 48px   |
| **Avatar** | xs   | 24px  | 24px   |
| **Avatar** | sm   | 32px  | 32px   |
| **Avatar** | md   | 40px  | 40px   |
| **Avatar** | lg   | 48px  | 48px   |
| **Avatar** | xl   | 64px  | 64px   |
| **Icon**   | sm   | 16px  | 16px   |
| **Icon**   | md   | 20px  | 20px   |
| **Icon**   | lg   | 24px  | 24px   |
| **Icon**   | xl   | 32px  | 32px   |

---

## 5. Shadows & Elevation

### Shadow System

Shadows yang soft dan subtle untuk memberikan depth tanpa heaviness.

| Token          | Value                                                                   | Kegunaan            |
| -------------- | ----------------------------------------------------------------------- | ------------------- |
| `--shadow-xs`  | 0 1px 2px 0 rgba(0, 0, 0, 0.05)                                         | Minimal shadow      |
| `--shadow-sm`  | 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)       | Small elements      |
| `--shadow-md`  | 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)    | **Default cards**   |
| `--shadow-lg`  | 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)  | Hover states        |
| `--shadow-xl`  | 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) | Modals, popovers    |
| `--shadow-2xl` | 0 25px 50px -12px rgba(0, 0, 0, 0.25)                                   | Very large elements |

### Colored Shadows (Optional)

| Token              | Value                                | Kegunaan             |
| ------------------ | ------------------------------------ | -------------------- |
| `--shadow-primary` | 0 4px 14px 0 rgba(59, 130, 246, 0.3) | Primary button hover |
| `--shadow-success` | 0 4px 14px 0 rgba(16, 185, 129, 0.3) | Success states       |
| `--shadow-error`   | 0 4px 14px 0 rgba(244, 63, 94, 0.3)  | Error states         |

### Elevation Levels

| Level | Shadow        | Kegunaan             |
| ----- | ------------- | -------------------- |
| **0** | none          | Background elements  |
| **1** | `--shadow-xs` | Subtle lift          |
| **2** | `--shadow-sm` | Default cards        |
| **3** | `--shadow-md` | Hover states         |
| **4** | `--shadow-lg` | Modals, dropdowns    |
| **5** | `--shadow-xl` | Very raised elements |

### Contoh Penggunaan

```css
/* Default card */
.card {
  box-shadow: var(--shadow-md);
}

/* Card hover */
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Button with primary shadow */
.button-primary {
  box-shadow: var(--shadow-sm);
}
.button-primary:hover {
  box-shadow: var(--shadow-primary);
}

/* Modal */
.modal {
  box-shadow: var(--shadow-xl);
}

/* Dropdown */
.dropdown {
  box-shadow: var(--shadow-lg);
}
```

---

## 6. Iconography

### Icon Library

**Lucide Icons** — Simple, clean, line-based icons

**Install:** `npm install lucide-react`

### Import

```jsx
import { Home, Search, Menu, X, ChevronRight } from "lucide-react";
```

### Icon Sizes

| Size | Pixel | Kegunaan              |
| ---- | ----- | --------------------- |
| `xs` | 16px  | Inline text, badges   |
| `sm` | 20px  | Small buttons, labels |
| `md` | 24px  | Default icons         |
| `lg` | 32px  | Featured icons        |
| `xl` | 48px  | Hero icons            |

### Contoh Penggunaan

```jsx
// Small icon in button
<Button>
  <Search size={16} />
  Search
</Button>

// Medium icon (default)
<Search size={24} />

// Large icon (featured)
<Search size={32} />
```

### Icon Guidelines

#### ✅ Do

- Gunakan konsisten satu icon library (Lucide)
- Size yang konsisten dalam context yang sama
- Pair icon dengan text jika membingungkan
- Berikan alt text untuk accessibility

#### ❌ Don't

- Jangan gunakan terlalu banyak icon berbeda
- Jangan gunakan icon tanpa context
- Jangan gunakan icon yang terlalu kecil (min 16px)
- Jangan gunakan emoji sebagai icon

---

## 7. Component Library

### Buttons

#### Variants

| Variant       | Background  | Text    | Border            | Kegunaan            |
| ------------- | ----------- | ------- | ----------------- | ------------------- |
| **Primary**   | #3B82F6     | #FFFFFF | none              | Primary actions     |
| **Secondary** | #FFFFFF     | #3B82F6 | 1px solid #3B82F6 | Secondary actions   |
| **Ghost**     | transparent | #3B82F6 | none              | Tertiary actions    |
| **Danger**    | #F43F5E     | #FFFFFF | none              | Destructive actions |

#### Sizes

| Size   | Height | Padding   | Font Size |
| ------ | ------ | --------- | --------- |
| **sm** | 32px   | 8px 12px  | 14px      |
| **md** | 40px   | 10px 20px | 14px      |
| **lg** | 48px   | 12px 24px | 16px      |

#### States

| State        | Change                   |
| ------------ | ------------------------ |
| **Default**  | Base style               |
| **Hover**    | Darker bg, shadow        |
| **Active**   | Even darker bg           |
| **Focus**    | Focus ring (2px outline) |
| **Disabled** | 50% opacity, no pointer  |
| **Loading**  | Spinner icon             |

#### Contoh

```css
/* Button Primary */
.button-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--color-primary-500);
  color: white;
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 14px;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 150ms ease;
}
.button-primary:hover {
  background: var(--color-primary-600);
  box-shadow: var(--shadow-primary);
}
.button-primary:active {
  background: var(--color-primary-700);
}
.button-primary:focus {
  outline: 2px solid var(--color-primary-300);
  outline-offset: 2px;
}

/* Button Secondary */
.button-secondary {
  background: white;
  color: var(--color-primary-500);
  border: 1px solid var(--color-primary-500);
}
```

---

### Cards

#### Basic Card

```css
.card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  transition: all 200ms ease;
}
.card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}
```

#### Card Sizes

| Size   | Padding | Border Radius | Kegunaan            |
| ------ | ------- | ------------- | ------------------- |
| **sm** | 16px    | 12px          | Small cards, badges |
| **md** | 24px    | 16px          | Default cards       |
| **lg** | 32px    | 20px          | Large cards         |
| **xl** | 40px    | 24px          | Hero cards          |

#### Planet Card

```css
.planet-card {
  background: white;
  border-radius: var(--radius-2xl);
  border: 1px solid var(--border-default);
  box-shadow: var(--shadow-md);
  padding: var(--space-6);
  overflow: hidden;
  transition: all 200ms ease;
}
.planet-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}
.planet-card-image {
  width: 100%;
  height: 120px;
  object-fit: contain;
  margin-bottom: var(--space-4);
}
.planet-card-name {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 20px;
  color: var(--text-primary);
  margin-bottom: var(--space-2);
}
.planet-card-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}
.planet-card-stat {
  font-size: 14px;
  color: var(--text-secondary);
}
```

---

### Inputs

#### Basic Input

```css
.input {
  width: 100%;
  padding: 10px 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-default);
  border-radius: var(--radius-md);
  font-family: "Open Sans", sans-serif;
  font-size: 14px;
  color: var(--text-primary);
  transition: all 150ms ease;
}
.input:hover {
  border-color: var(--border-hover);
}
.input:focus {
  outline: none;
  border-color: var(--border-focus);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.input::placeholder {
  color: var(--text-tertiary);
}
```

#### Input Sizes

| Size   | Height | Padding   | Font Size |
| ------ | ------ | --------- | --------- |
| **sm** | 32px   | 8px 12px  | 12px      |
| **md** | 40px   | 10px 16px | 14px      |
| **lg** | 48px   | 12px 20px | 16px      |

---

### Navigation

#### Top Navigation Bar

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-6);
  height: 64px;
  background: white;
  border-bottom: 1px solid var(--border-default);
  position: sticky;
  top: 0;
  z-index: 100;
}
.navbar-logo {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 18px;
  color: var(--text-primary);
}
.navbar-links {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}
.navbar-link {
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 14px;
  color: var(--text-secondary);
  text-decoration: none;
  transition: color 150ms ease;
}
.navbar-link:hover,
.navbar-link.active {
  color: var(--color-primary-500);
}
.navbar-link.active {
  position: relative;
}
.navbar-link.active::after {
  content: "";
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary-500);
}
.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
```

---

### Badges

```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-full);
}

/* Variants */
.badge-primary {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}
.badge-success {
  background: var(--color-success-50);
  color: var(--color-success-600);
}
.badge-warning {
  background: var(--color-warning-50);
  color: var(--color-warning-600);
}
.badge-error {
  background: var(--color-error-50);
  color: var(--color-error-600);
}
.badge-info {
  background: var(--color-info-50);
  color: var(--color-info-600);
}

/* Planet badge */
.badge-planet {
  background: var(--planet-color-light);
  color: var(--planet-color-dark);
}
```

---

### Progress Bars

```css
.progress {
  width: 100%;
  height: 8px;
  background: var(--bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: linear-gradient(
    90deg,
    var(--color-primary-400),
    var(--color-primary-500)
  );
  border-radius: var(--radius-full);
  transition: width 300ms ease;
}

/* Variants */
.progress-bar-success {
  background: linear-gradient(
    90deg,
    var(--color-success-500),
    var(--color-success-600)
  );
}
.progress-bar-warning {
  background: linear-gradient(
    90deg,
    var(--color-warning-500),
    var(--color-warning-600)
  );
}
.progress-bar-error {
  background: linear-gradient(
    90deg,
    var(--color-error-500),
    var(--color-error-600)
  );
}
```

---

### Tooltips

```css
.tooltip {
  position: relative;
}
.tooltip-content {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  padding: 8px 12px;
  background: var(--text-primary);
  color: white;
  font-size: 12px;
  font-weight: 500;
  border-radius: var(--radius-md);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
  z-index: 1000;
}
.tooltip-content::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-top-color: var(--text-primary);
}
.tooltip:hover .tooltip-content {
  opacity: 1;
}
```

---

## 8. Layout System

### Grid System

```css
/* Container */
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Grid */
.grid {
  display: grid;
  gap: var(--space-6);
}

/* Bento Grid */
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(180px, auto);
  gap: var(--space-6);
}

/* Bento Items */
.bento-item-1x1 {
  grid-column: span 1;
  grid-row: span 1;
}
.bento-item-2x1 {
  grid-column: span 2;
  grid-row: span 1;
}
.bento-item-1x2 {
  grid-column: span 1;
  grid-row: span 2;
}
.bento-item-2x2 {
  grid-column: span 2;
  grid-row: span 2;
}
.bento-item-3x1 {
  grid-column: span 3;
  grid-row: span 1;
}
.bento-item-4x1 {
  grid-column: span 4;
  grid-row: span 1;
}
```

### Breakpoints

| Token      | Min Width | Kegunaan                    |
| ---------- | --------- | --------------------------- |
| `--bp-sm`  | 640px     | Small tablets, large phones |
| `--bp-md`  | 768px     | Tablets                     |
| `--bp-lg`  | 1024px    | Small laptops               |
| `--bp-xl`  | 1280px    | Laptops, desktops           |
| `--bp-2xl` | 1536px    | Large screens               |

### Responsive Grid

```css
/* Responsive grid */
.grid-responsive {
  display: grid;
  gap: var(--space-6);
}

@media (min-width: 640px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Container Sizes

| Breakpoint | Max Width | Padding |
| ---------- | --------- | ------- |
| Mobile     | 100%      | 16px    |
| Tablet     | 100%      | 24px    |
| Desktop    | 1280px    | 24px    |
| Large      | 1536px    | 32px    |

---

## 9. UI Patterns

### Planet Info Panel

```css
.planet-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
  background: white;
  border-left: 1px solid var(--border-default);
  box-shadow: var(--shadow-xl);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  animation: slideIn 300ms ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.planet-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6);
  border-bottom: 1px solid var(--border-default);
}

.planet-panel-title {
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: var(--text-primary);
}

.planet-panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: background 150ms ease;
}
.planet-panel-close:hover {
  background: var(--bg-secondary);
}

.planet-panel-content {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-6);
}

.planet-panel-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: var(--space-6);
}

.planet-panel-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.planet-panel-stat {
  padding: var(--space-4);
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
}

.planet-panel-stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: var(--space-1);
}

.planet-panel-stat-value {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 16px;
  color: var(--text-primary);
}
```

---

### Quiz Interface

```css
.quiz-container {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--space-8);
}

.quiz-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-8);
}

.quiz-category {
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: var(--color-primary-500);
}

.quiz-progress {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.quiz-progress-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.quiz-question {
  font-family: "Poppins", sans-serif;
  font-weight: 500;
  font-size: 24px;
  color: var(--text-primary);
  margin-bottom: var(--space-8);
}

.quiz-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
}

.quiz-option {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-6);
  background: white;
  border: 2px solid var(--border-default);
  border-radius: var(--radius-xl);
  cursor: pointer;
  transition: all 200ms ease;
}
.quiz-option:hover {
  border-color: var(--color-primary-300);
  background: var(--color-primary-50);
}
.quiz-option.selected {
  border-color: var(--color-primary-500);
  background: var(--color-primary-50);
}
.quiz-option.correct {
  border-color: var(--color-success-500);
  background: var(--color-success-50);
}
.quiz-option.wrong {
  border-color: var(--color-error-500);
  background: var(--color-error-50);
}

.quiz-option-letter {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--bg-secondary);
  border-radius: var(--radius-full);
  font-family: "Poppins", sans-serif;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-secondary);
  flex-shrink: 0;
}
.quiz-option.selected .quiz-option-letter {
  background: var(--color-primary-500);
  color: white;
}

.quiz-option-text {
  font-size: 16px;
  color: var(--text-primary);
  line-height: 1.5;
}
```

---

### Search Interface

```css
.search-container {
  position: relative;
  max-width: 600px;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  background: white;
  border: 2px solid var(--border-default);
  border-radius: var(--radius-xl);
  font-size: 16px;
  color: var(--text-primary);
  transition: all 200ms ease;
}
.search-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-tertiary);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-2);
  background: white;
  border: 1px solid var(--border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  cursor: pointer;
  transition: background 150ms ease;
}
.search-result-item:hover {
  background: var(--bg-secondary);
}
.search-result-item + .search-result-item {
  border-top: 1px solid var(--border-default);
}
```

---

## 10. Responsive Design

### Mobile Strategy

- **Mobile-first** — Design dari mobile, scale ke desktop
- **Touch-friendly** — Target minimum 44px
- **Simplified layout** — Kurangi kompleksitas di mobile
- **Bottom navigation** — untuk mobile
- **Swipe gestures** — Untuk navigasi

### Touch Targets

| Element     | Minimum Size | Recommended |
| ----------- | ------------ | ----------- |
| Button      | 44px × 44px  | 48px × 48px |
| Link        | 44px × 44px  | 48px × 24px |
| Input       | 44px height  | 48px height |
| Icon button | 44px × 44px  | 48px × 48px |

### Responsive Utilities

```css
/* Hide on mobile */
@media (max-width: 767px) {
  .hide-mobile {
    display: none !important;
  }
}

/* Show on mobile only */
@media (min-width: 768px) {
  .show-mobile {
    display: none !important;
  }
}

/* Hide on desktop */
@media (min-width: 1024px) {
  .hide-desktop {
    display: none !important;
  }
}

/* Show on desktop only */
@media (max-width: 1023px) {
  .show-desktop {
    display: none !important;
  }
}
```

### Responsive Typography

```css
/* Fluid typography */
h1 {
  font-size: clamp(24px, 5vw, 36px);
}
h2 {
  font-size: clamp(20px, 4vw, 28px);
}
h3 {
  font-size: clamp(18px, 3vw, 20px);
}
```

---

## 11. Accessibility

### WCAG Compliance

- **Level:** AA minimum
- **Contrast Ratio:** 4.5:1 for normal text, 3:1 for large text
- **Focus States:** Visible on all interactive elements
- **Keyboard Navigation:** Full support
- **Screen Reader:** ARIA labels required

### Color Contrast

| Element          | Foreground | Background | Ratio  | Status |
| ---------------- | ---------- | ---------- | ------ | ------ |
| Body text        | #1E293B    | #F8FAFC    | 14.5:1 | ✅ AAA |
| Secondary text   | #64748B    | #F8FAFC    | 5.1:1  | ✅ AA  |
| Primary button   | #FFFFFF    | #3B82F6    | 4.6:1  | ✅ AA  |
| Secondary button | #3B82F6    | #FFFFFF    | 4.6:1  | ✅ AA  |

### Focus States

```css
/* Focus visible */
:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

/* Focus within */
:focus-within {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Skip link */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: var(--color-primary-500);
  color: white;
  z-index: 10000;
  transition: top 150ms ease;
}
.skip-link:focus {
  top: 0;
}
```

### ARIA Labels

```html
<!-- Button with icon -->
<button aria-label="Close modal">
  <X size={24} />
</button>

<!-- Navigation -->
<nav aria-label="Main navigation">
  <ul>...</ul>
</nav>

<!-- Progress -->
<div role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100}>
  <div style={{ width: '75%' }}></div>
</div>
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 12. Animation & Motion

### Timing Functions

| Token           | Value                        | Kegunaan          |
| --------------- | ---------------------------- | ----------------- |
| `--ease-in`     | cubic-bezier(0.4, 0, 1, 1)   | Exiting elements  |
| `--ease-out`    | cubic-bezier(0, 0, 0.2, 1)   | Entering elements |
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | State changes     |

### Duration Scale

| Token               | Value | Kegunaan            |
| ------------------- | ----- | ------------------- |
| `--duration-fast`   | 100ms | Micro-interactions  |
| `--duration-normal` | 200ms | Default transitions |
| `--duration-slow`   | 300ms | Complex animations  |
| `--duration-slower` | 500ms | Page transitions    |

### Transition Patterns

```css
/* Button transition */
.button {
  transition: all var(--duration-normal) var(--ease-in-out);
}

/* Card hover */
.card {
  transition:
    transform var(--duration-normal) var(--ease-out),
    box-shadow var(--duration-normal) var(--ease-out);
}

/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

/* Slide in from right */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.slide-in-right {
  animation: slideInRight var(--duration-slow) var(--ease-out);
}

/* Slide in from bottom */
@keyframes slideInUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.slide-in-up {
  animation: slideInUp var(--duration-slow) var(--ease-out);
}
```

### Micro-interactions

```css
/* Button press */
.button:active {
  transform: scale(0.98);
}

/* Card hover lift */
.card:hover {
  transform: translateY(-4px);
}

/* Icon rotation on hover */
.icon-rotate:hover {
  transform: rotate(45deg);
  transition: transform var(--duration-normal) var(--ease-out);
}

/* Progress bar fill */
.progress-bar {
  transition: width var(--duration-slower) var(--ease-out);
}
```

---

## 13. Dark Mode (Optional)

> **Catatan:** Dark mode opsional untuk Cosmic Explorer. Jika diimplementasikan, gunakan color overrides berikut.

### Color Overrides

```css
/* Dark mode variables */
:root[data-theme="dark"] {
  /* Background */
  --bg-primary: #0f172a;
  --bg-secondary: #1e293b;
  --bg-tertiary: #334155;
  --bg-card: #1e293b;
  --bg-card-hover: #334155;

  /* Text */
  --text-primary: #f1f5f9;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --text-inverse: #1e293b;

  /* Borders */
  --border-default: #334155;
  --border-hover: #475569;

  /* Shadows */
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
}
```

---

## 14. References

### Design Tokens (CSS Variables)

```css
:root {
  /* Colors - Primary */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;

  /* Colors - Secondary */
  --color-purple-500: #8b5cf6;
  --color-cyan-500: #06b6d4;
  --color-orange-500: #f97316;
  --color-emerald-500: #10b981;
  --color-rose-500: #f43f5e;

  /* Background */
  --bg-primary: #f8fafc;
  --bg-secondary: #f1f5f9;
  --bg-tertiary: #e2e8f0;
  --bg-card: #ffffff;

  /* Text */
  --text-primary: #1e293b;
  --text-secondary: #64748b;
  --text-tertiary: #94a3b8;

  /* Border */
  --border-default: #e2e8f0;
  --border-hover: #cbd5e1;
  --border-focus: #3b82f6;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --radius-2xl: 20px;
  --radius-3xl: 24px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}
```

### Tailwind Config

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BFDBFE",
          300: "#93C5FD",
          400: "#60A5FA",
          500: "#3B82F6",
          600: "#2563EB",
          700: "#1D4ED8",
        },
        cosmic: {
          black: "#0F172A",
          deep: "#1E293B",
          nebula: "#334155",
        },
        planet: {
          sun: "#FBBF24",
          mercury: "#94A3B8",
          venus: "#FB923C",
          earth: "#3B82F6",
          mars: "#EF4444",
          jupiter: "#F59E0B",
          saturn: "#D97706",
          uranus: "#22D3EE",
          neptune: "#6366F1",
        },
      },
      fontFamily: {
        heading: ["Poppins", "system-ui", "sans-serif"],
        body: ["Open Sans", "system-ui", "sans-serif"],
        mono: ["Fira Code", "monospace"],
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "24px",
      },
      boxShadow: {
        sm: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      },
    },
  },
};
```

---

## Changelog

| Version | Date       | Changes               |
| ------- | ---------- | --------------------- |
| 1.0.0   | 2026-07-01 | Initial design system |

---

> **Maintainer:** Cosmic Explorer Team
> **Last Updated:** 2026-07-01
