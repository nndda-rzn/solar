"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { useTourStore } from "@/lib/store/tour-store";
import { TOUR_STEPS } from "@/data/tour-steps";
import { ChevronRight, X } from "lucide-react";

export function TourCard() {
  const t = useTranslations("common");
  const { currentStep, nextStep, skipTour } = useTourStore();
  const step = TOUR_STEPS[currentStep];
  const total = TOUR_STEPS.length;
  const isLast = currentStep === total - 1;

  if (!step) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed bottom-8 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4 pointer-events-auto"
      >
        <div className="relative rounded-2xl border border-white/10 bg-black/80 p-5 shadow-2xl backdrop-blur-md">
          {/* Step indicator */}
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-cosmic-accent">
              {t("tour.step")} {currentStep + 1} / {total}
            </span>
            <button
              onClick={skipTour}
              aria-label={t("tour.skip")}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
            >
              <X className="h-3 w-3" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="mb-4 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-cosmic-accent"
              initial={{ width: `${(currentStep / total) * 100}%` }}
              animate={{ width: `${((currentStep + 1) / total) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          {/* Content */}
          <h3 className="mb-1.5 text-base font-semibold text-white">
            {t(step.titleKey as Parameters<typeof t>[0])}
          </h3>
          <p className="text-sm leading-relaxed text-white/60">
            {t(step.descriptionKey as Parameters<typeof t>[0])}
          </p>

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={skipTour}
              className="text-xs text-white/30 transition-colors hover:text-white/50"
            >
              {t("tour.skip")}
            </button>
            <button
              onClick={() => nextStep(total)}
              className="flex items-center gap-1.5 rounded-lg bg-cosmic-accent px-4 py-2 text-sm font-medium text-cosmic-deep transition-opacity hover:opacity-90"
            >
              {isLast ? t("tour.finish") : t("tour.next")}
              {!isLast && <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
