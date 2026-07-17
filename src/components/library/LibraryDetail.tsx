"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import type { LibraryItemType } from "./LibraryCard";
import { PlanetSphere } from "./PlanetSphere";
import { StarIllustration } from "./StarIllustration";
import { ConstellationMap } from "./ConstellationMap";

export interface LibraryDetailItem {
  id: string;
  title: string;
  type: LibraryItemType;
  accentColor?: string;
  textureUrl?: string;
  description?: string;
  facts?: string[];
  mythology?: string;
  stats: Array<{ label: string; value: string }>;
  // Star-specific
  magnitude?: number;
  spectralType?: string;
  // Constellation-specific
  canvasStars?: Array<{
    id: string;
    name: string;
    magnitude: number;
    type: string;
    color: string;
    x: number;
    y: number;
  }>;
  lines?: Array<{ from: string; to: string }>;
}

export interface LibraryDetailProps {
  item: LibraryDetailItem;
  onExplore: (id: string, type: LibraryItemType) => void;
  onClose: () => void;
}

// Reference values for normalization
const NEPTUNE_PERIOD = 164.8 * 365; // days
const NEPTUNE_DISTANCE = 30.07; // AU
const SATURN_MOONS = 83;
const JUPITER_RADIUS = 71492; // km

function StatBar({
  label,
  value,
  percent,
  color = "bg-cosmic-accent",
}: {
  label: string;
  value: string;
  percent?: number | undefined;
  color?: string | undefined;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/40">{label}</span>
        <span className="text-xs font-medium text-white/90">{value}</span>
      </div>
      {percent !== undefined && (
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
          <div
            className={`h-full rounded-full ${color} transition-all duration-700`}
            style={{ width: `${Math.max(2, Math.min(100, percent))}%` }}
          />
        </div>
      )}
    </div>
  );
}

function parseNumericStat(value: string): number | null {
  const match = value.match(/^[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function getStatPercent(
  label: string,
  value: string,
): { percent: number; color: string } | undefined {
  const lower = label.toLowerCase();
  const num = parseNumericStat(value);
  if (num === null) return undefined;

  if (lower.includes("orbital") || lower.includes("period")) {
    return {
      percent: Math.min(100, (num / NEPTUNE_PERIOD) * 100),
      color: "bg-cosmic-accent",
    };
  }
  if (lower.includes("distance")) {
    const logPct =
      (Math.log(Math.max(1, num)) / Math.log(Math.max(1, NEPTUNE_DISTANCE))) *
      100;
    return { percent: Math.min(100, logPct), color: "bg-cosmic-accent" };
  }
  if (lower.includes("moon")) {
    return {
      percent: (num / SATURN_MOONS) * 100,
      color: "bg-cosmic-glow",
    };
  }
  if (lower.includes("radius")) {
    return {
      percent: Math.min(100, (num / JUPITER_RADIUS) * 100),
      color: "bg-cosmic-warm",
    };
  }
  if (lower.includes("magnitude")) {
    // Inverse: smaller = brighter = fuller bar
    const pct = Math.max(0, ((6 - num) / 8) * 100);
    return { percent: pct, color: "bg-yellow-400/80" };
  }
  return undefined;
}

function FactItem({
  fact,
  defaultOpen,
}: {
  fact: string;
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left"
    >
      <div className="flex items-start gap-2 py-2 border-b border-white/[0.06] last:border-0">
        <ChevronDown
          className={`h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-white/30 transition-transform duration-200 ${open ? "rotate-0" : "-rotate-90"}`}
        />
        <p
          className={`text-sm leading-relaxed transition-colors ${open ? "text-white/75" : "text-white/40"}`}
        >
          {fact}
        </p>
      </div>
    </button>
  );
}

export function LibraryDetail({
  item,
  onExplore,
  onClose,
}: LibraryDetailProps) {
  const t = useTranslations("common.library");
  const [showAllFacts, setShowAllFacts] = useState(false);

  const visibleFacts = showAllFacts
    ? (item.facts ?? [])
    : (item.facts ?? []).slice(0, 3);
  const hiddenCount = (item.facts?.length ?? 0) - 3;

  return (
    <div className="flex flex-col h-full">
      {/* Hero visual */}
      <div
        className="relative flex items-center justify-center overflow-hidden bg-cosmic-black/60"
        style={{ minHeight: 180 }}
      >
        {/* Background tint */}
        <div
          className="absolute inset-0"
          style={{
            background: item.accentColor
              ? `radial-gradient(ellipse 80% 70% at 50% 80%, ${item.accentColor}0a 0%, transparent 70%)`
              : undefined,
          }}
        />
        {item.type === "planet" || item.type === "dwarfPlanet" ? (
          item.textureUrl ? (
            <div className="relative z-10 py-6">
              <PlanetSphere url={item.textureUrl} />
            </div>
          ) : (
            <div
              className="relative z-10 h-20 w-20 rounded-full my-8"
              style={{
                backgroundColor: item.accentColor ?? "#4a9eff",
                boxShadow: `0 0 40px ${item.accentColor ?? "#4a9eff"}60`,
              }}
            />
          )
        ) : item.type === "star" ? (
          <div className="relative z-10 py-4">
            <StarIllustration
              color={item.accentColor ?? "#9db4ff"}
              magnitude={item.magnitude ?? 2}
              spectralType={item.spectralType}
              size="md"
            />
          </div>
        ) : item.type === "constellation" &&
          item.canvasStars &&
          item.canvasStars.length > 0 ? (
          <div className="relative z-10 py-4 w-full flex items-center justify-center">
            <ConstellationMap
              canvasStars={item.canvasStars}
              lines={item.lines ?? []}
              width={280}
              height={160}
            />
          </div>
        ) : (
          <div
            className="relative z-10 h-16 w-16 rounded-full my-8"
            style={{ backgroundColor: item.accentColor ?? "#4a9eff" }}
          />
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cosmic-deep/90 to-transparent px-4 pb-3 pt-6">
          <p className="text-[10px] uppercase tracking-wider text-cosmic-accent font-medium">
            {t(
              `tabs.${item.type === "dwarfPlanet" ? "dwarfPlanets" : `${item.type}s`}`,
            )}
          </p>
          <h2 className="text-xl font-bold text-white leading-tight">
            {item.title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 overflow-y-auto flex-1 p-5">
        {/* Description */}
        {item.description && (
          <section>
            <h3 className="mb-2 text-[10px] uppercase tracking-wider text-white/30 font-semibold">
              {t("sections.description")}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed">
              {item.description}
            </p>
          </section>
        )}

        {/* Physical data with stat bars */}
        {item.stats.length > 0 && (
          <section>
            <h3 className="mb-3 text-[10px] uppercase tracking-wider text-white/30 font-semibold">
              {t("sections.physicalData")}
            </h3>
            <div className="space-y-3">
              {item.stats.map((s) => {
                const barInfo = getStatPercent(s.label, s.value);
                return (
                  <StatBar
                    key={s.label}
                    label={s.label}
                    value={s.value}
                    percent={barInfo?.percent}
                    color={barInfo?.color}
                  />
                );
              })}
            </div>
          </section>
        )}

        {/* Facts accordion */}
        {item.facts && item.facts.length > 0 && (
          <section>
            <h3 className="mb-2 text-[10px] uppercase tracking-wider text-white/30 font-semibold">
              {t("sections.facts")}
            </h3>
            <div>
              {visibleFacts.map((fact, i) => (
                <FactItem key={i} fact={fact} defaultOpen={i === 0} />
              ))}
              {hiddenCount > 0 && !showAllFacts && (
                <button
                  type="button"
                  onClick={() => setShowAllFacts(true)}
                  className="mt-2 text-xs text-cosmic-accent hover:text-cosmic-glow transition-colors"
                >
                  + {hiddenCount} more
                </button>
              )}
            </div>
          </section>
        )}

        {/* Mythology */}
        {item.mythology && (
          <section>
            <h3 className="mb-2 text-[10px] uppercase tracking-wider text-white/30 font-semibold">
              {t("sections.mythology")}
            </h3>
            <p className="text-sm italic text-white/60 leading-relaxed">
              {item.mythology}
            </p>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="flex justify-end gap-2 border-t border-white/[0.06] p-4 flex-shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 hover:text-white/80"
        >
          {t("close")}
        </button>
        <button
          type="button"
          onClick={() => onExplore(item.id, item.type)}
          className="rounded-lg bg-cosmic-accent px-4 py-2 text-sm font-medium text-cosmic-deep transition-colors hover:bg-cosmic-glow"
        >
          {t("explore3d")}
        </button>
      </footer>
    </div>
  );
}
