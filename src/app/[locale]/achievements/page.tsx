"use client";

import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/AppShell";
import { AchievementsTab } from "@/components/profile/AchievementsTab";

export default function AchievementsPage() {
  const t = useTranslations("common");

  return (
    <AppShell breadcrumb="ACHIEVEMENTS">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">
          {t("achievements.title")}
        </h1>
        <AchievementsTab />
      </div>
    </AppShell>
  );
}
