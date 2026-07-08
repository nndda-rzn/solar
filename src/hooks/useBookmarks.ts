"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { supabaseBookmarkProvider } from "@/lib/providers/supabase-bookmarks";
import { Bookmark, BookmarkCreatePayload } from "@/types/bookmark";

/**
 * Data-layer hook for user bookmarks.
 * Maintains an in-memory cache of this user's bookmark rows and exposes
 * create/rename/remove helpers. Listens to auth state so the cache is
 * cleared on logout.
 */
export function useBookmarks() {
  const { user, isAuthenticated } = useAuth();
  const t = useTranslations("common");
  const toast = useToast();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user || !isAuthenticated) {
      setBookmarks([]);
      setIsLoading(false);
      userIdRef.current = null;
      return;
    }

    userIdRef.current = user.id;
    setIsLoading(true);
    supabaseBookmarkProvider
      .list(user.id)
      .then(setBookmarks)
      .catch((e) => {
        console.error("[useBookmarks] load error:", e);
        toast.push({
          variant: "error",
          title: t("toast.bookmarksLoadFailed.title"),
          description: t("toast.bookmarksLoadFailed.description"),
        });
      })
      .finally(() => setIsLoading(false));
  }, [user, isAuthenticated, toast, t]);

  const create = useCallback(
    (payload: BookmarkCreatePayload): Promise<Bookmark | null> => {
      const uid = userIdRef.current;
      if (!uid) return Promise.resolve(null);
      return supabaseBookmarkProvider
        .create(uid, payload)
        .then((created) => {
          setBookmarks((prev) => [created, ...prev]);
          return created;
        })
        .catch((e) => {
          console.error("[useBookmarks] create error:", e);
          toast.push({
            variant: "error",
            title: t("toast.bookmarkCreateFailed.title"),
            description: t("toast.bookmarkCreateFailed.description"),
          });
          return null;
        });
    },
    [toast, t],
  );

  const rename = useCallback(
    (id: string, name: string): Promise<void> => {
      return supabaseBookmarkProvider
        .rename(id, name)
        .then((updated) => {
          setBookmarks((prev) => prev.map((b) => (b.id === id ? updated : b)));
        })
        .catch((e) => {
          console.error("[useBookmarks] rename error:", e);
          toast.push({
            variant: "error",
            title: t("toast.bookmarkRenameFailed.title"),
            description: t("toast.bookmarkRenameFailed.description"),
          });
        });
    },
    [toast, t],
  );

  const remove = useCallback(
    (id: string): Promise<void> => {
      return supabaseBookmarkProvider
        .remove(id)
        .then(() => {
          setBookmarks((prev) => prev.filter((b) => b.id !== id));
        })
        .catch((e) => {
          console.error("[useBookmarks] remove error:", e);
          toast.push({
            variant: "error",
            title: t("toast.bookmarkRemoveFailed.title"),
            description: t("toast.bookmarkRemoveFailed.description"),
          });
        });
    },
    [toast, t],
  );

  return useMemo(
    () => ({ bookmarks, isLoading, create, rename, remove }),
    [bookmarks, isLoading, create, rename, remove],
  );
}
