"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabaseProgressProvider } from "@/lib/providers/supabase-progress";
import { Progress, ProgressCategory } from "@/types/progress";

/**
 * Data-layer hook for progress tracking.
 * Maintains an in-memory cache of this user's progress rows and exposes
 * track/query helpers. Listens to auth state so the cache is cleared
 * on logout.
 */
export function useProgress() {
  const { user, isAuthenticated } = useAuth();
  const [progress, setProgress] = useState<Progress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !isAuthenticated) {
      setProgress([]);
      setIsLoading(false);
      userIdRef.current = null;
      return;
    }

    userIdRef.current = user.id;
    setIsLoading(true);
    supabaseProgressProvider
      .list(user.id)
      .then(setProgress)
      .catch((e) => {
        console.error("[useProgress] load error:", e);
      })
      .finally(() => setIsLoading(false));
  }, [user, isAuthenticated]);

  const hasProgress = useCallback(
    (category: ProgressCategory, targetId: string): boolean => {
      return progress.some(
        (p) => p.category === category && p.targetId === targetId,
      );
    },
    [progress],
  );

  const track = useCallback(
    (
      category: ProgressCategory,
      targetId: string,
      metadata?: Record<string, unknown>,
    ) => {
      const uid = userIdRef.current;
      if (!uid) return Promise.resolve(null);
      if (hasProgress(category, targetId)) return Promise.resolve(null);
      return supabaseProgressProvider
        .track(uid, category, targetId, metadata)
        .then((created) => {
          if (created) setProgress((prev) => [created, ...prev]);
          return created;
        })
        .catch((e) => {
          console.error("[useProgress] track error:", e);
          return null;
        });
    },
    [hasProgress],
  );

  const getCount = useCallback(
    (category: ProgressCategory): number => {
      return progress.filter((p) => p.category === category).length;
    },
    [progress],
  );

  const getUniqueCount = useCallback(
    (category: ProgressCategory): number => {
      const uniq = new Set(
        progress.filter((p) => p.category === category).map((p) => p.targetId),
      );
      return uniq.size;
    },
    [progress],
  );

  const getRecent = useCallback(
    (limit: number): Progress[] => {
      return progress.slice(0, limit);
    },
    [progress],
  );

  return useMemo(
    () => ({
      progress,
      isLoading,
      track,
      hasProgress,
      getCount,
      getUniqueCount,
      getRecent,
    }),
    [
      progress,
      isLoading,
      track,
      hasProgress,
      getCount,
      getUniqueCount,
      getRecent,
    ],
  );
}
