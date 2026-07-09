"use client";

import { useTranslations } from "next-intl";

export type LibraryTab =
  "planets" | "dwarfPlanets" | "stars" | "constellations" | "bookmarks";

export interface LibraryTabsProps {
  active: LibraryTab;
  bookmarkCount: number;
  onChange: (tab: LibraryTab) => void;
}

export function LibraryTabs({
  active,
  bookmarkCount,
  onChange,
}: LibraryTabsProps) {
  const t = useTranslations("common.library");
  const tabs: Array<{ key: LibraryTab; labelKey: string; suffix?: number }> = [
    { key: "planets", labelKey: "tabs.planets" },
    { key: "dwarfPlanets", labelKey: "tabs.dwarfPlanets" },
    { key: "stars", labelKey: "tabs.stars" },
    { key: "constellations", labelKey: "tabs.constellations" },
    { key: "bookmarks", labelKey: "tabs.bookmarks", suffix: bookmarkCount },
  ];

  return (
    <div
      role="tablist"
      className="flex flex-wrap gap-2 border-b border-white/10 pb-3"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={[
              "rounded-lg px-4 py-2 text-sm transition",
              isActive
                ? "bg-cosmic-accent/20 text-cosmic-glow"
                : "text-white/60 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            {t(tab.labelKey)}
            {tab.suffix != null && tab.suffix > 0 ? (
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                {tab.suffix}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
