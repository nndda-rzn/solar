"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProgressTab } from "@/components/profile/ProgressTab";
import { AchievementsTab } from "@/components/profile/AchievementsTab";
import { BookmarksTab } from "@/components/profile/BookmarksTab";

const TABS = ["profile", "progress", "achievements", "bookmarks"] as const;

export function ProfileTabs() {
  const t = useTranslations("common");
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6 flex gap-1 border-b border-white/10">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
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
