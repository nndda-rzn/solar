# Search (CMD+K) Feature Design

## Overview

Implement a keyboard-driven search modal (CMD+K / Ctrl+K) for quick navigation to planets and the sun in the Solar System Explorer.

## Requirements

1. Global keyboard shortcut: CMD+K (Mac) / Ctrl+K (Windows/Linux) opens search
2. ESC key closes search
3. Search input with real-time filtering
4. Keyboard navigation (arrow keys + enter)
5. Visual feedback for selected item
6. Camera fly-to animation on selection
7. Search button in header bar as alternative trigger

## Architecture

### New Files

1. `src/hooks/useKeyboardShortcuts.ts` - Global keyboard event handler
2. `src/components/ui/SearchModal.tsx` - Search modal UI component

### Modified Files

1. `src/components/ui/HUD.tsx` - Integrate SearchModal and keyboard shortcuts
2. `src/components/ui/HeaderBar.tsx` - Add search trigger button

### Dependencies

- Existing store: `explorer-store.ts` (already has search state)
- Existing hook: `usePlanetData.ts` (provides planet/sun data)
- Existing types: `PlanetData` (has `id`, `name`, `color`, `distanceScaled`)
- External: `lucide-react` (Search, X icons), `three` (Vector3)

## Detailed Design

### 1. useKeyboardShortcuts Hook

**Purpose**: Attach global keyboard listeners for search toggle

**Implementation**:

```typescript
"use client";
import { useEffect } from "react";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function useKeyboardShortcuts() {
  const toggleSearch = useExplorerStore((s) => s.toggleSearch);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === "Escape") {
        const { isSearchOpen, setSearchOpen } = useExplorerStore.getState();
        if (isSearchOpen) {
          setSearchOpen(false);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearch]);
}
```

**Key Points**:

- Uses `useExplorerStore.getState()` for ESC handler to avoid stale closures
- Prevents default browser behavior for CMD+K
- Cleans up event listener on unmount

### 2. SearchModal Component

**Purpose**: Modal UI for searching and selecting celestial objects

**State Management**:

- `query: string` - Current search input
- `selectedIndex: number` - Currently highlighted result index

**Data Flow**:

1. Get `isSearchOpen`, `setSearchOpen`, `selectPlanet`, `setCameraTarget` from store
2. Get `planets`, `sun` from `usePlanetData()`
3. Combine into `allObjects` array with consistent shape:
   ```typescript
   { id: string, name: string, color: string, type: "star" | "planet" }
   ```
4. Filter by `name.toLowerCase().includes(query.toLowerCase())`

**Selection Logic**:

```typescript
const handleSelect = (id: string) => {
  selectPlanet(id === "sun" ? null : id);

  if (id === "sun") {
    setCameraTarget(new THREE.Vector3(0, 0, 0));
  } else {
    const planet = planets.find((p) => p.id === id);
    if (planet) {
      const distance = planet.distanceScaled * 10;
      const pos = new THREE.Vector3(distance, 0, 0); // Angle 0 (x-axis)
      setCameraTarget(pos);
    }
  }

  setSearchOpen(false);
};
```

**Keyboard Navigation**:

- ArrowDown: `selectedIndex = Math.min(selectedIndex + 1, filtered.length - 1)`
- ArrowUp: `selectedIndex = Math.max(selectedIndex - 1, 0)`
- Enter: Call `handleSelect(filtered[selectedIndex].id)`

**UI Structure**:

```
┌─────────────────────────────────────┐
│ 🔍 [Search input............] [ESC] │
├─────────────────────────────────────┤
│ ● Mercury                    planet │
│ ● Venus                      planet │  ← selected (highlighted)
│ ● Earth                      planet │
│ ● Sun                         star │
└─────────────────────────────────────┘
```

**Styling**:

- Fixed overlay: `fixed inset-0 z-[60]`
- Backdrop: `bg-black/60 backdrop-blur-sm`
- Modal: `bg-cosmic-deep/95 backdrop-blur-xl border border-white/10`
- Selected item: `bg-cosmic-accent/20 text-cosmic-accent`
- Planet color dot: 12px circle with `style={{ backgroundColor: obj.color }}`

### 3. HUD.tsx Updates

**Changes**:

1. Import `SearchModal` and `useKeyboardShortcuts`
2. Call `useKeyboardShortcuts()` in component body
3. Add `<SearchModal />` after `<InfoPanel />`

**Updated JSX**:

```tsx
export function HUD() {
  useKeyboardShortcuts();

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <HeaderBar />
      <BackButton />
      <SimulationControls />
      <ScaleIndicator />
      <InfoPanel />
      <SearchModal />
    </div>
  );
}
```

### 4. HeaderBar.tsx Updates

**Changes**:

1. Import `Search` from `lucide-react`
2. Import `useExplorerStore`
3. Get `toggleSearch` from store
4. Add search button before DATE section

**Button Styling**:

```tsx
<button
  onClick={toggleSearch}
  className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white/70"
>
  <Search className="h-3 w-3" />
  <span>Search</span>
  <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px]">
    ⌘K
  </kbd>
</button>
```

## Verification

### TypeScript

```bash
npx tsc --noEmit
```

Expected: No errors

### ESLint

```bash
npx eslint src/hooks/useKeyboardShortcuts.ts src/components/ui/SearchModal.tsx src/components/ui/HUD.tsx src/components/ui/HeaderBar.tsx
```

Expected: No errors or only warnings

### Manual Testing

1. Press CMD+K → Modal opens with focus on input
2. Press Ctrl+K (Windows) → Modal opens
3. Type "earth" → Earth appears in results
4. Press ArrowDown → Selection moves down
5. Press ArrowUp → Selection moves up
6. Press Enter → Earth selected, camera moves, modal closes
7. Press ESC → Modal closes
8. Click backdrop → Modal closes
9. Click Search button in header → Modal opens
10. Type "xyz" → "No results found" message

## Success Criteria

- [ ] CMD+K opens search modal
- [ ] Ctrl+K opens search modal
- [ ] ESC closes search modal
- [ ] Search filters by name (case-insensitive)
- [ ] Arrow keys navigate results
- [ ] Enter selects and navigates
- [ ] Camera flies to selected object
- [ ] Search button visible in header
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] No runtime errors

## Out of Scope

- Advanced fuzzy search
- Search history
- Recent searches
- Search within planet descriptions
- Mobile touch gestures
- Sound effects on selection
