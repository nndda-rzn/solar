"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useTranslations, useLocale } from "next-intl";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSelectionStore } from "@/lib/store/selection-store";
import {
  catalog,
  detail as detailByTab,
  type LibraryDetailItemRaw,
} from "@/lib/library/catalog";
import { type LibraryTab } from "@/components/library/LibraryTabs";
import { type LibraryItemType } from "@/components/library/LibraryCard";
import { type LibraryDetailItem } from "@/components/library/LibraryDetail";
import {
  LibraryTree,
  type TreeSection,
  type TreeSelection,
} from "@/components/library/LibraryTree";
import { LibraryDetailPanel } from "@/components/library/LibraryDetailPanel";
import { cosmicEventBus } from "@/lib/events/event-bus";

export default function LibraryPage() {
  const t = useTranslations("common.library");
  const router = useRouter();
  const locale = useLocale();
  const { bookmarks } = useBookmarks();
  const selectPlanet = useSelectionStore((s) => s.selectPlanet);
  const selectStar = useSelectionStore((s) => s.selectStar);
  const selectConstellation = useSelectionStore((s) => s.selectConstellation);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selection, setSelection] = useState<TreeSelection>({
    kind: "item",
    id: "mercury",
    type: "planet",
    tab: "planets",
  });
  const [openSections, setOpenSections] = useState<Set<LibraryTab>>(
    () => new Set<LibraryTab>(["planets"]),
  );
  const [detailItem, setDetailItem] = useState<LibraryDetailItem | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  // Debounce query
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query), 150);
    return () => clearTimeout(id);
  }, [query]);

  // Keyboard shortcut: "/" focuses search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const resolveLocaleDetail = useCallback(
    (raw: LibraryDetailItemRaw): LibraryDetailItem => {
      const item: LibraryDetailItem = {
        id: raw.id,
        title: raw.title,
        type: raw.type,
        stats: raw.stats,
      };
      if (raw.accentColor) item.accentColor = raw.accentColor;
      if (raw.textureUrl) item.textureUrl = raw.textureUrl;
      if (raw.magnitude !== undefined) item.magnitude = raw.magnitude;
      if (raw.spectralType) item.spectralType = raw.spectralType;
      if (raw.canvasStars) item.canvasStars = raw.canvasStars;
      if (raw.lines) item.lines = raw.lines;

      const enDesc = raw.rawDescriptionEn;
      const idDesc = raw.rawDescriptionId;
      const enFacts = raw.rawFactsEn;
      const idFacts = raw.rawFactsId;
      const enMyth = raw.rawMythologyEn;
      const idMyth = raw.rawMythologyId;

      const desc = locale === "id" ? (idDesc ?? enDesc) : (enDesc ?? idDesc);
      const facts =
        locale === "id" ? (idFacts ?? enFacts) : (enFacts ?? idFacts);
      const myth = locale === "id" ? (idMyth ?? enMyth) : (enMyth ?? idMyth);

      if (desc) item.description = desc;
      if (facts) item.facts = facts;
      if (myth) item.mythology = myth;
      return item;
    },
    [locale],
  );

  // Build tree sections
  const sections = useMemo<TreeSection[]>(() => {
    const tabs: LibraryTab[] = [
      "planets",
      "dwarfPlanets",
      "stars",
      "constellations",
      "bookmarks",
    ];
    return tabs.map((tab) => {
      if (tab === "bookmarks") {
        return {
          key: tab,
          items: bookmarks.map((b) => ({
            id: b.id,
            label: b.name,
            accentColor: "#7cb9ff",
            type: (b.selectedType ?? "planet") as LibraryItemType,
          })),
        };
      }
      return {
        key: tab,
        items: (catalog[tab] ?? []).map((item) => ({
          id: item.id,
          label: item.title,
          accentColor: item.accentColor,
          type: item.type,
        })),
      };
    });
  }, [bookmarks]);

  // Resolve detail when selection changes
  useEffect(() => {
    if (selection.kind !== "item") {
      setDetailItem(null);
      return;
    }

    const { id, type, tab } = selection;

    // Bookmark
    if (tab === "bookmarks") {
      const bookmark = bookmarks.find((b) => b.id === id);
      if (!bookmark) return;
      setDetailItem({
        id: bookmark.id,
        title: bookmark.name,
        type: (bookmark.selectedType ?? "planet") as LibraryItemType,
        accentColor: "#7cb9ff",
        stats: [
          { label: "Day offset", value: `+${Math.round(bookmark.dayOffset)}` },
        ],
      });
      return;
    }

    const raw = detailByTab[tab]?.[id];
    if (!raw) {
      const catalogItem = catalog[tab]?.find((c) => c.id === id);
      if (!catalogItem) return;
      setDetailItem({
        id: catalogItem.id,
        title: catalogItem.title,
        type: catalogItem.type,
        description: t("noContent"),
        stats: catalogItem.stats ?? [],
        ...(catalogItem.accentColor
          ? { accentColor: catalogItem.accentColor }
          : {}),
      });
    } else {
      setDetailItem(resolveLocaleDetail(raw));
    }

    cosmicEventBus.emit({ type: "library_accessed", payload: { itemId: id } });
  }, [selection, bookmarks, t, resolveLocaleDetail]);

  // Initialize Mercury detail on mount
  useEffect(() => {
    const raw = detailByTab["planets"]?.["mercury"];
    if (raw) setDetailItem(resolveLocaleDetail(raw));
  }, [resolveLocaleDetail]);

  const handleSectionToggle = useCallback((tab: LibraryTab) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(tab)) next.delete(tab);
      else next.add(tab);
      return next;
    });
  }, []);

  const handleSectionSelect = useCallback((tab: LibraryTab) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.add(tab);
      return next;
    });
    setSelection({ kind: "section", tab });
  }, []);

  const handleItemSelect = useCallback(
    (id: string, type: LibraryItemType, tab: LibraryTab) => {
      setSelection({ kind: "item", id, type, tab });
      setOpenSections((prev) => {
        const next = new Set(prev);
        next.add(tab);
        return next;
      });
    },
    [],
  );

  const handleExplore = useCallback(
    (id: string, type: LibraryItemType) => {
      setSelection({ kind: "none" });
      switch (type) {
        case "planet":
        case "dwarfPlanet":
          selectPlanet(id);
          break;
        case "star":
          selectStar(id);
          break;
        case "constellation":
          selectConstellation(id);
          break;
      }
      router.push("/");
    },
    [selectPlanet, selectStar, selectConstellation, router],
  );

  const handleDetailItemSelect = useCallback(
    (id: string, type: LibraryItemType) => {
      const tab =
        type === "planet"
          ? "planets"
          : type === "dwarfPlanet"
            ? "dwarfPlanets"
            : type === "star"
              ? "stars"
              : "constellations";
      handleItemSelect(id, type, tab as LibraryTab);
    },
    [handleItemSelect],
  );

  const activeTab =
    selection.kind === "none"
      ? "planets"
      : selection.kind === "section"
        ? selection.tab
        : selection.tab;

  const activeSectionItems = useMemo(() => {
    const tab = activeTab;
    if (tab === "bookmarks") {
      return bookmarks.map((b) => ({
        id: b.id,
        label: b.name,
        accentColor: "#7cb9ff",
        type: (b.selectedType ?? "planet") as LibraryItemType,
      }));
    }
    return (catalog[tab] ?? []).map((item) => ({
      id: item.id,
      label: item.title,
      accentColor: item.accentColor,
      type: item.type,
    }));
  }, [activeTab, bookmarks]);

  return (
    <AppShell breadcrumb={t("title").toUpperCase()}>
      <div className="flex h-[calc(100vh-3.5rem)] flex-col">
        {/* Search bar */}
        <div className="flex-shrink-0 border-b border-white/[0.06] px-4 py-2.5">
          <div className="relative max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`${t("searchPlaceholder") ?? "Search celestial objects..."}  /`}
              className="w-full rounded-lg border border-white/[0.06] bg-[#080c12] py-2 pl-9 pr-8 text-sm text-white/80 placeholder-white/25 outline-none transition-colors focus:border-cosmic-accent/30 focus:bg-[#0a0f16]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tree + Detail split */}
        <div className="flex flex-1 overflow-hidden">
          {/* Tree sidebar */}
          <div className="w-64 flex-shrink-0 overflow-y-auto border-r border-white/[0.08] bg-[#080c12]">
            <LibraryTree
              sections={sections}
              selection={selection}
              openSections={openSections}
              onSectionToggle={handleSectionToggle}
              onSectionSelect={handleSectionSelect}
              onItemSelect={handleItemSelect}
              query={debouncedQuery}
            />
          </div>

          {/* Detail panel */}
          <div className="flex-1 overflow-y-auto">
            <LibraryDetailPanel
              selection={selection}
              detailItem={detailItem}
              sectionItems={activeSectionItems}
              activeTab={activeTab}
              onExplore={handleExplore}
              onClose={() => setSelection({ kind: "none" })}
              onItemSelect={handleDetailItemSelect}
            />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
