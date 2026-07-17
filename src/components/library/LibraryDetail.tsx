"use client";

import { useTranslations } from "next-intl";
import type { LibraryItemType } from "./LibraryCard";
import { Stat } from "@/components/ui/Stat";
import { PlanetSphere } from "./PlanetSphere";

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
}

export interface LibraryDetailProps {
  item: LibraryDetailItem;
  onExplore: (id: string, type: LibraryItemType) => void;
  onClose: () => void;
}

export function LibraryDetail({
  item,
  onExplore,
  onClose,
}: LibraryDetailProps) {
  const t = useTranslations("common.library");
  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex items-start gap-4">
        {item.textureUrl ? (
          <PlanetSphere url={item.textureUrl} />
        ) : (
          <span
            className="mt-1 h-4 w-4 rounded-full"
            style={{ backgroundColor: item.accentColor ?? "#4a9eff" }}
            aria-hidden
          />
        )}
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-cosmic-accent">
            {t(
              `tabs.${item.type === "dwarfPlanet" ? "dwarfPlanets" : `${item.type}s`}`,
            )}
          </p>
          <h2 className="text-2xl font-bold text-white">{item.title}</h2>
        </div>
      </header>

      <section>
        <h3 className="mb-2 text-xs uppercase tracking-wider text-white/40">
          {t("sections.description")}
        </h3>
        <p className="text-white/80">{item.description ?? t("noContent")}</p>
      </section>

      {item.stats.length > 0 ? (
        <section>
          <h3 className="mb-2 text-xs uppercase tracking-wider text-white/40">
            {t("sections.physicalData")}
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {item.stats.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </section>
      ) : null}

      {item.facts && item.facts.length > 0 ? (
        <section>
          <h3 className="mb-2 text-xs uppercase tracking-wider text-white/40">
            {t("sections.facts")}
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-white/80">
            {item.facts.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {item.mythology ? (
        <section>
          <h3 className="mb-2 text-xs uppercase tracking-wider text-white/40">
            {t("sections.mythology")}
          </h3>
          <p className="italic text-white/80">{item.mythology}</p>
        </section>
      ) : null}

      <footer className="mt-auto flex justify-end gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5"
        >
          {t("close")}
        </button>
        <button
          type="button"
          onClick={() => onExplore(item.id, item.type)}
          className="rounded bg-cosmic-accent px-4 py-2 text-sm font-medium text-cosmic-deep transition hover:bg-cosmic-glow"
        >
          {t("explore3d")}
        </button>
      </footer>
    </div>
  );
}
