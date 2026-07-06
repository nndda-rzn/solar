"use client";

import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { Loader2, Save, User as UserIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export function ProfileForm() {
  const t = useTranslations("common");
  const { profile, isLoading, error, updateProfile } = useProfile();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (profile && !hydrated) {
      setDisplayName(profile.displayName ?? "");
      setBio(profile.bio ?? "");
      setAvatarUrl(profile.avatarUrl ?? "");
      setHydrated(true);
    }
  }, [profile, hydrated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);

    const { error: updateError } = await updateProfile({
      displayName,
      bio,
      avatarUrl,
    });

    if (updateError) {
      setSaveError(updateError);
    } else {
      setSaved(true);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-white/50">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>{t("profile.loading")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-400">
        {t("profile.loadError")}
        {error}
      </p>
    );
  }

  if (!profile) {
    return <p className="text-sm text-white/50">{t("profile.notFound")}</p>;
  }

  return (
    <div className="w-full max-w-lg space-y-6">
      <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-cosmic-deep">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <UserIcon className="h-8 w-8 text-white/40" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">
            {profile.username ?? profile.email}
          </p>
          <p className="text-xs text-white/50">{profile.email}</p>
          <p className="mt-1 text-[10px] uppercase tracking-wider text-cosmic-accent">
            {t("profile.level")} {profile.level} &middot; {profile.xp} XP
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {saveError && (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-400">
            {saveError}
          </p>
        )}
        {saved && (
          <p className="rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-400">
            {t("profile.saved")}
          </p>
        )}

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
            {t("profile.displayName")}
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder={t("profile.displayNamePlaceholder")}
            disabled={isSaving}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
            {t("profile.bio")}
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder={t("profile.bioPlaceholder")}
            disabled={isSaving}
            rows={3}
            className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-white/40">
            {t("profile.avatarUrl")}
          </label>
          <input
            type="url"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            disabled={isSaving}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cosmic-accent/50"
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-cosmic-accent px-4 py-2.5 text-sm font-medium text-cosmic-deep transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{t("profile.save")}</span>
        </button>
      </form>
    </div>
  );
}
