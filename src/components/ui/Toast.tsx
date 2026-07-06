"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Info,
  AlertCircle,
  Bookmark,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { useToast } from "@/hooks/useToast";

const ICON_MAP: Record<string, LucideIcon> = {
  Sparkles,
  Info,
  AlertCircle,
  Bookmark,
  Star,
  Trophy,
};

const VARIANTS: Record<
  "achievement" | "info" | "error",
  { border: string; bg: string; icon: LucideIcon; iconColor: string }
> = {
  achievement: {
    border: "border-yellow-400/40",
    bg: "bg-yellow-400/10",
    icon: Sparkles,
    iconColor: "text-yellow-400",
  },
  info: {
    border: "border-cosmic-accent/40",
    bg: "bg-cosmic-accent/10",
    icon: Info,
    iconColor: "text-cosmic-accent",
  },
  error: {
    border: "border-red-400/40",
    bg: "bg-red-400/10",
    icon: AlertCircle,
    iconColor: "text-red-400",
  },
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed right-4 top-4 z-[100] flex flex-col gap-2"
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          const variant = VARIANTS[toast.variant ?? "info"];
          const Icon = (toast.icon && ICON_MAP[toast.icon]) || variant.icon;
          const isUrgent = toast.variant === "achievement";
          return (
            <motion.div
              key={toast.id}
              onClick={() => dismiss(toast.id)}
              role={isUrgent ? "alert" : "status"}
              aria-live={isUrgent ? "assertive" : "polite"}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
              className={`flex min-w-[280px] max-w-[360px] cursor-pointer items-start gap-3 rounded-lg border ${variant.border} ${variant.bg} p-3 backdrop-blur-md`}
            >
              <Icon
                className={`mt-0.5 h-4 w-4 shrink-0 ${variant.iconColor}`}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">
                  {toast.title}
                </p>
                {toast.description && (
                  <p className="mt-0.5 text-xs text-white/60">
                    {toast.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
