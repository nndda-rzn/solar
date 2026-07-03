"use client";

import { Globe, Search } from "lucide-react";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { useExplorerStore } from "@/lib/store/explorer-store";

function formatSimDate(dayOffset: number): string {
  const base = new Date();
  const simTime = new Date(base.getTime() + dayOffset * 86400000);
  const day = simTime.getDate().toString().padStart(2, "0");
  const month = simTime.toLocaleString("en-US", { month: "short" });
  const year = simTime.getFullYear();
  return `${day} ${month} ${year}`;
}

export function HeaderBar() {
  const speed = useSimulationStore((s) => s.speed);
  const dayOffset = useSimulationStore((s) => s.dayOffset);
  const toggleSearch = useExplorerStore((s) => s.toggleSearch);

  return (
    <div className="pointer-events-auto fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b border-white/5 bg-cosmic-deep/80 px-4 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-3">
        <Globe className="h-4 w-4 text-cosmic-accent" />
        <span className="text-sm font-bold text-white">
          Solar System Explorer
        </span>
        <span className="text-sm text-white/30">|</span>
        <span className="text-xs text-white/50">
          Explore planetary orbits in real time
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSearch}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white/70"
        >
          <Search className="h-3 w-3" />
          <span>Search</span>
          <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px]">
            ⌘K
          </kbd>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Date
          </span>
          <span className="font-mono text-xs text-white/80">
            {formatSimDate(dayOffset)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
            Speed
          </span>
          <span className="font-mono text-xs text-cosmic-accent">{speed}x</span>
        </div>
      </div>
    </div>
  );
}
