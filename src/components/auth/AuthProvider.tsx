"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";

/**
 * AuthProvider - subscribes to Supabase auth state changes and keeps the
 * Zustand auth store in sync across the client-side app.
 *
 * Also handles "remember me = false": if the user logged in without
 * checking remember me, signs them out when the tab/window is closed.
 *
 * Mount once near the root of the locale layout. Renders nothing itself;
 * it's a side-effect-only provider.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

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

    // If user logged in without "remember me", sign out on tab/window close
    const handleBeforeUnload = () => {
      if (sessionStorage.getItem("rememberMe") === "false") {
        // Use sendBeacon-compatible approach: fire and forget
        supabase.auth.signOut();
        sessionStorage.removeItem("rememberMe");
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      subscription.subscription.unsubscribe();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [setUser]);

  return <>{children}</>;
}
