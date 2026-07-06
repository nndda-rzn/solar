"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Loader2, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/useToast";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { SCALES } from "@/config/scales";
import type { CameraState } from "@/types/bookmark";

function formatSimDate(dayOffset: number): string {
  const base = new Date();
  const simTime = new Date(base.getTime() + dayOffset * 86400000);
  const day = simTime.getDate().toString().padStart(2, "0");
  const month = simTime.toLocaleString("en-US", { month: "short" });
  const year = simTime.getFullYear();
  return `${day} ${month} ${year}`;
}

export function BookmarkSaveModal() {
  const t = useTranslations("common");
  const {
    isBookmarkModalOpen,
    setBookmarkModalOpen,
    cameraPosition,
    cameraTarget,
    selectedPlanet,
    selectedStar,
    selectedConstellation,
    scale,
  } = useExplorerStore();
  const dayOffset = useSimulationStore((s) => s.dayOffset);
  const { create } = useBookmarks();
  const { push } = useToast();

  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const trimmed = name.trim();
  const isValid = trimmed.length >= 1 && trimmed.length <= 50;
  const hasCamera = cameraPosition !== null;
  const canSave = isValid && hasCamera && !isSaving;

  const selectedObject =
    selectedPlanet ?? selectedStar ?? selectedConstellation;
  const selectedType: "planet" | "star" | "constellation" | null =
    selectedPlanet
      ? "planet"
      : selectedStar
        ? "star"
        : selectedConstellation
          ? "constellation"
          : null;

  function reset() {
    setName("");
    setIsSaving(false);
  }

  function close() {
    setBookmarkModalOpen(false);
    reset();
  }

  async function handleSave() {
    if (!canSave || !cameraPosition) return;
    setIsSaving(true);

    const cameraPos: CameraState = {
      x: cameraPosition.x,
      y: cameraPosition.y,
      z: cameraPosition.z,
    };
    const camTarget: CameraState | null = cameraTarget
      ? { x: cameraTarget.x, y: cameraTarget.y, z: cameraTarget.z }
      : null;

    const created = await create({
      name: trimmed,
      cameraPosition: cameraPos,
      cameraTarget: camTarget,
      selectedObject,
      selectedType,
      dayOffset,
      scale,
      thumbnailUrl: "",
    });

    setIsSaving(false);

    if (created) {
      cosmicEventBus.emit({
        type: "bookmark_saved",
        payload: { id: created.id },
      });
      push({ title: t("toast.bookmarkSaved"), variant: "info" });
    }

    close();
  }

  return (
    <AnimatePresence>
      {isBookmarkModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-xl border border-white/10 bg-cosmic-deep/90 p-6"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-cosmic-accent" />
              <h2 className="text-lg font-bold text-white">
                {t("bookmarks.save")}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("bookmarks.namePlaceholder")}
                  disabled={isSaving}
                  maxLength={60}
                  autoFocus
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
                />
                {!isValid && name.length > 0 && (
                  <p className="mt-1 text-xs text-red-400">
                    1–50 characters required
                  </p>
                )}
              </div>

              <div className="space-y-1.5 rounded-lg border border-white/10 bg-white/5 p-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/40">{t("bookmarks.scale")}</span>
                  <span className="text-white/70">{SCALES[scale].label}</span>
                </div>
                {selectedObject && (
                  <div className="flex justify-between">
                    <span className="text-white/40">
                      {t("header.bookmark")}
                    </span>
                    <span className="max-w-[200px] truncate text-white/70">
                      {selectedObject}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/40">{t("header.date")}</span>
                  <span className="font-mono text-white/70">
                    {formatSimDate(dayOffset)}
                  </span>
                </div>
              </div>

              {!hasCamera && (
                <p className="text-xs text-red-400">
                  Camera position unavailable
                </p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={!canSave}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-cosmic-accent px-4 py-2.5 text-sm font-medium text-cosmic-deep transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                  {t("bookmarks.save")}
                </button>
                <button
                  type="button"
                  onClick={close}
                  disabled={isSaving}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
