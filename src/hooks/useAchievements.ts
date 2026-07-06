"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { supabaseAchievementProvider } from "@/lib/providers/supabase-achievements";
import { evaluateRule } from "@/lib/rules/ruleEvaluator";
import { Achievement, AchievementDefinition } from "@/types/achievement";
import { Progress } from "@/types/progress";
import catalogRaw from "@/data/achievements-catalog.json";

const catalog = catalogRaw.definitions as AchievementDefinition[];

/**
 * Data-layer hook for achievements.
 * Loads the user's earned achievements from DB and exposes helpers to
 * detect newly-earned achievements (by comparing catalog vs progress)
 * and award them.
 */
export function useAchievements() {
  const { user, isAuthenticated } = useAuth();
  const locale = useLocale();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !isAuthenticated) {
      setAchievements([]);
      setIsLoading(false);
      userIdRef.current = null;
      return;
    }

    userIdRef.current = user.id;
    setIsLoading(true);
    supabaseAchievementProvider
      .list(user.id)
      .then(setAchievements)
      .catch((e) => {
        console.error("[useAchievements] load error:", e);
      })
      .finally(() => setIsLoading(false));
  }, [user, isAuthenticated]);

  const earned = useMemo(
    () => new Set(achievements.map((a) => a.achievementType)),
    [achievements],
  );

  const isEarned = useCallback((type: string) => earned.has(type), [earned]);

  const totalXp = useMemo(
    () => achievements.reduce((sum, a) => sum + a.xpReward, 0),
    [achievements],
  );

  /**
   * Compare each catalog definition against the provided progress list.
   * Award any newly-eligible achievement (i.e. rule matches + not yet earned).
   * Returns the list of newly-awarded achievements (for toast firing).
   */
  const checkAndAward = useCallback(
    async (progress: Progress[]): Promise<Achievement[]> => {
      if (!userIdRef.current) return [];
      const newlyEarned: Achievement[] = [];

      for (const def of catalog) {
        if (earned.has(def.id)) continue;
        try {
          if (!evaluateRule(def.rule, progress)) continue;
          const localized =
            (def.description as unknown as Record<string, string>)[locale] ??
            (def.description as unknown as Record<string, string>).en ??
            "";
          const awarded = await supabaseAchievementProvider.award(
            userIdRef.current!,
            def,
            localized,
          );
          if (awarded) {
            newlyEarned.push(awarded);
            setAchievements((prev) => [awarded, ...prev]);
          }
        } catch (e) {
          console.error("[useAchievements] award error:", e);
        }
      }

      return newlyEarned;
    },
    [earned, locale],
  );

  return useMemo(
    () => ({
      achievements,
      isLoading,
      checkAndAward,
      isEarned,
      totalXp,
      catalog,
    }),
    [achievements, isLoading, checkAndAward, isEarned, totalXp],
  );
}
