"use client";

import { useEffect, useRef } from "react";
import {
  Globe,
  Orbit,
  Star,
  Telescope,
  Bookmark,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { LibraryTab } from "./LibraryTabs";
import type { LibraryItemType } from "./LibraryCard";

export interface TreeItem {
  id: string;
  label: string;
  accentColor?: string | undefined;
  type: LibraryItemType;
}

export interface TreeSection {
  key: LibraryTab;
  items: TreeItem[];
}

export type TreeSelection =
  | { kind: "none" }
  | { kind: "section"; tab: LibraryTab }
  | { kind: "item"; id: string; type: LibraryItemType; tab: LibraryTab };

interface LibraryTreeProps {
  sections: TreeSection[];
  selection: TreeSelection;
  openSections: Set<LibraryTab>;
  onSectionToggle: (tab: LibraryTab) => void;
  onSectionSelect: (tab: LibraryTab) => void;
  onItemSelect: (id: string, type: LibraryItemType, tab: LibraryTab) => void;
  query: string;
}

const SECTION_ICONS: Record<LibraryTab, typeof Globe> = {
  planets: Globe,
  dwarfPlanets: Orbit,
  stars: Star,
  constellations: Telescope,
  bookmarks: Bookmark,
};

const SECTION_LABELS: Record<LibraryTab, string> = {
  planets: "tabs.planets",
  dwarfPlanets: "tabs.dwarfPlanets",
  stars: "tabs.stars",
  constellations: "tabs.constellations",
  bookmarks: "tabs.bookmarks",
};

export function LibraryTree({
  sections,
  selection,
  openSections,
  onSectionToggle,
  onSectionSelect,
  onItemSelect,
  query,
}: LibraryTreeProps) {
  const t = useTranslations("common.library");
  const activeRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [selection]);

  const isItemActive = (id: string) =>
    selection.kind === "item" && selection.id === id;

  const isSectionActive = (tab: LibraryTab) =>
    selection.kind === "section" && selection.tab === tab;

  return (
    <nav
      className="flex h-full flex-col overflow-y-auto py-2"
      aria-label="Library tree"
    >
      {sections.map((section) => {
        const Icon = SECTION_ICONS[section.key];
        const isOpen = openSections.has(section.key);
        const isActive = isSectionActive(section.key);

        // Filter items by query
        const filteredItems = query
          ? section.items.filter((item) =>
              item.label.toLowerCase().includes(query.toLowerCase()),
            )
          : section.items;

        // Hide section if query active and no matching items
        if (query && filteredItems.length === 0) return null;

        return (
          <div key={section.key}>
            {/* Section header */}
            <div
              className={`group flex items-center gap-1 px-2 py-0.5 ${
                isActive ? "bg-cosmic-accent/10" : ""
              }`}
            >
              {/* Toggle chevron */}
              <button
                type="button"
                onClick={() => onSectionToggle(section.key)}
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded text-white/30 transition-colors hover:text-white/60"
                aria-label={isOpen ? "Collapse" : "Expand"}
              >
                <ChevronRight
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    isOpen ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {/* Section label — clickable for overview */}
              <button
                type="button"
                onClick={() => onSectionSelect(section.key)}
                className={`flex flex-1 items-center gap-2 rounded-md px-1.5 py-1 text-left transition-colors ${
                  isActive
                    ? "text-cosmic-accent"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5 flex-shrink-0" aria-hidden />
                <span className="flex-1 truncate text-xs font-medium">
                  {t(SECTION_LABELS[section.key])}
                </span>
                <span className="rounded px-1.5 py-0.5 text-[10px] text-white/30">
                  {section.items.length}
                </span>
              </button>
            </div>

            {/* Items */}
            {isOpen && (
              <div className="mb-1">
                {filteredItems.map((item) => {
                  const active = isItemActive(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      ref={active ? activeRef : null}
                      onClick={() =>
                        onItemSelect(item.id, item.type, section.key)
                      }
                      className={`group flex w-full items-center gap-2.5 py-1.5 pl-9 pr-3 text-left transition-colors ${
                        active
                          ? "border-l-2 border-cosmic-accent bg-cosmic-accent/10 text-cosmic-accent"
                          : "border-l-2 border-transparent text-white/50 hover:bg-white/5 hover:text-white/80"
                      }`}
                    >
                      {/* Color dot */}
                      <span
                        className="h-1.5 w-1.5 flex-shrink-0 rounded-full"
                        style={{
                          backgroundColor:
                            item.accentColor ?? "rgba(255,255,255,0.3)",
                        }}
                        aria-hidden
                      />
                      <span className="flex-1 truncate text-xs">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
