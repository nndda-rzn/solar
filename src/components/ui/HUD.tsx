"use client";

import { useExplorerStore } from "@/lib/store/explorer-store";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { SimulationControls } from "./SimulationControls";
import { ScaleIndicator } from "./ScaleIndicator";
import { InfoPanel } from "./InfoPanel";
import { StellarInfoPanel } from "./StellarInfoPanel";
import { HeaderBar } from "./HeaderBar";
import { SearchModal } from "./SearchModal";
import { ToastContainer } from "./Toast";
import { BookmarkSaveModal } from "./BookmarkSaveModal";
import { ToastProvider } from "@/hooks/useToast";
import { AchievementTracker } from "@/hooks/useAchievementTracker";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function BackButton() {
  const t = useTranslations("common");
  const selectedPlanet = useExplorerStore((s) => s.selectedPlanet);
  const selectPlanet = useExplorerStore((s) => s.selectPlanet);
  const setCameraTarget = useExplorerStore((s) => s.setCameraTarget);

  if (!selectedPlanet) return null;

  return (
    <button
      onClick={() => {
        selectPlanet(null);
        setCameraTarget(null);
      }}
      aria-label={t("hud.backToOverview")}
      className="pointer-events-auto absolute left-4 top-16 flex items-center gap-2 rounded-lg border border-white/10 bg-black/60 px-4 py-2 text-sm text-white/70 backdrop-blur-md transition-all duration-200 hover:border-cosmic-accent/40 hover:text-cosmic-accent"
    >
      <ArrowLeft className="h-4 w-4" />
      {t("hud.backToOverview")}
    </button>
  );
}

export function HUD() {
  useKeyboardShortcuts();

  return (
    <ToastProvider>
      <div className="pointer-events-none fixed inset-0 z-10">
        <HeaderBar />
        <BackButton />
        <SimulationControls />
        <ScaleIndicator />
        <InfoPanel />
        <StellarInfoPanel />
        <SearchModal />
        <AchievementTracker />
        <BookmarkSaveModal />
      </div>
      <ToastContainer />
    </ToastProvider>
  );
}
