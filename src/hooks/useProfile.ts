"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { Profile, ProfileRow, mapProfileRow } from "@/types/profile";

interface UseProfileResult {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  updateProfile: (
    updates: Partial<Pick<Profile, "displayName" | "bio" | "avatarUrl">>,
  ) => Promise<{ error: string | null }>;
  refetch: () => Promise<void>;
}

/**
 * Loads the current user's profile row from `public.profiles` and exposes
 * an `updateProfile` mutator. Requires an authenticated session — returns
 * `profile: null` while unauthenticated.
 */
export function useProfile(): UseProfileResult {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { data, error: fetchError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (fetchError) {
      setError(fetchError.message);
      setProfile(null);
    } else {
      setError(null);
      setProfile(mapProfileRow(data as ProfileRow));
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (
      updates: Partial<Pick<Profile, "displayName" | "bio" | "avatarUrl">>,
    ) => {
      if (!user) return { error: "Tidak ada sesi aktif" };

      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          display_name: updates.displayName,
          bio: updates.bio,
          avatar_url: updates.avatarUrl,
        })
        .eq("id", user.id);

      if (updateError) {
        return { error: updateError.message };
      }

      await fetchProfile();
      return { error: null };
    },
    [user, fetchProfile],
  );

  return { profile, isLoading, error, updateProfile, refetch: fetchProfile };
}
