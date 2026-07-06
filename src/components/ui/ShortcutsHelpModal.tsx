"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type ShortcutItem = {
  keys: string[];
  labelKey: "search" | "bookmark" | "help" | "close" | "playPause" | "reset";
};

const SHORTCUTS: ShortcutItem[] = [
  { keys: ["⌘K", "Ctrl+K"], labelKey: "search" },
  { keys: ["⌘B", "Ctrl+B"], labelKey: "bookmark" },
  { keys: ["?"], labelKey: "help" },
  { keys: ["Esc"], labelKey: "close" },
  { keys: ["Space"], labelKey: "playPause" },
  { keys: ["R"], labelKey: "reset" },
];

export function ShortcutsHelpModal() {
  const t = useTranslations("common");
  const isShortcutsHelpOpen = useExplorerStore((s) => s.isShortcutsHelpOpen);
  const setShortcutsHelpOpen = useExplorerStore((s) => s.setShortcutsHelpOpen);

  const modalRef = useFocusTrap(isShortcutsHelpOpen);

  function close() {
    setShortcutsHelpOpen(false);
  }

  useEffect(() => {
    if (!isShortcutsHelpOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isShortcutsHelpOpen, setShortcutsHelpOpen]);

  return (
    <AnimatePresence>
      {isShortcutsHelpOpen && (
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
            aria-label={t("shortcuts.title")}
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

            <div className="mb-5 flex items-center gap-2">
              <Keyboard className="h-5 w-5 text-cosmic-accent" />
              <h2 className="text-lg font-bold text-white">
                {t("shortcuts.title")}
              </h2>
            </div>

            <ul className="space-y-2.5">
              {SHORTCUTS.map((item) => (
                <li
                  key={item.labelKey}
                  className="flex items-center justify-between gap-4"
                >
                  <span className="text-sm text-white/70">
                    {t(`shortcuts.${item.labelKey}`)}
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-1.5">
                    {item.keys.map((key, idx) => (
                      <span key={key} className="flex items-center gap-1.5">
                        {idx > 0 && (
                          <span className="text-xs text-white/30">/</span>
                        )}
                        <kbd className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs font-mono text-cosmic-glow">
                          {key}
                        </kbd>
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
