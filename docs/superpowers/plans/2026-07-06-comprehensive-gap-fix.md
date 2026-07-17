# Comprehensive Gap Fix — Bugs + Galactic/Cosmic + Polish + i18n

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development`. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix semua gap dari codebase analysis — critical bugs (header i18n, OrbitControls), implement galactic + cosmic scenes, polish (material leak, a11y, error handling), dan i18n completion untuk auth/profile forms.

**Branch:** `feature/stellar-neighborhood-complete` (continued)

**Context:** Phase 1 (solar), Phase 2 (achievements/progress/bookmarks), dan Stellar P1 (StarGlow + tests) sudah complete. Gap analysis menemukan 3 HIGH bugs + 4 MED gaps + 4 LOW gaps. Plan ini cover semua.

---

## Phase A: Critical Bug Fixes (HIGH)

### A1. Fix `common.json` duplicate `header` key

**Files:**

- Modify: `src/messages/en/common.json`
- Modify: `src/messages/id/common.json`

**Problem:** `header` key appears 2x (line 2 with title/subtitle/search/date/speed/close, line 81 with bookmark/level/xp). Second overrides first → `header.title`, `header.subtitle`, etc. are DEAD. HeaderBar shows undefined.

**Fix:** Merge into single `header` object. Remove duplicate block at line 81-85. Final structure:

```json
"header": {
  "title": "...",
  "subtitle": "...",
  "search": "...",
  "searchPlaceholder": "...",
  "noResults": "...",
  "date": "...",
  "speed": "...",
  "close": "...",
  "bookmark": "...",
  "level": "...",
  "xp": "..."
}
```

**Verification:** `npm run dev` → HeaderBar shows correct title/subtitle/search labels.

---

### A2. Fix OrbitControls `maxDistance` + add damping

**File:** Modify `src/components/cosmic-explorer/Scene.tsx`

**Problem:** `maxDistance={600}` blocks zoom to stellar(500)/galactic(5000)/cosmic(50000) thresholds. User can't zoom out via scroll. Also no damping → rigid rotation.

**Fix:**

```tsx
<OrbitControls
  enabled={!isFlying}
  enablePan
  enableZoom
  enableRotate
  minDistance={5}
  maxDistance={100000}
  enableDamping
  dampingFactor={0.05}
/>
```

**Verification:** Zoom out via scroll → passes 500 (stellar) → 5000 (galactic) → 50000 (cosmic). ScaleManager auto-detects.

---

### A3. Implement galactic + cosmic scenes

**New files:**

- `src/components/galactic/GalacticScene.tsx` — Milky Way galaxy rendering
- `src/components/cosmic/CosmicScene.tsx` — Multiple galaxies (deep field)
- `src/data/galactic/galaxies.json` (optional, can generate procedural)

**Modified files:**

- `src/components/cosmic-explorer/Scene.tsx` — add scene branches

**GalacticScene design:**

- Spiral galaxy via `THREE.Points` + `BufferGeometry` (~50,000 particles)
- 4 spiral arms, logarithmic spiral math
- Color gradient: yellow-white core → blue outer arms
- Slow rotation animation via `useFrame`
- Bright core glow (simple sprite or shader)
- Reuse noise from `src/shaders/common/noise.glsl` for dust nebula

```tsx
// Pseudocode
const particles = useMemo(() => {
  const count = 50000;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const arm = Math.floor(Math.random() * 4);
    const radius = Math.random() * 200;
    const angle = (arm / 4) * Math.PI * 2 + radius * 0.05;
    const spread = (Math.random() - 0.5) * 20;
    positions[i * 3] = Math.cos(angle) * radius + spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 10 * (1 - radius / 200);
    positions[i * 3 + 2] = Math.sin(angle) * radius + spread;
  }
  return { positions, colors };
}, []);

useFrame((_, delta) => {
  if (pointsRef.current) pointsRef.current.rotation.y += delta * 0.02;
});
```

**CosmicScene design:**

- ~100 galaxies as instanced sprites or small point clusters
- Random distribution in large sphere (radius 50000)
- Each galaxy: small glowing dot with sprite or simple geometry
- Background: deep field star field (drei `<Stars>` with high count)
- Slow drift animation

**Scene.tsx update:**

```tsx
{
  scale === "solar" && <SolarSystemScene />;
}
{
  scale === "stellar" && <StellarScene />;
}
{
  scale === "galactic" && <GalacticScene />;
}
{
  scale === "cosmic" && <CosmicScene />;
}
```

**Cleanup:** Both scenes must dispose geometry on unmount.

**Verification:** Click "Galaxy" → spiral galaxy renders. Click "Universe" → multiple galaxies render.

---

## Phase B: Polish (MED)

### B1. Fix `useProceduralTexture` material leak

**File:** Modify `src/hooks/useProceduralTexture.ts`

**Problem:** `useMemo` creates `new THREE.ShaderMaterial(...)` but never disposes. GPU memory grows on scale switches.

**Fix:**

```typescript
useEffect(() => {
  return () => {
    material.dispose();
  };
}, [material]);
```

---

### B2. BookmarkSaveModal silent failure

**File:** Modify `src/components/ui/BookmarkSaveModal.tsx`

**Problem:** If `create()` returns null (failure), no error shown.

**Fix:**

```typescript
const created = await create(payload);
if (!created) {
  push({ title: t("bookmarks.saveError"), variant: "error" });
  return;
}
```

Add i18n key `bookmarks.saveError` to common.json (en: "Failed to save bookmark", id: "Gagal menyimpan bookmark").

---

### B3. Modals a11y (role=dialog + focus trap)

**Files:** `SearchModal.tsx`, `BookmarkSaveModal.tsx`, `InfoPanel.tsx`, `StellarInfoPanel.tsx`

**Fix:**

- Add `role="dialog"` `aria-modal="true"` to modal container.
- Implement focus trap via `useEffect` keydown handler:

```typescript
useEffect(() => {
  if (!isOpen) return;
  const modal = modalRef.current;
  if (!modal) return;
  const focusable = modal.querySelectorAll(
    'button, input, [tabindex]:not([tabindex="-1"])',
  );
  const first = focusable[0] as HTMLElement;
  const last = focusable[focusable.length - 1] as HTMLElement;
  first?.focus();
  function handleTab(e: KeyboardEvent) {
    if (e.key !== "Tab") return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  }
  modal.addEventListener("keydown", handleTab);
  return () => modal.removeEventListener("keydown", handleTab);
}, [isOpen]);
```

- Add missing `aria-label`s: HeaderBar search toggle, bookmark button, language toggle; ScaleIndicator buttons; SearchModal input + results; HUD BackButton.

---

### B4. Toast a11y

**File:** Modify `src/components/ui/Toast.tsx`

**Fix:**

- Container: `role="status"` `aria-live="polite"`
- Achievement variant: `role="alert"` `aria-live="assertive"`

---

## Phase C: i18n + Auth Cleanup (LOW-MED)

### C1. i18n auth forms (Login + Signup)

**Files:** `LoginForm.tsx`, `SignupForm.tsx`, `src/messages/{en,id}/common.json`

**Add keys (both en + id):**

```json
"auth": {
  "login": {
    "title": "Login to Cosmic Explorer",
    "subtitle": "Continue your journey through the solar system",
    "emailPlaceholder": "Enter email",
    "passwordPlaceholder": "Enter password",
    "rememberMe": "Remember me",
    "forgotPassword": "Forgot password?",
    "submit": "Login Now",
    "processing": "Processing...",
    "noAccount": "Don't have an account?",
    "signupHere": "Sign up here",
    "errorInvalid": "Invalid email or password"
  },
  "signup": {
    "title": "Sign up to Cosmic Explorer",
    "subtitle": "Start your journey exploring the solar system",
    "usernamePlaceholder": "Enter username",
    "emailPlaceholder": "Enter email",
    "passwordPlaceholder": "Enter password",
    "confirmPassword": "Confirm Password",
    "confirmPlaceholder": "Repeat password",
    "submit": "Sign Up Now",
    "processing": "Processing...",
    "hasAccount": "Already have an account?",
    "loginHere": "Login here",
    "errorExists": "Email already registered"
  }
}
```

Replace all 11 hardcoded strings in LoginForm + 11 in SignupForm with `useTranslations("common")`.

---

### C2. i18n ProfileForm + fix setState anti-pattern

**File:** `ProfileForm.tsx`, `common.json`

**Add keys (both en + id):**

```json
"profile": {
  "loading": "Loading profile...",
  "loadError": "Failed to load profile: ",
  "notFound": "No profile found.",
  "saved": "Profile saved.",
  "displayName": "Display Name",
  "displayNamePlaceholder": "Display name",
  "bio": "Bio",
  "bioPlaceholder": "Tell us about yourself",
  "avatarUrl": "Avatar URL",
  "save": "Save Profile"
}
```

Replace 11 hardcoded strings.

**Fix anti-pattern:** Move `setState` during render to `useEffect`:

```typescript
useEffect(() => {
  if (profile && !hydrated) {
    setDisplayName(profile.displayName ?? "");
    setBio(profile.bio ?? "");
    setAvatarUrl(profile.avatarUrl ?? "");
    setHydrated(true);
  }
}, [profile, hydrated]);
```

---

### C3. Fix dead links + locale bypass

**Files:** `LoginForm.tsx`, `SignupForm.tsx`

**Fix:**

- Replace `<a href="/login">` and `<a href="/signup">` → `import { Link } from "@/i18n/navigation"` (preserves locale prefix).
- "Lupa password?" `href="#"` → replace with disabled text or button with `title="Coming soon"`.

---

### C4. Fix login/signup page error strings

**Files:** `src/app/[locale]/login/page.tsx`, `src/app/[locale]/signup/page.tsx`

**Fix:** Replace hardcoded Indonesian error strings → use `useTranslations("common")` + `t("auth.login.errorInvalid")` / `t("auth.signup.errorExists")`.

---

### C5. Middleware: redirect authenticated users from /login + /signup

**File:** Modify `src/middleware.ts`

**Fix:** Add inverse branch after the unauthenticated check:

```typescript
if (user && isPublicPath(pathWithoutLocale)) {
  const locale =
    routing.locales.find((l) => pathname.startsWith(`/${l}`)) ??
    routing.defaultLocale;
  const homeUrl = new URL(`/${locale}`, request.url);
  return NextResponse.redirect(homeUrl);
}
```

---

## Phase D: Cleanup (LOW)

### D1. Wire `speed_reached` event

**File:** Modify `src/components/ui/SimulationControls.tsx` or `src/lib/store/simulation-store.ts`

**Problem:** `speed_reached` event defined in event-bus, tracked in useAchievementTracker, but NEVER emitted.

**Fix:** Emit when speed changes:

```typescript
cosmicEventBus.emit({ type: "speed_reached", payload: { speed } });
```

Or only when speed >= 10 (threshold).

---

### D2. Fix `panelType` union for constellations

**Files:**

- Modify: `src/lib/events/event-bus.ts`
- Modify: `src/components/ui/StellarInfoPanel.tsx`

**Problem:** `panelType: "planet" | "star" | "dwarf"` — no `"constellation"`. StellarInfoPanel emits `panelType: "star"` for constellations (wrong).

**Fix:**

```typescript
// event-bus.ts line 9
payload: {
  id: string;
  panelType: "planet" | "star" | "dwarf" | "constellation";
}
```

Update StellarInfoPanel constellation emit → `panelType: "constellation"`.

---

## Dependency Order

```
Round 1 (parallel):
  - A1 (header bug fix)
  - A2 (OrbitControls fix)
  - C1-C5 (i18n + auth cleanup)
  - D1-D2 (cleanup)
  - B1 (leak fix)

Round 2:
  - A3 (galactic + cosmic scenes — depends on A2 maxDistance fix)

Round 3 (parallel):
  - B2 (BookmarkSaveModal error)
  - B3 (modals a11y)
  - B4 (Toast a11y)

Round 4:
  - Final verify
```

---

## Final Verification

- `npx tsc --noEmit` — 0 errors
- `npm run lint` — 0 errors
- `npm run test` — 77+ tests pass
- `npm run build` — production build succeeds
- Smoke test:
  1. HeaderBar shows correct title/subtitle (A1)
  2. Zoom scroll: solar → stellar → galactic → cosmic, all render (A2+A3)
  3. Login/Signup forms translated in EN + ID (C1)
  4. Profile form translated (C2)
  5. Bookmark save failure shows error toast (B2)
  6. Tab key trapped in modals (B3)
  7. Speed slider triggers speed_reached event (D1)
  8. Already-authenticated user visiting /login → redirected to / (C5)
