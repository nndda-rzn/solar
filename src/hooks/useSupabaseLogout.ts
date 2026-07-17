"use client";

import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/utils/supabase/client";

/**
 * Returns a `logout` function that signs the user out via Supabase,
 * redirects to /login, and refreshes the router.
 */
export function useSupabaseLogout() {
  const router = useRouter();

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router]);

  return logout;
}
