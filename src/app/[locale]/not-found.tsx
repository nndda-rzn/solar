"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const params = useParams();
  const locale = typeof params.locale === "string" ? params.locale : "en";
  const t = useTranslations("common");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cosmic-deep p-8 text-center text-white">
      <div className="font-mono text-6xl text-cosmic-accent">404</div>
      <h1 className="mt-6 text-2xl font-semibold text-white">
        {t("notFound.title")}
      </h1>
      <p className="mt-2 max-w-sm text-white/60">{t("notFound.description")}</p>
      <Link
        href={`/${locale}/dashboard`}
        className="mt-8 rounded border border-cosmic-accent/40 bg-cosmic-accent/20 px-6 py-2 font-medium text-cosmic-accent transition hover:bg-cosmic-accent/40"
      >
        {t("notFound.action")}
      </Link>
    </div>
  );
}
