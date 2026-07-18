"use client";

import { useTranslations } from "next-intl";

export type LibraryItemType =
  "planet" | "dwarfPlanet" | "star" | "constellation";

export interface LibraryCardStats {
  label: string;
  value: string;
}

export interface LibraryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  type: LibraryItemType;
  accentColor?: string;
  textureUrl?: string;
  stats?: LibraryCardStats[];
  onSelect: (id: string, type: LibraryItemType) => void;
  disabled?: boolean;
}

export function LibraryCard({
  id,
  title,
  subtitle,
  type,
  accentColor,
  textureUrl,
  stats = [],
  onSelect,
  disabled,
}: LibraryCardProps) {
  const t = useTranslations("common.library");
  const fallbackColor = "#4a9eff";
  const color = accentColor ?? fallbackColor;

  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(id, type)}
      disabled={disabled}
      className={[
        "group relative flex aspect-[3/4] flex-col overflow-hidden rounded-2xl border border-white/5 bg-cosmic-black/40 text-left transition-all duration-300 ease-out",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:-translate-y-1 hover:border-cosmic-accent/40 hover:shadow-2xl hover:shadow-cosmic-accent/20 active:scale-[0.98]",
      ].join(" ")}
      aria-label={`${t(`tabs.${type === "dwarfPlanet" ? "dwarfPlanets" : `${type}s`}`)}: ${title}`}
    >
      <div
        className={
          textureUrl
            ? "relative flex flex-1 items-center justify-center overflow-hidden bg-cosmic-black/80"
            : "relative flex flex-1 items-center justify-center overflow-hidden"
        }
      >
        {textureUrl ? (
          <>
            <img
              src={textureUrl}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-cosmic-black/80 to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-cosmic-black/60 to-transparent"
            />
          </>
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-4 rounded-full border border-dashed border-white/10 transition-transform duration-700 ease-out group-hover:rotate-180"
            />
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-2xl transition-transform duration-500 ease-out group-hover:scale-110"
              style={{ backgroundColor: color }}
            />
            <div
              aria-hidden
              className="relative h-12 w-12 rounded-full transition-transform duration-500 ease-out group-hover:scale-110"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 24px ${color}80, inset 0 0 12px ${color}cc`,
              }}
            />
          </>
        )}
        <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-cosmic-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90 backdrop-blur">
          {t(`tabs.${type === "dwarfPlanet" ? "dwarfPlanets" : `${type}s`}`)}
        </span>
      </div>
      <div className="flex flex-col gap-0.5 border-t border-white/5 p-4">
        <p className="line-clamp-1 text-base font-semibold leading-tight text-white">
          {title}
        </p>
        {subtitle ? (
          <p className="line-clamp-1 text-xs text-white/50">{subtitle}</p>
        ) : null}
        {stats.length > 0 ? (
          <p className="mt-1 line-clamp-1 text-[11px] text-cosmic-glow/80">
            {stats
              .slice(0, 3)
              .map((s) => s.value)
              .join(" · ")}
          </p>
        ) : null}
      </div>
    </button>
  );
}
