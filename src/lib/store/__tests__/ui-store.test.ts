import { useUIStore } from "../ui-store";

describe("useUIStore", () => {
  beforeEach(() => {
    useUIStore.setState({
      isBookmarkModalOpen: false,
      isSearchOpen: false,
      isShortcutsHelpOpen: false,
      isSettingsOpen: false,
    });
  });

  it("toggleBookmarkModal flips state", () => {
    useUIStore.getState().toggleBookmarkModal();
    expect(useUIStore.getState().isBookmarkModalOpen).toBe(true);
    useUIStore.getState().toggleBookmarkModal();
    expect(useUIStore.getState().isBookmarkModalOpen).toBe(false);
  });

  it("toggleSearch toggles independently", () => {
    useUIStore.getState().toggleSearch();
    expect(useUIStore.getState().isSearchOpen).toBe(true);
    expect(useUIStore.getState().isBookmarkModalOpen).toBe(false);
  });

  it("setSearchOpen overrides toggle state", () => {
    useUIStore.getState().setSearchOpen(true);
    expect(useUIStore.getState().isSearchOpen).toBe(true);
    useUIStore.getState().setSearchOpen(false);
    expect(useUIStore.getState().isSearchOpen).toBe(false);
  });
});
