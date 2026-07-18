"use client";

import { useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/lib/store/ui-store";
import { useCameraStore } from "@/lib/store/camera-store";
import { useSelectionStore } from "@/lib/store/selection-store";
import { useScaleStore } from "@/lib/store/scale-store";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useToast } from "@/hooks/useToast";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { SCALES } from "@/config/scales";
import type { CameraState } from "@/types/bookmark";
import { ModalBase } from "./ModalBase";
import { formatSimDate } from "@/lib/utils/format";

export function BookmarkSaveModal() {
  const t = useTranslations("common");
  const isBookmarkModalOpen = useUIStore((s) => s.isBookmarkModalOpen);
  const setBookmarkModalOpen = useUIStore((s) => s.setBookmarkModalOpen);
  const cameraPosition = useCameraStore((s) => s.cameraPosition);
  const cameraTarget = useCameraStore((s) => s.cameraTarget);
  const selectedPlanet = useSelectionStore((s) => s.selectedPlanet);
  const selectedStar = useSelectionStore((s) => s.selectedStar);
  const selectedConstellation = useSelectionStore(
    (s) => s.selectedConstellation,
  );
  const scale = useScaleStore((s) => s.scale);
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

    if (!created) {
      push({ title: t("bookmarks.saveError"), variant: "error" });
      setIsSaving(false);
      return;
    }

    cosmicEventBus.emit({
      type: "bookmark_saved",
      payload: { id: created.id },
    });
    push({ title: t("toast.bookmarkSaved"), variant: "info" });
    close();
  }

  return (
    <ModalBase
      isOpen={isBookmarkModalOpen}
      onClose={close}
      ariaLabel={t("bookmarks.save")}
      icon={<Bookmark className="h-5 w-5 text-cosmic-accent" />}
      title={t("bookmarks.save")}
      roundedClassName="rounded-xl"
      backgroundClassName="bg-cosmic-deep/90"
    >
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
              {t("bookmarks.nameError")}
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
              <span className="text-white/40">{t("header.bookmark")}</span>
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
          <p className="text-xs text-red-400">{t("bookmarks.cameraError")}</p>
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
            {t("bookmarks.cancel")}
          </button>
        </div>
      </div>
    </ModalBase>
  );
}
