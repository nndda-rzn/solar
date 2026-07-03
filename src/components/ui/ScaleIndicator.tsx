"use client";

import { useExplorerStore } from "@/lib/store/explorer-store";
import { SCALES, ScaleMode } from "@/config/scales";

const SCALE_ORDER: ScaleMode[] = ["solar", "stellar", "galactic", "cosmic"];

export function ScaleIndicator() {
  const { scale, setScale } = useExplorerStore();

  return (
    <div className="pointer-events-auto absolute bottom-20 left-4 flex flex-col gap-1">
      {SCALE_ORDER.map((key) => {
        const config = SCALES[key];
        const isActive = scale === key;

        return (
          <button
            key={key}
            onClick={() => setScale(key)}
            className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-xs transition-all duration-200 ${
              isActive
                ? "border border-cosmic-accent/40 bg-cosmic-accent/20 text-cosmic-accent"
                : "border border-white/5 bg-white/5 text-white/50 hover:border-white/10 hover:bg-white/10 hover:text-white/70"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isActive ? "bg-cosmic-accent" : "bg-white/20"
              }`}
            />
            <span>{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
