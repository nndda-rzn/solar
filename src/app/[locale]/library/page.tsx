"use client";

import { useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { SlidePanel } from "@/components/ui/SlidePanel";
import { useTranslations, useLocale } from "next-intl";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useSelectionStore } from "@/lib/store/selection-store";
import {
  catalog,
  detail as detailByTab,
  type LibraryDetailItemRaw,
} from "@/lib/library/catalog";
import { LibraryTabs, type LibraryTab } from "@/components/library/LibraryTabs";
import { CatalogGrid } from "@/components/library/CatalogGrid";
import {
  LibraryDetail,
  type LibraryDetailItem,
} from "@/components/library/LibraryDetail";
import {
  LibraryCard,
  type LibraryItemType,
} from "@/components/library/LibraryCard";
import { cosmicEventBus } from "@/lib/events/event-bus";

export default function LibraryPage() {
  const t = useTranslations("common.library");
  const tc = useTranslations("common");
  const router = useRouter();
  const locale = useLocale();
  const [tab, setTab] = useState<LibraryTab>("planets");
  const [detailItem, setDetailItem] = useState<LibraryDetailItem | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const { bookmarks } = useBookmarks();
  const selectPlanet = useSelectionStore((s) => s.selectPlanet);
  const selectStar = useSelectionStore((s) => s.selectStar);
  const selectConstellation = useSelectionStore((s) => s.selectConstellation);

  const visible = useMemo(() => catalog[tab] ?? [], [tab]);

  const resolveLocaleDetail = useCallback(
    (raw: LibraryDetailItemRaw): LibraryDetailItem => {
      const item: LibraryDetailItem = {
        id: raw.id,
        title: raw.title,
        type: raw.type,
        stats: raw.stats,
      };
      if (raw.accentColor) item.accentColor = raw.accentColor;

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
      if (!desc && !facts) {
        if (raw.description) item.description = raw.description;
        if (raw.facts) item.facts = raw.facts;
      }

      return item;
    },
    [locale],
  );

  const handleSelect = useCallback(
    (id: string, _type: LibraryItemType) => {
      void _type;
      if (tab === "bookmarks") {
        const bookmark = bookmarks.find((b) => b.id === id);
        if (!bookmark?.selectedObject || !bookmark?.selectedType) return;
        switch (bookmark.selectedType) {
          case "planet":
            selectPlanet(bookmark.selectedObject);
            break;
          case "star":
            selectStar(bookmark.selectedObject);
            break;
          case "constellation":
            selectConstellation(bookmark.selectedObject);
            break;
        }
        router.push("/");
        return;
      }

      const raw = detailByTab[tab]?.[id];
      if (!raw) {
        const catalogItem = catalog[tab]?.find((c) => c.id === id);
        if (!catalogItem) return;
        const fallback: LibraryDetailItem = {
          id: catalogItem.id,
          title: catalogItem.title,
          type: catalogItem.type,
          description: t("noContent"),
          stats: catalogItem.stats ?? [],
        };
        if (catalogItem.accentColor)
          fallback.accentColor = catalogItem.accentColor;
        setDetailItem(fallback);
        cosmicEventBus.emit({
          type: "library_accessed",
          payload: { itemId: id },
        });
        return;
      }

      setDetailItem(resolveLocaleDetail(raw));
      cosmicEventBus.emit({
        type: "library_accessed",
        payload: { itemId: id },
      });
    },
    [
      tab,
      bookmarks,
      selectPlanet,
      selectStar,
      selectConstellation,
      router,
      t,
      resolveLocaleDetail,
    ],
  );

  const handleExplore = useCallback(
    (id: string, type: LibraryItemType) => {
      setDetailItem(null);
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

  return (
    <AppShell breadcrumb={t("title").toUpperCase()}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <header>
          <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
          <p className="mt-1 text-white/50">{t("subtitle")}</p>
        </header>

        <LibraryTabs
          active={tab}
          bookmarkCount={bookmarks.length}
          onChange={setTab}
        />

        {tab === "bookmarks" ? (
          bookmarks.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-cosmic-nebula/20 p-6 text-center text-white/40">
              {t("empty.bookmarks")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {bookmarks.map((b) => (
                <LibraryCard
                  key={b.id}
                  id={b.id}
                  title={b.name}
                  subtitle={b.scale}
                  type={(b.selectedType as LibraryItemType | null) ?? "planet"}
                  accentColor="#7cb9ff"
                  stats={[
                    { label: "day", value: `+${Math.round(b.dayOffset)}` },
                  ]}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )
        ) : (
          <CatalogGrid
            items={visible}
            emptyLabel={t(`empty.${tab}`)}
            onSelect={handleSelect}
          />
        )}
      </div>

      <SlidePanel
        isOpen={detailItem != null}
        onClose={() => setDetailItem(null)}
        closeAriaLabel={tc("bookmarks.cancel")}
        panelRef={panelRef}
      >
        {detailItem ? (
          <LibraryDetail
            item={detailItem}
            onExplore={handleExplore}
            onClose={() => setDetailItem(null)}
          />
        ) : null}
      </SlidePanel>
    </AppShell>
  );
}
