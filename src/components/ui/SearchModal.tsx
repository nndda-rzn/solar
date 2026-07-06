"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { usePlanetData } from "@/hooks/data/usePlanetData";
import { useDwarfPlanetData } from "@/hooks/data/useDwarfPlanetData";
import { useStarData } from "@/hooks/data/useStarData";
import { useConstellationData } from "@/hooks/data/useConstellationData";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { Search } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import * as THREE from "three";

export function SearchModal() {
  const t = useTranslations("common");
  const tStellar = useTranslations("stellar");
  const locale = useLocale();
  const {
    isSearchOpen,
    setSearchOpen,
    selectPlanet,
    selectStar,
    selectConstellation,
    setCameraTarget,
  } = useExplorerStore();
  const { planets } = usePlanetData();
  const { dwarfPlanets } = useDwarfPlanetData();
  const { stars } = useStarData();
  const { constellations } = useConstellationData();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allObjects = [
    {
      id: "sun",
      name: "Sun",
      color: "#FBBF24",
      type: "star" as const,
      distanceScaled: undefined as number | undefined,
    },
    ...planets.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color || "#ffffff",
      type: "planet" as const,
      distanceScaled: p.distanceScaled,
    })),
    ...dwarfPlanets.map((dp) => ({
      id: dp.id,
      name: dp.name,
      color: dp.color,
      type: "dwarf planet" as const,
      distanceScaled: dp.distanceScaled,
    })),
    ...stars.map((s) => ({
      id: s.id,
      name: s.name,
      color: s.color,
      type: "stellar" as const,
      x: s.x,
      y: s.y,
      z: s.z,
      distanceScaled: undefined as number | undefined,
    })),
    ...constellations.map((c) => ({
      id: c.id,
      name: locale === "id" ? c.indonesianName : c.name,
      color: "#4a9eff",
      type: "constellation" as const,
      stars: c.stars,
      distanceScaled: undefined as number | undefined,
    })),
  ];

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      star: t("types.star"),
      planet: t("types.planet"),
      "dwarf planet": t("types.dwarfPlanet"),
      stellar: tStellar("types.star"),
      constellation: tStellar("types.constellation"),
    };
    return typeMap[type] ?? type;
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
      if (obj.id === "sun") {
        selectPlanet(null);
        selectStar(null);
        setCameraTarget(new THREE.Vector3(0, 0, 0));
      } else if (obj.type === "stellar") {
        selectPlanet(null);
        selectConstellation(null);
        selectStar(obj.id);
        const pos = new THREE.Vector3(obj.x, obj.y, obj.z);
        setCameraTarget(pos);
      } else if (obj.type === "constellation") {
        selectPlanet(null);
        selectStar(null);
        selectConstellation(obj.id);
        // Calculate centroid from member stars for camera target
        const memberStars = stars.filter((s) => obj.stars.includes(s.id));
        if (memberStars.length > 0) {
          const centroid = new THREE.Vector3();
          memberStars.forEach((s) =>
            centroid.add(new THREE.Vector3(s.x, s.y, s.z)),
          );
          centroid.divideScalar(memberStars.length);
          setCameraTarget(centroid);
        }
      } else {
        selectStar(null);
        selectConstellation(null);
        selectPlanet(obj.id);
        const dist = (obj.distanceScaled ?? 10) * 10;
        const pos = new THREE.Vector3(dist, 0, 0);
        setCameraTarget(pos);
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
        const obj = filtered[selectedIndex];
        handleSelect(obj);
      }
    },
    [filtered, selectedIndex, handleSelect],
  );

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[20vh]">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setSearchOpen(false)}
      />
      <div className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-cosmic-deep/95 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search className="h-5 w-5 text-white/40" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("search.placeholder")}
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
