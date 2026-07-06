"use client";

import { motion, AnimatePresence } from "framer-motion";

interface CosmicLoaderProps {
  label?: string;
  progress?: number;
}

const RADIUS = 28;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function CosmicLoader({ label, progress }: CosmicLoaderProps) {
  const hasProgress = typeof progress === "number";
  const clamped = Math.max(0, Math.min(100, progress ?? 0));
  const offset = CIRCUMFERENCE - (clamped / 100) * CIRCUMFERENCE;

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 bg-cosmic-deep/95 backdrop-blur-sm">
      {hasProgress ? (
        <div className="relative h-20 w-20">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="4"
            />
            <motion.circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              stroke="#4a9eff"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span
              key={Math.round(clamped)}
              initial={{ opacity: 0.5, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-sm font-bold text-cosmic-accent"
            >
              {Math.round(clamped)}
              <span className="text-[10px] text-white/40">%</span>
            </motion.span>
          </div>
        </div>
      ) : (
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-cosmic-accent/20" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cosmic-accent" />
          <div className="absolute inset-4 animate-pulse rounded-full bg-cosmic-accent/30 blur-md" />
        </div>
      )}
      <AnimatePresence>
        {label && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-white/50"
          >
            {label}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
