"use client";

import { useEffect, useRef } from "react";
import { useProgress } from "@/hooks/useProgress";
import { useAchievements } from "@/hooks/useAchievements";
import { useToast } from "@/hooks/useToast";
import { cosmicEventBus } from "@/lib/events/event-bus";
import { Progress, ProgressCategory } from "@/types/progress";

const LEVEL_STEP = 100;

/**
 * Invisible component (returns null) that bridges the cosmic event bus to the
 * progress/achievement system. Subscribes once on mount; on each tracked event
 * it records progress, evaluates achievements, and emits unlock/level-up
 * events + toasts for anything newly awarded.
 *
 * Mount inside a tree wrapped by <ToastProvider> and authenticated.
 */
export function AchievementTracker() {
  const { progress, track } = useProgress();
  const { checkAndAward, totalXp } = useAchievements();
  const { push } = useToast();

  const trackRef = useRef(track);
  const checkAndAwardRef = useRef(checkAndAward);
  const pushRef = useRef(push);
  const progressRef = useRef<Progress[]>(progress);
  const totalXpRef = useRef(totalXp);
  const levelRef = useRef(Math.floor(totalXp / LEVEL_STEP));

  useEffect(() => {
    trackRef.current = track;
    checkAndAwardRef.current = checkAndAward;
    pushRef.current = push;
    progressRef.current = progress;
    totalXpRef.current = totalXp;
    levelRef.current = Math.floor(totalXp / LEVEL_STEP);
  });

  useEffect(() => {
    const handleTrack = async (
      category: ProgressCategory,
      targetId: string,
    ) => {
      const created = await trackRef.current(category, targetId);
      const currentProgress = created
        ? [created, ...progressRef.current]
        : progressRef.current;
      progressRef.current = currentProgress;

      const newlyEarned = await checkAndAwardRef.current(currentProgress);

      if (newlyEarned.length === 0) return;

      let addedXp = 0;
      for (const a of newlyEarned) {
        addedXp += a.xpReward;
        cosmicEventBus.emit({
          type: "achievement_unlocked",
          payload: {
            achievementType: a.achievementType,
            title: a.title,
            xp: a.xpReward,
          },
        });
        pushRef.current({
          title: "Achievement Unlocked!",
          description: a.title,
          icon: a.icon,
          variant: "achievement",
        });
      }

      const prevTotal = totalXpRef.current;
      const newTotal = prevTotal + addedXp;
      const prevLevel = levelRef.current;
      const newLevel = Math.floor(newTotal / LEVEL_STEP);

      totalXpRef.current = newTotal;
      levelRef.current = newLevel;

      if (newLevel > prevLevel) {
        cosmicEventBus.emit({
          type: "level_up",
          payload: { from: prevLevel, to: newLevel },
        });
        pushRef.current({
          title: "Level Up!",
          description: `Level ${newLevel}`,
          variant: "info",
        });
      }
    };

    const unsubs: Array<() => void> = [
      cosmicEventBus.on("planet_visited", (e) =>
        handleTrack("visited_planet", e.payload.id),
      ),
      cosmicEventBus.on("star_visited", (e) =>
        handleTrack("visited_star", e.payload.id),
      ),
      cosmicEventBus.on("constellation_visited", (e) =>
        handleTrack("visited_constellation", e.payload.id),
      ),
      cosmicEventBus.on("search_used", (e) =>
        handleTrack("search_used", e.payload.query),
      ),
      cosmicEventBus.on("scale_reached", (e) =>
        handleTrack("scale_reached", e.payload.scale),
      ),
      cosmicEventBus.on("time_traveled", (e) => {
        if (e.payload.dayOffset >= 365) {
          handleTrack("time_traveled", "day_365");
        }
      }),
      cosmicEventBus.on("bookmark_saved", (e) =>
        handleTrack("bookmark_created", e.payload.id),
      ),
      cosmicEventBus.on("panel_opened", (e) =>
        handleTrack("panel_opened", e.payload.id),
      ),
      cosmicEventBus.on("speed_reached", (e) =>
        handleTrack("speed_reached", String(e.payload.speed)),
      ),
      cosmicEventBus.on("library_accessed", (e) =>
        handleTrack("library_accessed", e.payload.itemId),
      ),
    ];

    return () => unsubs.forEach((u) => u());
  }, []);

  return null;
}
