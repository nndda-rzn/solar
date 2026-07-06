"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cosmic-deep p-8 text-white">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-cosmic-accent/40 bg-cosmic-accent/20 p-8 text-center">
        <h1 className="text-2xl font-bold text-cosmic-accent">
          {t("error.title")}
        </h1>
        <p className="text-white/50">{t("error.description")}</p>
        <pre className="overflow-x-auto rounded border border-red-500/40 bg-red-950/40 p-4 text-left text-sm text-red-400">
          {error.message}
        </pre>
        <button
          onClick={reset}
          className="rounded border border-cosmic-accent/40 bg-cosmic-accent/20 px-6 py-2 font-medium text-cosmic-accent transition hover:bg-cosmic-accent/40"
        >
          {t("error.retry")}
        </button>
      </div>
    </div>
  );
}
