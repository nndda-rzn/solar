"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProgressTab } from "@/components/profile/ProgressTab";
import { AchievementsTab } from "@/components/profile/AchievementsTab";
import { BookmarksTab } from "@/components/profile/BookmarksTab";

const TABS = ["profile", "progress", "achievements", "bookmarks"] as const;

export function ProfileTabs() {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const initialIndex = tabParam
    ? TABS.indexOf(tabParam as (typeof TABS)[number])
    : 0;
  const [active, setActive] = useState(initialIndex >= 0 ? initialIndex : 0);

  useEffect(() => {
    if (tabParam) {
      const idx = TABS.indexOf(tabParam as (typeof TABS)[number]);
      if (idx >= 0 && idx !== active) setActive(idx);
    }
  }, [tabParam]);

  function handleTabChange(index: number) {
    setActive(index);
    const tabName = TABS[index];
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex gap-1 border-b border-white/10">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => handleTabChange(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              active === i
                ? "border-b-2 border-cosmic-accent text-cosmic-accent"
                : "text-white/50 hover:text-white/70"
            }`}
          >
            {t(`profile.tabs.${tab}`)}
          </button>
        ))}
      </div>
      <div>
        {active === 0 && <ProfileForm />}
        {active === 1 && <ProgressTab />}
        {active === 2 && <AchievementsTab />}
        {active === 3 && <BookmarksTab />}
      </div>
    </div>
  );
}
