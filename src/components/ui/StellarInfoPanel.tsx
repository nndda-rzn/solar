"use client";

import { useExplorerStore } from "@/lib/store/explorer-store";
import { useStarData } from "@/hooks/data/useStarData";
import { useConstellationData } from "@/hooks/data/useConstellationData";
import { X, Star as StarIcon, Sparkles } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function StellarInfoPanel() {
  const t = useTranslations("stellar");
  const locale = useLocale();
  const {
    selectedStar,
    selectStar,
    selectedConstellation,
    selectConstellation,
    setCameraTarget,
  } = useExplorerStore();
  const { getStarById } = useStarData();
  const { getConstellationById } = useConstellationData();

  const star = selectedStar ? getStarById(selectedStar) : undefined;
  const constellation = selectedConstellation
    ? getConstellationById(selectedConstellation)
    : undefined;

  const isOpen = !!star || !!constellation;

  function handleClose() {
    selectStar(null);
    selectConstellation(null);
    setCameraTarget(null);
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-96 flex-col overflow-y-auto border-l border-white/10 bg-black/80 backdrop-blur-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } pointer-events-auto`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Star Info */}
        {star && (
          <div className="flex flex-col gap-6 p-6 pt-14">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: star.color }}>
                {star.name}
              </h2>
              <p className="mt-1 text-sm text-white/50">
                {star.content[locale as "en" | "id"].description}
              </p>
            </div>

            <hr className="border-white/10" />

            {/* Star Properties */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                <StarIcon className="h-4 w-4 text-cosmic-accent" />
                Star Properties
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Stat
                  label={t("stats.magnitude")}
                  value={star.magnitude.toFixed(2)}
                />
                <Stat
                  label={t("stats.spectralType")}
                  value={star.spectralType}
                />
                <Stat
                  label={t("stats.distance")}
                  value={`${star.distance} ly`}
                />
                <Stat label={t("stats.hip")} value={star.hip.toString()} />
              </div>
            </section>

            <hr className="border-white/10" />

            {/* Fun Facts */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                <Sparkles className="h-4 w-4 text-cosmic-accent" />
                Facts
              </div>
              <ul className="flex flex-col gap-2">
                {star.content[locale as "en" | "id"].facts.map((fact, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-white/50"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cosmic-accent" />
                    {fact}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {/* Constellation Info */}
        {constellation && (
          <div className="flex flex-col gap-6 p-6 pt-14">
            <div>
              <h2 className="text-2xl font-bold text-cosmic-accent">
                {locale === "id"
                  ? constellation.indonesianName
                  : constellation.name}
              </h2>
              <p className="mt-1 text-sm text-white/50">
                {constellation.content[locale as "en" | "id"].description}
              </p>
            </div>

            <hr className="border-white/10" />

            {/* Mythology */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                <Sparkles className="h-4 w-4 text-cosmic-accent" />
                {t("constellation.mythology")}
              </div>
              <p className="text-sm leading-relaxed text-white/50">
                {constellation.content[locale as "en" | "id"].mythology}
              </p>
            </section>

            <hr className="border-white/10" />

            {/* Member Stars */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                <StarIcon className="h-4 w-4 text-cosmic-accent" />
                {t("constellation.memberStars")}
              </div>
              <div className="flex flex-wrap gap-2">
                {constellation.stars.map((starId) => (
                  <button
                    key={starId}
                    onClick={() => {
                      selectConstellation(null);
                      selectStar(starId);
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-cosmic-accent hover:text-cosmic-accent"
                  >
                    {starId}
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}
      </aside>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-white/40">{label}</span>
      <span className="font-medium text-white/70">{value}</span>
    </div>
  );
}
