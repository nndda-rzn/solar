"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { audioManager } from "@/lib/audio/audio-manager";

const AMBIENT_KEYS = ["solar", "stellar", "cosmic"] as const;

export function AudioController() {
  const pathname = usePathname();
  const isExplorer = /^\/[a-z]{2}\/?$/.test(pathname);

  useEffect(() => {
    if (!isExplorer) {
      AMBIENT_KEYS.forEach((key) => audioManager.fadeOutAndStop(key, 800));
    }
  }, [isExplorer]);

  return null;
}
