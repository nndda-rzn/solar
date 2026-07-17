"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSettings } from "@/hooks/useSettings";

export function SettingsForm() {
  const t = useTranslations("common");
  const perfMode = useSettings((s) => s.perfMode);
  const setPerfMode = useSettings((s) => s.setPerfMode);
  const muted = useSettings((s) => s.muted);
  const setMuted = useSettings((s) => s.setMuted);
  const volume = useSettings((s) => s.volume);
  const setVolume = useSettings((s) => s.setVolume);
  const ambientEnabled = useSettings((s) => s.ambientEnabled);
  const setAmbientEnabled = useSettings((s) => s.setAmbientEnabled);

  return (
    <div className="space-y-6">
      {/* Performance Mode */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/40">
          {t("settings.perfMode")}
        </p>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => setPerfMode("high")}
            className={`w-full rounded-xl border p-3 text-left transition-colors ${
              perfMode === "high"
                ? "border-cosmic-accent/40 bg-cosmic-accent/20 text-cosmic-accent"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white/70"
            }`}
          >
            <span className="block text-sm font-medium">
              {t("settings.highQuality")}
            </span>
            <span className="mt-0.5 block text-xs opacity-70">
              {t("settings.highQualityDesc")}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setPerfMode("low")}
            className={`w-full rounded-xl border p-3 text-left transition-colors ${
              perfMode === "low"
                ? "border-cosmic-accent/40 bg-cosmic-accent/20 text-cosmic-accent"
                : "border-white/10 bg-white/5 text-white/50 hover:text-white/70"
            }`}
          >
            <span className="block text-sm font-medium">
              {t("settings.lowQuality")}
            </span>
            <span className="mt-0.5 block text-xs opacity-70">
              {t("settings.lowQualityDesc")}
            </span>
          </button>
        </div>
      </div>

      {/* Audio */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          {t("settings.audio")}
        </p>
        <div className="space-y-3">
          {/* Mute toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">{t("settings.mute")}</span>
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                muted
                  ? "bg-cosmic-accent/20 text-cosmic-accent"
                  : "bg-white/5 text-white/30"
              }`}
              aria-label={t("settings.mute")}
            >
              {muted ? (
                <VolumeX className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
              {muted ? t("settings.on") : t("settings.off")}
            </button>
          </div>

          {/* Volume slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/70">
                {t("settings.volume")}
              </span>
              <span className="text-xs text-white/40">
                {Math.round(volume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              disabled={muted}
              aria-label={t("settings.volume")}
              className="slider w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cosmic-glow disabled:opacity-30"
            />
          </div>

          {/* Ambient toggle */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/70">
              {t("settings.ambient")}
            </span>
            <button
              type="button"
              onClick={() => setAmbientEnabled(!ambientEnabled)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                ambientEnabled
                  ? "bg-cosmic-accent/20 text-cosmic-accent"
                  : "bg-white/5 text-white/30"
              }`}
            >
              {ambientEnabled ? t("settings.on") : t("settings.off")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
