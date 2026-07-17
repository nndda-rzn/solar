import { create } from "zustand";

interface UIState {
  isBookmarkModalOpen: boolean;
  isSearchOpen: boolean;
  isShortcutsHelpOpen: boolean;
  isSettingsOpen: boolean;
  toggleBookmarkModal: () => void;
  setBookmarkModalOpen: (isOpen: boolean) => void;
  toggleSearch: () => void;
  setSearchOpen: (isOpen: boolean) => void;
  toggleShortcutsHelp: () => void;
  setShortcutsHelpOpen: (isOpen: boolean) => void;
  toggleSettings: () => void;
  setSettingsOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isBookmarkModalOpen: false,
  isSearchOpen: false,
  isShortcutsHelpOpen: false,
  isSettingsOpen: false,

  toggleBookmarkModal: () =>
    set((s) => ({ isBookmarkModalOpen: !s.isBookmarkModalOpen })),
  setBookmarkModalOpen: (isOpen) => set({ isBookmarkModalOpen: isOpen }),

  toggleSearch: () => set((s) => ({ isSearchOpen: !s.isSearchOpen })),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),

  toggleShortcutsHelp: () =>
    set((s) => ({ isShortcutsHelpOpen: !s.isShortcutsHelpOpen })),
  setShortcutsHelpOpen: (isOpen) => set({ isShortcutsHelpOpen: isOpen }),

  toggleSettings: () => set((s) => ({ isSettingsOpen: !s.isSettingsOpen })),
  setSettingsOpen: (isOpen) => set({ isSettingsOpen: isOpen }),
}));
