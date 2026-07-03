"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { usePlanetData } from "@/hooks/data/usePlanetData";
import { Search } from "lucide-react";
import * as THREE from "three";

export function SearchModal() {
  const { isSearchOpen, setSearchOpen, selectPlanet, setCameraTarget } =
    useExplorerStore();
  const { planets } = usePlanetData();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allObjects = [
    { id: "sun", name: "Sun", color: "#FBBF24", type: "star" as const },
    ...planets.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color || "#ffffff",
      type: "planet" as const,
      distanceScaled: p.distanceScaled,
    })),
  ];

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
    (id: string, distanceScaled?: number) => {
      if (id === "sun") {
        selectPlanet(null);
        setCameraTarget(new THREE.Vector3(0, 0, 0));
      } else {
        selectPlanet(id);
        const dist = (distanceScaled || 10) * 10;
        const pos = new THREE.Vector3(dist, 0, 0);
        setCameraTarget(pos);
      }
      setSearchOpen(false);
    },
    [selectPlanet, setCameraTarget, setSearchOpen],
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
        handleSelect(
          obj.id,
          "distanceScaled" in obj ? obj.distanceScaled : undefined,
        );
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
            placeholder="Search planets, stars..."
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
          />
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/40">
            ESC
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-white/40">
              No results found
            </div>
          ) : (
            filtered.map((obj, index) => (
              <button
                key={obj.id}
                onClick={() =>
                  handleSelect(
                    obj.id,
                    "distanceScaled" in obj ? obj.distanceScaled : undefined,
                  )
                }
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
                  {obj.type}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
