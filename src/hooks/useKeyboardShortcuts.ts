"use client";

import { useEffect } from "react";
import { useUIStore } from "@/lib/store/ui-store";
import { useSimulationStore } from "@/lib/store/simulation-store";

function isTypingTarget(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
}

export function useKeyboardShortcuts() {
  const toggleSearch = useUIStore((s) => s.toggleSearch);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault();
        useUIStore.getState().toggleBookmarkModal();
      }
      if (e.key === "Escape") {
        const { isSearchOpen, setSearchOpen } = useUIStore.getState();
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
        useUIStore.getState().toggleShortcutsHelp();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearch]);
}
