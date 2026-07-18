"use client";

import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/AppShell";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  const t = useTranslations("common");

  return (
    <AppShell breadcrumb="SETTINGS">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">
          {t("settings.title")}
        </h1>
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <SettingsForm />
        </div>
      </div>
    </AppShell>
  );
}
