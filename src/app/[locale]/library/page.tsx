"use client";

import { useTranslations } from "next-intl";
import { BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export default function LibraryPage() {
  const t = useTranslations("common");

  return (
    <AppShell breadcrumb="LIBRARY">
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <BookOpen className="mb-6 h-16 w-16 text-white/20" />
        <h1 className="mb-2 text-2xl font-bold text-white">
          {t("pages.library.title")}
        </h1>
        <span className="mb-4 rounded-full border border-cosmic-accent/30 bg-cosmic-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cosmic-accent">
          {t("pages.library.comingSoon")}
        </span>
        <p className="max-w-md text-sm text-white/50">
          {t("pages.library.description")}
        </p>
      </div>
    </AppShell>
  );
}
