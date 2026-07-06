"use client";

import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useSettings } from "@/hooks/useSettings";
import { ModalBase } from "./ModalBase";

export function SettingsModal() {
  const t = useTranslations("common");
  const isSettingsOpen = useExplorerStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useExplorerStore((s) => s.setSettingsOpen);
  const perfMode = useSettings((s) => s.perfMode);
  const setPerfMode = useSettings((s) => s.setPerfMode);

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
      <div className="space-y-4">
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
      </div>
    </ModalBase>
  );
}
