"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

function IllustrationSignup() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-white/[0.06] bg-[#090d14] p-6 shadow-lg">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-cosmic-muted/60" />
        <div className="h-1.5 w-20 rounded-full bg-white/10" />
      </div>
      <div className="space-y-3">
        <div>
          <div className="mb-1 h-1.5 w-10 rounded-full bg-white/20" />
          <div className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center">
            <div className="h-1.5 w-24 rounded-full bg-white/10" />
          </div>
        </div>
        <div>
          <div className="mb-1 h-1.5 w-14 rounded-full bg-white/20" />
          <div className="h-8 w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-1.5 w-1.5 rounded-full bg-white/15" />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-4 h-8 w-full rounded-lg bg-cosmic-warm/80 flex items-center justify-center">
        <div className="h-1.5 w-16 rounded-full bg-[#0f1419]/60" />
      </div>
      <div className="mt-3 flex justify-center gap-1">
        <div className="h-1.5 w-20 rounded-full bg-white/8" />
        <div className="h-1.5 w-12 rounded-full bg-white/15" />
      </div>
    </div>
  );
}

function IllustrationExplorer() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-white/[0.06] bg-[#090d14] p-6 shadow-lg flex items-center justify-center">
      <div className="relative h-40 w-40">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#fbbf24]/80" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full border border-white/8" />
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2 h-3 w-3 rounded-full bg-[#60a5fa]/80" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full border border-white/6" />
        <div className="absolute right-[6%] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#f97316]/70" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[9.5rem] w-[9.5rem] rounded-full border border-white/4" />
        <div className="absolute left-[8%] bottom-[12%] h-2.5 w-2.5 rounded-full bg-[#a78bfa]/70" />
      </div>
    </div>
  );
}

function IllustrationAchievement() {
  return (
    <div className="w-full max-w-xs rounded-xl border border-white/[0.06] bg-[#090d14] p-6 shadow-lg">
      <div className="flex items-center gap-4 mb-4">
        <div className="h-10 w-10 flex-shrink-0 rounded-full border border-cosmic-warm/30 bg-cosmic-warm/10 flex items-center justify-center">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
              fill="#f59e0b"
              fillOpacity="0.7"
            />
          </svg>
        </div>
        <div className="flex-1">
          <div className="mb-1.5 h-2 w-24 rounded-full bg-white/15" />
          <div className="h-1.5 w-16 rounded-full bg-white/10" />
        </div>
      </div>
      <div className="mb-2 flex items-center justify-between">
        <div className="h-1.5 w-8 rounded-full bg-white/15" />
        <div className="h-1.5 w-12 rounded-full bg-cosmic-warm/30" />
      </div>
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-3/5 rounded-full bg-cosmic-warm/40" />
      </div>
      <div className="mt-4 space-y-2">
        {[1, 2].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-white/[0.04] border border-white/[0.06] flex-shrink-0" />
            <div
              className="h-1.5 rounded-full bg-white/8"
              style={{ width: `${n === 1 ? 72 : 52}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const ILLUSTRATIONS: React.FC[] = [
  IllustrationSignup,
  IllustrationExplorer,
  IllustrationAchievement,
];

export function HowItWorksSection() {
  const t = useTranslations("landing.howItWorks");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduce = useReducedMotion();

  const steps = [0, 1, 2].map((i) => ({
    num: t(`steps.${i}.num`),
    title: t(`steps.${i}.title`),
    desc: t(`steps.${i}.desc`),
  }));

  return (
    <section
      id="howItWorks"
      ref={ref}
      className="relative border-t border-white/[0.06] bg-[#0d1117] py-16 px-6"
      aria-labelledby="how-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-12"
        >
          <h2
            id="how-heading"
            className="font-sans text-3xl font-semibold text-white/90 sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-3 text-white/50 text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col gap-0">
          {/* Vertical connector line */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-white/[0.06] lg:block"
          />

          {steps.map(({ num, title, desc }, i) => {
            const isEven = i % 2 === 0;
            const Illustration = ILLUSTRATIONS[i] as React.FC;
            return (
              <motion.div
                key={num}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={[
                  "relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 pb-16 last:pb-0",
                  isEven ? "lg:flex-row" : "lg:flex-row-reverse",
                ].join(" ")}
              >
                {/* Text side */}
                <div
                  className={[
                    "flex-1 text-center",
                    isEven ? "lg:text-right" : "lg:text-left",
                  ].join(" ")}
                >
                  <span className="block font-sans text-5xl font-bold text-white/[0.08] select-none mb-2">
                    {num}
                  </span>
                  <h3 className="font-sans text-xl font-semibold text-white/90 mb-2">
                    {title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
                    {desc}
                  </p>
                </div>

                {/* Center node */}
                <div
                  aria-hidden="true"
                  className="relative z-10 hidden lg:flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-[#0d1117]"
                >
                  <div className="h-2.5 w-2.5 rounded-full bg-cosmic-muted/60" />
                </div>

                {/* Visual side */}
                <div className="flex-1 flex items-center justify-center">
                  <Illustration />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
