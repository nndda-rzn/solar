"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { RotateCcw, Trash2, Bookmark } from "lucide-react";
import * as THREE from "three";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { SCALES, type ScaleMode } from "@/config/scales";
import type { Bookmark as BookmarkType } from "@/types/bookmark";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BookmarksTab() {
  const t = useTranslations("common");
  const router = useRouter();
  const { bookmarks, isLoading, remove } = useBookmarks();
  const {
    setScale,
    setCameraTarget,
    selectPlanet,
    selectStar,
    selectConstellation,
  } = useExplorerStore();
  const setDayOffset = useSimulationStore((s) => s.setDayOffset);

  function handleRestore(b: BookmarkType) {
    setScale(b.scale as ScaleMode);
    if (b.cameraTarget) {
      setCameraTarget(
        new THREE.Vector3(b.cameraTarget.x, b.cameraTarget.y, b.cameraTarget.z),
      );
    } else if (b.cameraPosition) {
      setCameraTarget(
        new THREE.Vector3(
          b.cameraPosition.x,
          b.cameraPosition.y,
          b.cameraPosition.z,
        ),
      );
    }
    if (b.selectedObject && b.selectedType === "planet") {
      selectPlanet(b.selectedObject);
    }
    if (b.selectedObject && b.selectedType === "star") {
      selectStar(b.selectedObject);
    }
    if (b.selectedObject && b.selectedType === "constellation") {
      selectConstellation(b.selectedObject);
    }
    setDayOffset(b.dayOffset);
    router.push("/");
  }

  async function handleDelete(id: string) {
    if (!window.confirm(t("bookmarks.confirmDelete"))) return;
    await remove(id);
  }

  if (isLoading) {
    return <p className="text-sm text-white/50">Loading...</p>;
  }

  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Bookmark className="mb-3 h-8 w-8 text-white/20" />
        <p className="text-sm text-white/50">{t("bookmarks.empty")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((b) => (
        <div
          key={b.id}
          className="rounded-lg border border-white/10 bg-white/5 p-4"
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-white">{b.name}</p>
            <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
              {SCALES[b.scale as ScaleMode]?.label ?? b.scale}
            </span>
          </div>
          <p className="text-xs text-white/40">{formatDate(b.createdAt)}</p>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleRestore(b)}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/70 transition-colors hover:border-cosmic-accent/40 hover:text-cosmic-accent"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              {t("bookmarks.restore")}
            </button>
            <button
              onClick={() => handleDelete(b.id)}
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/70 transition-colors hover:border-red-400/40 hover:text-red-400"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("bookmarks.delete")}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
