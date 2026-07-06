"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useSettings } from "@/hooks/useSettings";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export function SettingsModal() {
  const t = useTranslations("common");
  const isSettingsOpen = useExplorerStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useExplorerStore((s) => s.setSettingsOpen);
  const perfMode = useSettings((s) => s.perfMode);
  const setPerfMode = useSettings((s) => s.setPerfMode);

  const modalRef = useFocusTrap(isSettingsOpen);

  function close() {
    setSettingsOpen(false);
  }

  useEffect(() => {
    if (!isSettingsOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen]);

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            ref={modalRef as React.RefObject<HTMLDivElement>}
            role="dialog"
            aria-modal="true"
            aria-label={t("settings.title")}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-2xl border border-white/10 bg-cosmic-deep/95 p-6 backdrop-blur-md"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-cosmic-accent" />
              <h2 className="text-lg font-bold text-white">
                {t("settings.title")}
              </h2>
            </div>

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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
