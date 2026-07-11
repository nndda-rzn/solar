"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useUIStore } from "@/lib/store/ui-store";
import { useSelectionStore } from "@/lib/store/selection-store";
import { useCameraStore } from "@/lib/store/camera-store";
import { usePlanetData } from "@/hooks/data/usePlanetData";
import { useDwarfPlanetData } from "@/hooks/data/useDwarfPlanetData";
import { useStarData } from "@/hooks/data/useStarData";
import { useConstellationData } from "@/hooks/data/useConstellationData";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import {
  buildSearchIndex,
  TYPE_LABEL_KEYS,
} from "@/lib/search/buildSearchIndex";
import { resolveObjectSelect } from "@/lib/search/handleObjectSelect";

export function SearchModal() {
  const t = useTranslations("common");
  const tStellar = useTranslations("stellar");
  const locale = useLocale();
  const isSearchOpen = useUIStore((s) => s.isSearchOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const selectPlanet = useSelectionStore((s) => s.selectPlanet);
  const selectStar = useSelectionStore((s) => s.selectStar);
  const selectConstellation = useSelectionStore((s) => s.selectConstellation);
  const setCameraTarget = useCameraStore((s) => s.setCameraTarget);
  const { planets } = usePlanetData();
  const { dwarfPlanets } = useDwarfPlanetData();
  const { stars } = useStarData();
  const { constellations } = useConstellationData();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allObjects = buildSearchIndex({
    planets,
    dwarfPlanets,
    stars,
    constellations,
    locale,
  });

  const getTypeLabel = (type: string) => {
    const mapping = TYPE_LABEL_KEYS[type as keyof typeof TYPE_LABEL_KEYS];
    if (!mapping) return type;
    return mapping.namespace === "stellar"
      ? tStellar(mapping.key)
      : t(mapping.key);
  };

  const filtered = allObjects.filter((obj) =>
    obj.name.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (isSearchOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleSelect = useCallback(
    (obj: (typeof allObjects)[0]) => {
      cosmicEventBus.emit({ type: "search_used", payload: { query } });
      const { action, cameraTarget } = resolveObjectSelect(obj, stars);

      switch (action.kind) {
        case "sun":
          selectPlanet(null);
          selectStar(null);
          break;
        case "star":
          selectPlanet(null);
          selectConstellation(null);
          selectStar(action.id);
          break;
        case "constellation":
          selectPlanet(null);
          selectStar(null);
          selectConstellation(action.id);
          break;
        case "planet":
          selectStar(null);
          selectConstellation(null);
          selectPlanet(action.id);
          break;
      }

      if (cameraTarget) {
        setCameraTarget(cameraTarget);
      }
      setSearchOpen(false);
    },
    [
      selectPlanet,
      selectStar,
      selectConstellation,
      setCameraTarget,
      setSearchOpen,
      stars,
      query,
    ],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && filtered[selectedIndex]) {
        const obj = filtered[selectedIndex]!;
        handleSelect(obj);
      }
    },
    [filtered, selectedIndex, handleSelect],
  );

  const modalRef = useFocusTrap(isSearchOpen);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setSearchOpen(false)}
      />
      <div
        ref={modalRef as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-label={t("header.search")}
        className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-cosmic-deep/95 shadow-2xl backdrop-blur-xl"
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("search.placeholder")}
            aria-label={t("search.placeholder")}
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results-list"
            aria-activedescendant={
              filtered[selectedIndex]
                ? `search-result-${filtered[selectedIndex]!.id}`
                : undefined
            }
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/40">
              {t("search.noResults")}
            </div>
          ) : (
            filtered.map((obj, index) => (
              <button
                key={obj.id}
                onClick={() => handleSelect(obj)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                  index === selectedIndex
                    ? "bg-cosmic-accent/20 text-cosmic-accent"
                    : "text-white/70 hover:bg-white/5"
                }`}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: obj.color }}
                />
                <span className="text-sm font-medium">{obj.name}</span>
                <span className="ml-auto text-xs text-white/30 capitalize">
                  {getTypeLabel(obj.type)}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
