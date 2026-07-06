"use client";

interface CosmicLoaderProps {
  label?: string;
}

export function CosmicLoader({ label }: CosmicLoaderProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-cosmic-deep">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-cosmic-accent/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cosmic-accent" />
        <div className="absolute inset-4 animate-pulse rounded-full bg-cosmic-accent/30 blur-md" />
      </div>
      {label && <p className="text-sm text-white/50">{label}</p>}
    </div>
  );
}
