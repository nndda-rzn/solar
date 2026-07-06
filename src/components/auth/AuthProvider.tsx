"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * AuthProvider - subscribes to Supabase auth state changes and keeps the
 * Zustand auth store in sync across the client-side app.
 *
 * Mount once near the root of the locale layout. Renders nothing itself;
 * it's a side-effect-only provider.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    const supabase = createClient();

    // Hydrate initial session on mount
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Keep store in sync with subsequent auth events (login, logout, refresh)
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [setUser, setLoading]);

  return <>{children}</>;
}
