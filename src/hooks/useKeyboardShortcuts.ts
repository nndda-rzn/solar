"use client";

import { useEffect } from "react";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useSimulationStore } from "@/lib/store/simulation-store";

function isTypingTarget(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
}

export function useKeyboardShortcuts() {
  const toggleSearch = useExplorerStore((s) => s.toggleSearch);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        useExplorerStore.getState().toggleBookmarkModal();
      }
      if (e.key === "Escape") {
        const { isSearchOpen, setSearchOpen } = useExplorerStore.getState();
        if (isSearchOpen) {
          setSearchOpen(false);
        }
      }
      if (e.key === " " && !isTypingTarget(e)) {
        e.preventDefault();
        useSimulationStore.getState().togglePlay();
      }
      if ((e.key === "r" || e.key === "R") && !isTypingTarget(e)) {
        e.preventDefault();
        useSimulationStore.getState().reset();
      }
      if (e.key === "?" && !isTypingTarget(e)) {
        e.preventDefault();
        useExplorerStore.getState().toggleShortcutsHelp();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearch]);
}
