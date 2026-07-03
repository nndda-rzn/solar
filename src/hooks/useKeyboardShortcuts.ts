"use client";

import { useEffect } from "react";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function useKeyboardShortcuts() {
  const toggleSearch = useExplorerStore((s) => s.toggleSearch);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === "Escape") {
        const { isSearchOpen, setSearchOpen } = useExplorerStore.getState();
        if (isSearchOpen) {
          setSearchOpen(false);
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSearch]);
}
