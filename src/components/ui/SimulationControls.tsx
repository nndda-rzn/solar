"use client";

import { useSimulationStore } from "@/lib/store/simulation-store";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

const SPEED_ACHIEVEMENT_THRESHOLD = 10;

function formatDateInput(dayOffset: number): string {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const target = new Date(base.getTime() + dayOffset * 86400000);
  return target.toISOString().split("T")[0];
}

export function SimulationControls() {
  const t = useTranslations("simulation");
  const {
    isPlaying,
    togglePlay,
    speed,
    setSpeed,
    reset,
    dayOffset,
    setDayOffset,
    maxDayOffset,
    jumpToDate,
  } = useSimulationStore();

  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/60 px-5 py-3 shadow-lg shadow-black/50 backdrop-blur-md">
        {/* Row 1: Play / Speed / Reset */}
        <div className="flex items-center gap-3">
          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? t("pause") : t("play")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-200 hover:border-cosmic-accent/40 hover:bg-cosmic-accent/20 hover:text-cosmic-accent hover:shadow-[0_0_12px_rgba(74,158,255,0.25)] active:scale-95"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="ml-0.5 h-4 w-4" />
            )}
          </button>

          {/* Speed label + slider + value */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
              {t("speed")}
            </span>
            <input
              type="range"
              min={1}
              max={1000}
              step={1}
              value={speed}
              onChange={(e) => {
                const newSpeed = Number(e.target.value);
                setSpeed(newSpeed);
                if (newSpeed >= SPEED_ACHIEVEMENT_THRESHOLD) {
                  cosmicEventBus.emit({
                    type: "speed_reached",
                    payload: { speed: newSpeed },
                  });
                }
              }}
              aria-label="Simulation speed"
              className="slider w-40 cursor-pointer appearance-none rounded-full bg-white/10 accent-cosmic-accent md:w-56"
            />
            <span className="min-w-[4ch] text-center font-mono text-sm font-medium text-cosmic-glow">
              {speed}x
            </span>
          </div>

          {/* Reset */}
          <button
            onClick={reset}
            aria-label={t("reset")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-200 hover:border-cosmic-accent/40 hover:bg-cosmic-accent/20 hover:text-cosmic-accent hover:shadow-[0_0_12px_rgba(74,158,255,0.25)] active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Row 2: Timeline scrub */}
        <div className="flex items-center gap-3 border-t border-white/10 pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {t("timeline")}
          </span>
          <input
            type="range"
            min={0}
            max={maxDayOffset}
            step={1}
            value={dayOffset}
            onChange={(e) => setDayOffset(Number(e.target.value))}
            aria-label={t("timeline")}
            className="slider w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cosmic-glow"
          />
          <input
            type="date"
            value={formatDateInput(dayOffset)}
            onChange={(e) => {
              if (e.target.value) {
                jumpToDate(new Date(e.target.value));
              }
            }}
            aria-label={t("dateJump")}
            className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
          />
        </div>
      </div>
    </div>
  );
}
