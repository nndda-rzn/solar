"use client";

import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/AppShell";
import { useSettings } from "@/hooks/useSettings";

export default function SettingsPage() {
  const t = useTranslations("common");
  const perfMode = useSettings((s) => s.perfMode);
  const setPerfMode = useSettings((s) => s.setPerfMode);

  return (
    <AppShell breadcrumb="SETTINGS">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">
          {t("settings.title")}
        </h1>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">
            {t("settings.perfMode")}
          </h2>
          <div className="space-y-3">
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
    </AppShell>
  );
}
