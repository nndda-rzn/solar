"use client";

import { useAuthStore } from "@/lib/store/auth-store";

/**
 * Convenience hook wrapping the auth store — mirrors the pattern used by
 * useExplorerStore / useSimulationStore consumers elsewhere in the app.
 */
export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return { user, isLoading, isAuthenticated };
}
