"use client";

import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/AppShell";

export default function HelpPage() {
  const t = useTranslations("common");

  return (
    <AppShell breadcrumb="HELP">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold text-white">
          {t("pages.help.title")}
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <details
              key={n}
              className="rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <summary className="cursor-pointer text-sm font-medium text-white/80">
                {t(`pages.help.faq${n}`)}
              </summary>
              <p className="mt-3 text-sm text-white/50">
                {t(`pages.help.faq${n}Answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
