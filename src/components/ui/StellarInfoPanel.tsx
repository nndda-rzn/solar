"use client";

import { useEffect } from "react";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useStarData } from "@/hooks/data/useStarData";
import { useConstellationData } from "@/hooks/data/useConstellationData";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Star as StarIcon, Sparkles } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import * as THREE from "three";
import { Stat } from "./Stat";
import { SlidePanel } from "./SlidePanel";

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

  useEffect(() => {
    if (!selectedStar) return;
    cosmicEventBus.emit({
      type: "star_visited",
      payload: { id: selectedStar },
    });
    cosmicEventBus.emit({
      type: "panel_opened",
      payload: { id: selectedStar, panelType: "star" },
    });
  }, [selectedStar]);

  useEffect(() => {
    if (!selectedConstellation) return;
    cosmicEventBus.emit({
      type: "constellation_visited",
      payload: { id: selectedConstellation },
    });
    cosmicEventBus.emit({
      type: "panel_opened",
      payload: { id: selectedConstellation, panelType: "constellation" },
    });
  }, [selectedConstellation]);

  function handleClose() {
    selectStar(null);
    selectConstellation(null);
    setCameraTarget(null);
  }

  const panelRef = useFocusTrap(isOpen);

  return (
    <SlidePanel
      isOpen={isOpen}
      onClose={handleClose}
      ariaLabel={star?.name ?? constellation?.name}
      closeAriaLabel="Close"
      panelRef={panelRef}
    >
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
              {t("starProperties")}
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <Stat
                label={t("stats.magnitude")}
                value={star.magnitude.toFixed(2)}
              />
              <Stat label={t("stats.spectralType")} value={star.spectralType} />
              <Stat label={t("stats.distance")} value={`${star.distance} ly`} />
              <Stat label={t("stats.hip")} value={star.hip.toString()} />
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Fun Facts */}
          <section>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
              <Sparkles className="h-4 w-4 text-cosmic-accent" />
              {t("facts")}
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
              {constellation.stars.map((starId) => {
                const memberStar = getStarById(starId);
                return (
                  <button
                    key={starId}
                    onClick={() => {
                      selectConstellation(null);
                      selectStar(starId);
                      if (memberStar) {
                        setCameraTarget(
                          new THREE.Vector3(
                            memberStar.x,
                            memberStar.y,
                            memberStar.z,
                          ),
                        );
                      }
                    }}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-colors hover:border-cosmic-accent hover:text-cosmic-accent"
                  >
                    {memberStar?.name ?? starId}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </SlidePanel>
  );
}
