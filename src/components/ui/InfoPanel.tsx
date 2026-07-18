"use client";

import { useEffect } from "react";
import { useSelectionStore } from "@/lib/store/selection-store";
import { useCameraStore } from "@/lib/store/camera-store";
import { usePlanetData } from "@/hooks/data/usePlanetData";
import { useDwarfPlanetData } from "@/hooks/data/useDwarfPlanetData";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { X, Settings, Globe, BookOpen, Lightbulb } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function InfoPanel() {
  const t = useTranslations("infoPanel");
  const locale = useLocale() as "en" | "id";
  const selectedPlanet = useSelectionStore((s) => s.selectedPlanet);
  const selectPlanet = useSelectionStore((s) => s.selectPlanet);
  const setCameraTarget = useCameraStore((s) => s.setCameraTarget);
  const { getPlanetBySlug } = usePlanetData();
  const { getDwarfPlanetBySlug } = useDwarfPlanetData();

  const planetData = selectedPlanet
    ? getPlanetBySlug(selectedPlanet)
    : undefined;
  const dwarfPlanet =
    !planetData && selectedPlanet
      ? getDwarfPlanetBySlug(selectedPlanet)
      : undefined;
  const planet = planetData ?? dwarfPlanet;
  const isOpen = !!planet;
  const isDwarfPlanet = !!dwarfPlanet;

  useEffect(() => {
    if (!selectedPlanet) return;
    const panelType = isDwarfPlanet ? "dwarf" : "planet";
    cosmicEventBus.emit({
      type: "panel_opened",
      payload: { id: selectedPlanet, panelType },
    });
    cosmicEventBus.emit({
      type: "planet_visited",
      payload: { id: selectedPlanet },
    });
  }, [selectedPlanet, isDwarfPlanet]);

  const getDescription = () => {
    if (!planet) return "";
    const localeContent = planet.content?.[locale];
    return localeContent?.description ?? planet.description;
  };

  const getFunFacts = (): string[] => {
    if (!planet) return [];
    const localeContent = planet.content?.[locale];
    return localeContent?.facts ?? planet.funFacts;
  };

  function handleClose() {
    selectPlanet(null);
    setCameraTarget(null);
  }

  const panelRef = useFocusTrap(isOpen);

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
        ref={panelRef as React.RefObject<HTMLElement>}
        role="dialog"
        aria-modal={isOpen}
        aria-label={planet?.name}
        className={`fixed right-0 top-0 z-50 flex h-full w-96 flex-col overflow-y-auto border-l border-white/10 bg-black/80 backdrop-blur-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } pointer-events-auto`}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          aria-label={t("close")}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {planet && (
          <div className="flex flex-col gap-6 p-6 pt-14">
            {/* Header */}
            <div>
              <h2
                className="text-2xl font-bold"
                style={{ color: planet.color }}
              >
                {planet.name}
              </h2>
              <p className="mt-1 text-sm text-white/50">{getDescription()}</p>
            </div>

            <hr className="border-white/10" />

            {/* Physical Properties */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                <Settings className="h-4 w-4 text-cosmic-accent" />
                {t("physicalProperties")}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Stat
                  label={t("stats.radius")}
                  value={`${planet.radius.toLocaleString()} km`}
                />
                <Stat label={t("stats.mass")} value={planet.mass} />
                <Stat
                  label={t("stats.temperature")}
                  value={planet.temperature}
                />
                <Stat
                  label={t("stats.moonCount")}
                  value={String(planet.moonCount)}
                />
              </div>
            </section>

            <hr className="border-white/10" />

            {/* Orbital Properties */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                <Globe className="h-4 w-4 text-cosmic-accent" />
                {t("orbitalProperties")}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Stat
                  label={t("stats.distance")}
                  value={`${planet.distance} AU`}
                />
                <Stat
                  label={t("stats.period")}
                  value={`${planet.orbitalPeriod.toLocaleString()} days`}
                />
                <Stat label={t("stats.tilt")} value={`${planet.tilt}°`} />
              </div>
            </section>

            <hr className="border-white/10" />

            {/* Discovery */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                <BookOpen className="h-4 w-4 text-cosmic-accent" />
                {t("discovery")}
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <Stat
                  label={t("stats.rotationSpeed")}
                  value={`${planet.rotationSpeed}`}
                />
                <Stat label={t("stats.tilt")} value={`${planet.tilt}°`} />
                <Stat
                  label={t("stats.hasRing")}
                  value={
                    "hasRing" in planet
                      ? planet.hasRing
                        ? t("yes")
                        : t("no")
                      : "—"
                  }
                />
                <Stat
                  label={t("stats.hasAtmosphere")}
                  value={
                    "hasAtmosphere" in planet
                      ? planet.hasAtmosphere
                        ? t("yes")
                        : t("no")
                      : "—"
                  }
                />
              </div>
            </section>

            <hr className="border-white/10" />

            {/* Fun Facts */}
            <section>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white/70">
                <Lightbulb className="h-4 w-4 text-cosmic-accent" />
                {t("funFacts")}
              </div>
              <ul className="flex flex-col gap-2">
                {getFunFacts().map((fact) => (
                  <li
                    key={fact}
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
