"use client";

import { Globe, Search } from "lucide-react";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

function formatSimDate(dayOffset: number): string {
  const base = new Date();
  const simTime = new Date(base.getTime() + dayOffset * 86400000);
  const day = simTime.getDate().toString().padStart(2, "0");
  const month = simTime.toLocaleString("en-US", { month: "short" });
  const year = simTime.getFullYear();
  return `${day} ${month} ${year}`;
}

function LanguageToggle() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => router.push(pathname, { locale: "en" })}
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

export function HeaderBar() {
  const t = useTranslations("common");
  const speed = useSimulationStore((s) => s.speed);
  const dayOffset = useSimulationStore((s) => s.dayOffset);
  const toggleSearch = useExplorerStore((s) => s.toggleSearch);

  return (
    <div className="pointer-events-auto fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b border-white/5 bg-cosmic-deep/80 px-4 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Globe className="h-4 w-4 text-cosmic-accent" />
        <span className="text-sm font-bold text-white">
          {t("header.title")}
        </span>
        <span className="text-sm text-white/30">|</span>
        <span className="text-xs text-white/50">{t("header.subtitle")}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSearch}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white/70"
        >
          <Search className="h-3 w-3" />
          <span>{t("header.search")}</span>
          <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px]">
            ⌘K
          </kbd>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {t("header.date")}
          </span>
          <span className="font-mono text-xs text-white/80">
            {formatSimDate(dayOffset)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            {t("header.speed")}
          </span>
          <span className="font-mono text-xs text-cosmic-accent">{speed}x</span>
        </div>
        <LanguageToggle />
      </div>
    </div>
  );
}
