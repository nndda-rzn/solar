"use client";

import { useSimulationStore } from "@/lib/store/simulation-store";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

const SPEED_ACHIEVEMENT_THRESHOLD = 86400;

const SPEED_PRESETS = [
  { key: "realtime", value: 1 },
  { key: "minPerSec", value: 60 },
  { key: "hourPerSec", value: 3600 },
  { key: "dayPerSec", value: 86400 },
  { key: "weekPerSec", value: 604800 },
  { key: "monthPerSec", value: 2592000 },
  { key: "yearPerSec", value: 31536000 },
] as const;

const JUMP_AMOUNTS = [
  { key: "back1Year", delta: -365 },
  { key: "back1Month", delta: -30 },
  { key: "today", delta: 0 },
  { key: "forward1Month", delta: 30 },
  { key: "forward1Year", delta: 365 },
] as const;

function formatDateTimeInput(dayOffset: number): string {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  const target = new Date(base.getTime() + dayOffset * 86400000);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(
    target.getDate(),
  )}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
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

  function handleSpeedChange(newSpeed: number) {
    setSpeed(newSpeed);
    if (newSpeed >= SPEED_ACHIEVEMENT_THRESHOLD) {
      cosmicEventBus.emit({
        type: "speed_reached",
        payload: { speed: newSpeed },
      });
    }
  }

  function handleJump(delta: number) {
    if (delta === 0) {
      setDayOffset(0);
    } else {
      setDayOffset(dayOffset + delta);
    }
  }

  return (
    <div className="pointer-events-auto fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-black/60 px-5 py-3 shadow-lg shadow-black/50 backdrop-blur-md">
        {/* Row 1: Play + Speed presets + Reset */}
        <div className="flex items-center gap-3">
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

          {/* Speed preset buttons */}
          <div className="flex items-center gap-1">
            {SPEED_PRESETS.map(({ key, value }) => {
              const active = speed === value;
              const label = t(`presets.${key}`);
              return (
                <button
                  key={key}
                  onClick={() => handleSpeedChange(value)}
                  className={`rounded-lg px-2.5 py-1.5 text-[10px] font-medium transition-colors ${
                    active
                      ? "bg-cosmic-accent/20 text-cosmic-accent"
                      : "text-white/40 hover:bg-white/5 hover:text-white/70"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <button
            onClick={reset}
            aria-label={t("reset")}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-all duration-200 hover:border-cosmic-accent/40 hover:bg-cosmic-accent/20 hover:text-cosmic-accent hover:shadow-[0_0_12px_rgba(74,158,255,0.25)] active:scale-95"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>

        {/* Row 2: Timeline scrub + datetime input */}
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
            type="datetime-local"
            value={formatDateTimeInput(dayOffset)}
            onChange={(e) => {
              if (e.target.value) {
                jumpToDate(new Date(e.target.value));
              }
            }}
            aria-label={t("dateJump")}
            className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
          />
        </div>

        {/* Row 3: Quick jump buttons */}
        <div className="flex items-center justify-center gap-1.5 border-t border-white/10 pt-3">
          {JUMP_AMOUNTS.map(({ key, delta }) => (
            <button
              key={key}
              onClick={() => handleJump(delta)}
              className={`rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/50 transition-colors hover:border-cosmic-accent/30 hover:bg-cosmic-accent/10 hover:text-cosmic-accent ${
                delta === 0 ? "text-cosmic-glow" : ""
              }`}
            >
              {t(`jump.${key}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
