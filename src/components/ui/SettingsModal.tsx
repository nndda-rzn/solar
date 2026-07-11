"use client";

import { SlidersHorizontal, Volume2, VolumeX } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/lib/store/ui-store";
import { useSettings } from "@/hooks/useSettings";
import { ModalBase } from "./ModalBase";

export function SettingsModal() {
  const t = useTranslations("common");
  const isSettingsOpen = useUIStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);
  const perfMode = useSettings((s) => s.perfMode);
  const setPerfMode = useSettings((s) => s.setPerfMode);
  const muted = useSettings((s) => s.muted);
  const setMuted = useSettings((s) => s.setMuted);
  const volume = useSettings((s) => s.volume);
  const setVolume = useSettings((s) => s.setVolume);
  const ambientEnabled = useSettings((s) => s.ambientEnabled);
  const setAmbientEnabled = useSettings((s) => s.setAmbientEnabled);

  function close() {
    setSettingsOpen(false);
  }

  return (
    <ModalBase
      isOpen={isSettingsOpen}
      onClose={close}
      ariaLabel={t("settings.title")}
      icon={<SlidersHorizontal className="h-5 w-5 text-cosmic-accent" />}
      title={t("settings.title")}
    >
      <div className="space-y-6">
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

        <div className="border-t border-white/10 pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            {t("settings.audio")}
          </p>

          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-white/70">{t("settings.muted")}</span>
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              aria-label={muted ? t("settings.unmute") : t("settings.mute")}
              className={`rounded-lg p-1.5 transition-colors ${
                muted
                  ? "bg-white/5 text-white/30"
                  : "bg-cosmic-accent/10 text-cosmic-accent"
              }`}
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="mb-3">
            <label className="mb-1 block text-sm text-white/70">
              {t("settings.volume")}
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
              disabled={muted}
              aria-label={t("settings.volume")}
              className="slider w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cosmic-glow disabled:opacity-30"
            />
          </div>

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
    </ModalBase>
  );
}
