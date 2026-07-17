"use client";

import { SlidersHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUIStore } from "@/lib/store/ui-store";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { ModalBase } from "./ModalBase";

export function SettingsModal() {
  const t = useTranslations("common");
  const isSettingsOpen = useUIStore((s) => s.isSettingsOpen);
  const setSettingsOpen = useUIStore((s) => s.setSettingsOpen);

  function close() {
    setSettingsOpen(false);
  }

  return (
    <ModalBase
      isOpen={isSettingsOpen}
      onClose={close}
      ariaLabel={t("settings.title")}
      icon={<SlidersHorizontal className="h-5 w-5 text-cosmic-accent" />}
      title={t("settings.title")}
    >
      <SettingsForm />
    </ModalBase>
  );
}
