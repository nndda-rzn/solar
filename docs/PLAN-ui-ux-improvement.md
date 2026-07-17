# Plan: UI/UX Improvement — Timeless, Non-AI Design

**Date:** 2026-07-17
**Goal:** Eliminate "AI-generated" look. Replace generic patterns with timeless, editorial, scientific visual language.
**Principle:** Dark mode scientific tool, not flashy startup landing page. NASA meets Linear. Less is more.

---

## Design System Reference

Curated from ui-ux-pro-max audit + manual refinement:

| Token         | Old                                             | New                                                                                 |
| ------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------- |
| Primary BG    | `#080b14` / `#0d1117`                           | Keep `#090d14` / `#0f1419` (subtle shift)                                           |
| Accent        | `#4a9eff` only                                  | `#4a9eff` (primary) + `#f59e0b` (warm accent for CTA) + `#94a3b8` (muted secondary) |
| Text          | `white/50`, `white/70`, `white/80`              | `white/60`, `white/75`, `white/90` (more legible)                                   |
| Heading font  | Playfair Display everywhere                     | Playfair for h1 only. Inter for h2-h6                                               |
| Body font     | Inter                                           | Inter                                                                               |
| Spacing scale | `py-28`, `mb-16`, `p-8`                         | `py-16`, `mb-8`, `p-6`                                                              |
| Border radius | `rounded-2xl`                                   | `rounded-xl`                                                                        |
| Backdrop blur | `backdrop-blur-sm` + `backdrop-blur-md` stacked | `backdrop-blur-md` only on modals, remove from cards                                |
| Shadow        | `shadow-[0_0_40px_...]` glow                    | Standard elevation: `shadow-lg`, `shadow-xl`                                        |

---

## Phase 1: Remove AI Tropes

### 1a. Hero eyebrow badge + pulse dot

**File:** `src/components/landing/HeroSection.tsx:49-61`
**Problem:** `<motion.div>` badge with `animate-pulse` dot, uppercase tracking-widest, "Interactive 3D Universe" — classic AI landing trope.
**Action:** Remove entire badge block.

### 1b. Scroll indicator

**File:** `src/components/landing/HeroSection.tsx:117-133`
**Problem:** Bouncing chevron + "Scroll to discover" text — users know how to scroll.
**Action:** Remove entire scroll indicator block.

### 1c. Feature card hover accent line

**File:** `src/components/landing/FeaturesSection.tsx:72-75`
**Problem:** `scale-x-0 → scale-x-100` bottom gradient line on hover — pure decoration.
**Action:** Remove hover accent line div.

### 1d. HowItWorks center node pulse

**File:** `src/components/landing/HowItWorksSection.tsx:90-95`
**Problem:** Glowing node with `shadow-[0_0_20px_rgba(74,158,255,0.2)]` — overdesigned.
**Action:** Simplify shadow to `shadow-[0_0_10px_rgba(74,158,255,0.15)]`.

---

## Phase 2: Simplify Effects

### 2a. Hero radial nebula glow

**File:** `src/components/landing/HeroSection.tsx:37-44`
**Problem:** `radial-gradient(ellipse 80% 60% at 50% 60%, rgba(74,158,255,0.08)...)` — too prominent.
**Action:** Reduce opacity: `0.08 → 0.04`, `70% → 80%`.

### 2b. Stats section radial background

**File:** `src/components/landing/StatsSection.tsx:77-79`
**Problem:** `radial-gradient(ellipse 120% 80%...)` — overkill.
**Action:** Reduce opacity: `0.05 → 0.03`.

### 2c. Feature card hover shadow

**File:** `src/components/landing/FeaturesSection.tsx:59`
**Problem:** `hover:shadow-[0_0_40px_rgba(74,158,255,0.06)]` — over-specific glow.
**Action:** Remove entirely.

### 2d. Section separator gradients

**Files:** `FeaturesSection.tsx:25-27`, `StatsSection.tsx:81-83`, `HowItWorksSection.tsx:27-29`
**Problem:** `bg-gradient-to-r from-transparent via-[#4a9eff]/20 to-transparent` — repeated AI pattern.
**Action:** Replace with `border-t border-white/[0.06]`.

### 2e. Sidebar brand glow

**File:** `src/components/layout/Sidebar.tsx:53`
**Problem:** `bg-gradient-to-br from-cosmic-accent/30 to-cosmic-glow/20 ring-1 ring-cosmic-accent/40` — overdesigned icon container.
**Action:** Simplify: `bg-cosmic-accent/15` no gradient, `ring-1 ring-cosmic-accent/20`.

### 2f. Modal backdrop

**File:** `src/components/ui/ModalBase.tsx:62`
**Problem:** `bg-black/60 backdrop-blur-sm` — too dark + blur = muddy.
**Action:** `bg-black/50 backdrop-blur-md` — one blur layer, less opacity.

### 2g. Modal content

**File:** `src/components/ui/ModalBase.tsx:73`
**Problem:** `backdrop-blur-md` on modal content itself — double blur.
**Action:** Remove `backdrop-blur-md` from modal content. Keep only on backdrop.

---

## Phase 3: Tone Down Animation

### 3a. Feature card stagger

**File:** `src/components/landing/FeaturesSection.tsx:57-58`
**Problem:** `delay: i * 0.12` stagger — feels AI because it's the default framer-motion tutorial pattern.
**Action:** Remove stagger: `delay: 0`.

### 3b. HowItWorks step stagger

**File:** `src/components/landing/HowItWorksSection.tsx:174`
**Problem:** `delay: i * 0.15` stagger.
**Action:** Remove stagger: `delay: 0`.

### 3c. Stats counter stagger

**File:** `src/components/landing/StatsSection.tsx:45,91`
**Problem:** `delay` prop with `i * 0.1` stagger.
**Action:** Remove delay parameter, set to `0`.

### 3d. Hero CTA glow hover

**File:** `src/components/landing/HeroSection.tsx:99`
**Problem:** `shadow-[0_0_30px_rgba(74,158,255,0.3)]` + hover `shadow-[0_0_40px_rgba(74,158,255,0.5)]`.
**Action:** Remove glow shadow. Use `shadow-lg` hover `shadow-xl`.

---

## Phase 4: Color Palette Expansion

### 4a. globals.css — add secondary + warm accent tokens

**File:** `src/app/globals.css`
**Action:** Add:

```css
--color-cosmic-muted: #94a3b8;
--color-cosmic-warm: #f59e0b;
```

### 4b. Hero CTA — use warm accent

**File:** `src/components/landing/HeroSection.tsx:99`
**Action:** Change `bg-[#4a9eff]` → `bg-cosmic-warm`, `hover:bg-[#7cb9ff]` → `hover:bg-amber-400`.

### 4c. Feature card icon — reduce accent dominance

**File:** `src/components/landing/FeaturesSection.tsx:62`
**Problem:** Icon container uses `bg-[#4a9eff]/10 text-[#4a9eff] border-[#4a9eff]/20`.
**Action:** Use `text-cosmic-muted` for icons, `bg-white/5` container.

### 4d. Section headings — use muted secondary

**File:** `src/components/landing/FeaturesSection.tsx:39`, `HowItWorksSection.tsx:147`, `StatsSection`
**Action:** Change `font-playfair text-white` → `font-sans font-semibold text-white/90` (Inter instead of Playfair).

---

## Phase 5: Spacing Scale

### 5a. Section padding

**Files:** `HeroSection`, `FeaturesSection`, `HowItWorksSection`, `StatsSection`, `CtaSection`
**Problem:** `py-28` everywhere — too much vertical space.
**Action:** Reduce to `py-16` (desktop), `py-12` (mobile).

### 5b. Feature card padding

**File:** `src/components/landing/FeaturesSection.tsx:59`
**Problem:** `p-8` — too generous.
**Action:** `p-6`.

### 5c. Header margin

**Files:** `FeaturesSection.tsx:35`, `HowItWorksSection.tsx:149`
**Problem:** `mb-16` / `mb-20` — excessive.
**Action:** `mb-8` / `mb-10`.

### 5d. Hero CTA margin

**File:** `src/components/landing/HeroSection.tsx:95`
**Problem:** `mt-10` — too much gap between subheadline and CTAs.
**Action:** `mt-6`.

---

## Phase 6: Typography Hierarchy

### 6a. Feature cards — Playfair → Inter

**File:** `src/components/landing/FeaturesSection.tsx:66`
**Problem:** `font-playfair text-xl font-semibold` for card headings.
**Action:** `font-sans text-lg font-semibold text-white/90`.

### 6b. HowItWorks step titles — Playfair → Inter

**File:** `src/components/landing/HowItWorksSection.tsx:197`
**Problem:** `font-playfair text-2xl font-semibold`.
**Action:** `font-sans text-xl font-semibold text-white/90`.

### 6c. Stats numbers — Playfair → Inter

**File:** `src/components/landing/StatsSection.tsx:48`
**Problem:** `font-playfair text-5xl font-bold`.
**Action:** `font-sans text-5xl font-bold` — tabular-nums already good, keep that.

### 6d. Section titles — Playfair → Inter

**Files:** `FeaturesSection.tsx:39`, `HowItWorksSection.tsx:147`
**Problem:** `font-playfair text-4xl font-bold sm:text-5xl`.
**Action:** `font-sans text-3xl font-semibold sm:text-4xl text-white/90`.

### 6e. Hero headline — keep Playfair

**File:** `src/components/landing/HeroSection.tsx:69`
**Action:** No change — h1 keeps Playfair. This is the only Playfair usage.

---

## Phase 7: Responsive Sidebar

### 7a. AppShell — responsive layout

**File:** `src/components/layout/AppShell.tsx:16`
**Problem:** `ml-60` fixed margin — no mobile support.
**Action:** Add `lg:ml-60` responsive breakpoint. Mobile: sidebar hidden (toggle button in TopBar). Tablet+: visible.

### 7b. Sidebar — hide on mobile

**File:** `src/components/layout/Sidebar.tsx:48`
**Action:** Add `hidden lg:flex` to sidebar. Keep fixed positioning.

### 7c. TopBar — add hamburger on mobile

**File:** `src/components/layout/TopBar.tsx`
**Action:** Add hamburger button (visible `< lg`) that toggles sidebar visibility.

---

## Phase 8: Modal Cleanup

### 8a. CloseButton aria label

**File:** `src/components/ui/ModalBase.tsx:75`
**Problem:** `ariaLabel="Close"` hardcoded English.
**Action:** Use i18n key or pass as prop.

### 8b. Remove duplicate modal

**File:** `src/components/ui/SettingsModal.tsx`
**Status:** Already cleaned up in previous fix — uses `<SettingsForm />`.

---

## Files Affected Summary

```
src/components/landing/HeroSection.tsx          (1a, 1b, 2a, 3d, 4b, 6e)
src/components/landing/FeaturesSection.tsx      (1c, 2c, 2d, 3a, 4c, 4d, 5b, 5c, 6a, 6d)
src/components/landing/HowItWorksSection.tsx    (1d, 2d, 3b, 6b, 6d)
src/components/landing/StatsSection.tsx         (2b, 2d, 3c, 6c)
src/components/layout/AppShell.tsx              (7a)
src/components/layout/Sidebar.tsx               (2e, 7b)
src/components/layout/TopBar.tsx                (7c)
src/components/ui/ModalBase.tsx                 (2f, 2g, 8a)
src/app/globals.css                             (4a)
```

---

## Execution Order

| Phase | Items                       | Effort | Risk   |
| ----- | --------------------------- | ------ | ------ |
| 1     | 1a-1d: Remove AI tropes     | 10 min | Low    |
| 2     | 2a-2g: Simplify effects     | 15 min | Low    |
| 3     | 3a-3d: Tone down animation  | 10 min | Low    |
| 4     | 4a-4d: Color palette        | 15 min | Medium |
| 5     | 5a-5d: Spacing scale        | 10 min | Low    |
| 6     | 6a-6e: Typography hierarchy | 10 min | Low    |
| 7     | 7a-7c: Responsive sidebar   | 15 min | Medium |
| 8     | 8a: Modal aria label        | 5 min  | Low    |

**Total: ~1.5 hours**
