"use client";

import { ProfileTabs } from "@/components/profile/ProfileTabs";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
  const t = useTranslations("common");

  return (
    <div className="min-h-screen bg-cosmic-deep px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-cosmic-accent"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("hud.backToOverview")}
        </Link>
        <h1 className="mb-6 text-2xl font-bold text-white">
          {t("profile.title")}
        </h1>
        <ProfileTabs />
      </div>
    </div>
  );
}
