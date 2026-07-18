"use client";

import { Globe, Star, Telescope, Orbit, Bookmark } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LibraryTab } from "./LibraryTabs";
import type { LibraryItemType } from "./LibraryCard";
import type { TreeItem, TreeSelection } from "./LibraryTree";
import { LibraryDetail, type LibraryDetailItem } from "./LibraryDetail";

interface SectionMeta {
  icon: typeof Globe;
  description: string;
}

const SECTION_META: Record<LibraryTab, SectionMeta> = {
  planets: {
    icon: Globe,
    description:
      "The 8 planets of our solar system — from rocky inner worlds to giant outer planets.",
  },
  dwarfPlanets: {
    icon: Orbit,
    description:
      "Smaller worlds that orbit the Sun but haven't cleared their orbital neighborhood.",
  },
  stars: {
    icon: Star,
    description:
      "61 stars within our stellar neighborhood, from blazing giants to dim red dwarfs.",
  },
  constellations: {
    icon: Telescope,
    description:
      "19 constellations visible in the night sky, each with rich history and mythology.",
  },
  bookmarks: {
    icon: Bookmark,
    description: "Your saved camera views and exploration bookmarks.",
  },
};

interface LibraryDetailPanelProps {
  selection: TreeSelection;
  detailItem: LibraryDetailItem | null;
  sectionItems: TreeItem[];
  activeTab: LibraryTab;
  onExplore: (id: string, type: LibraryItemType) => void;
  onClose: () => void;
  onItemSelect: (id: string, type: LibraryItemType) => void;
}

export function LibraryDetailPanel({
  selection,
  detailItem,
  sectionItems,
  activeTab,
  onExplore,
  onClose,
  onItemSelect,
}: LibraryDetailPanelProps) {
  const t = useTranslations("common.library");

  // Empty state
  if (selection.kind === "none") {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
          <Telescope className="h-6 w-6 text-white/30" aria-hidden />
        </div>
        <div>
          <p className="text-sm font-medium text-white/50">
            Select an object from the library
          </p>
          <p className="mt-1 text-xs text-white/25">
            Browse the tree on the left to explore celestial objects
          </p>
        </div>
      </div>
    );
  }

  // Section overview
  if (selection.kind === "section") {
    const meta = SECTION_META[selection.tab];
    const Icon = meta.icon;
    return (
      <div className="flex h-full flex-col overflow-y-auto">
        {/* Section header */}
        <div className="border-b border-white/[0.06] p-6">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.04]">
              <Icon className="h-5 w-5 text-cosmic-muted" aria-hidden />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-white/30">
                {t(`tabs.${selection.tab}`)}
              </p>
              <p className="text-lg font-semibold text-white/90">
                {sectionItems.length} objects
              </p>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-white/50">
            {meta.description}
          </p>
        </div>

        {/* Mini grid */}
        <div className="grid grid-cols-3 gap-2 p-4">
          {sectionItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onItemSelect(item.id, item.type)}
              className="flex flex-col items-center gap-2 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 text-center transition-all duration-150 hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.05]"
              style={
                item.accentColor
                  ? {
                      borderTopColor: `${item.accentColor}60`,
                      borderTopWidth: 2,
                    }
                  : undefined
              }
            >
              <span
                className="h-6 w-6 rounded-full"
                style={{
                  backgroundColor: item.accentColor ?? "rgba(255,255,255,0.2)",
                  boxShadow: item.accentColor
                    ? `0 0 8px ${item.accentColor}50`
                    : undefined,
                }}
                aria-hidden
              />
              <span className="line-clamp-2 text-[11px] leading-tight text-white/60">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Item detail
  if (selection.kind === "item" && detailItem) {
    return (
      <LibraryDetail
        item={detailItem}
        onExplore={onExplore}
        onClose={onClose}
      />
    );
  }

  // Loading / resolving
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-sm text-white/30">Loading...</p>
    </div>
  );
}
