"use client";

import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  ariaLabel: string;
  className?: string;
}

export function CloseButton({
  onClick,
  ariaLabel,
  className = "",
}: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className={`absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 transition-colors hover:border-white/20 hover:text-white ${className}`}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
