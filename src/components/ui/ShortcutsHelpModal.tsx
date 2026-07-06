"use client";

import { Keyboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { ModalBase } from "./ModalBase";

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

  function close() {
    setShortcutsHelpOpen(false);
  }

  return (
    <ModalBase
      isOpen={isShortcutsHelpOpen}
      onClose={close}
      ariaLabel={t("shortcuts.title")}
      icon={<Keyboard className="h-5 w-5 text-cosmic-accent" />}
      title={t("shortcuts.title")}
    >
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
                  {idx > 0 && <span className="text-xs text-white/30">/</span>}
                  <kbd className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs font-mono text-cosmic-glow">
                    {key}
                  </kbd>
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </ModalBase>
  );
}
