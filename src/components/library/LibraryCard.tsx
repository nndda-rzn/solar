"use client";

import { useTranslations } from "next-intl";

export type LibraryItemType =
  "planet" | "dwarfPlanet" | "star" | "constellation";

export interface LibraryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  type: LibraryItemType;
  accentColor?: string;
  stats?: Array<{ label: string; value: string }>;
  onSelect: (id: string, type: LibraryItemType) => void;
  disabled?: boolean;
}

export function LibraryCard({
  id,
  title,
  subtitle,
  type,
  accentColor,
  stats = [],
  onSelect,
  disabled,
}: LibraryCardProps) {
  const t = useTranslations("common.library");
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(id, type)}
      disabled={disabled}
      className={[
        "group flex flex-col gap-3 rounded-xl border border-white/10 bg-cosmic-nebula/50 p-4 text-left transition-all",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-cosmic-accent/40 hover:bg-cosmic-nebula/70 active:scale-[0.98]",
      ].join(" ")}
      style={accentColor ? { borderLeftColor: accentColor } : undefined}
      aria-label={`${t(`tabs.${type === "dwarfPlanet" ? "dwarfPlanets" : `${type}s`}`)}: ${title}`}
    >
      <div className="flex h-8 items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: accentColor ?? "#4a9eff" }}
        />
        <span className="text-xs uppercase tracking-wider text-white/50">
          {t(`tabs.${type === "dwarfPlanet" ? "dwarfPlanets" : `${type}s`}`)}
        </span>
      </div>
      <div>
        <h3 className="line-clamp-1 text-lg font-semibold text-white">
          {title}
        </h3>
        {subtitle ? (
          <p className="line-clamp-1 text-sm text-white/50">{subtitle}</p>
        ) : null}
      </div>
      {stats.length > 0 ? (
        <dl className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-xs">
          {stats.slice(0, 3).map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="text-white/40">{s.label}</dt>
              <dd className="truncate text-white/80">{s.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </button>
  );
}
