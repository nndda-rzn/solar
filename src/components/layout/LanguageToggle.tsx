"use client";

import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export function LanguageToggle() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => router.push(pathname, { locale: "en" })}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        className={
          locale === "en"
            ? "font-semibold text-cosmic-accent"
            : "text-white/50 hover:text-white/70"
        }
      >
        {t("language.en")}
      </button>
      <span className="text-white/20">|</span>
      <button
        onClick={() => router.push(pathname, { locale: "id" })}
        aria-label="Ganti ke Bahasa Indonesia"
        aria-pressed={locale === "id"}
        className={
          locale === "id"
            ? "font-semibold text-cosmic-accent"
            : "text-white/50 hover:text-white/70"
        }
      >
        {t("language.id")}
      </button>
    </div>
  );
}
