"use client";

import { Suspense } from "react";
import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { AppShell } from "@/components/layout/AppShell";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("common");

  return (
    <AppShell>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">
          {t("profile.title")}
        </h1>
        <Suspense fallback={null}>
          <ProfileTabs />
        </Suspense>
      </div>
    </AppShell>
  );
}
