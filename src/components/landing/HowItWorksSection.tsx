"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

// Ilustrasi SVG unik per step
function IllustrationSignup() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/6 bg-[#080b14] p-6 shadow-2xl">
      {/* Header bar */}
      <div className="mb-4 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#4a9eff]/60" />
        <div className="h-1.5 w-20 rounded-full bg-[#4a9eff]/30" />
      </div>
      {/* Form fields */}
      <div className="space-y-3">
        <div>
          <div className="mb-1 h-1.5 w-10 rounded-full bg-white/20" />
          <div className="h-8 w-full rounded-lg border border-white/10 bg-white/5 px-3 flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-white/15" />
          </div>
        </div>
        <div>
          <div className="mb-1 h-1.5 w-14 rounded-full bg-white/20" />
          <div className="h-8 w-full rounded-lg border border-white/10 bg-white/5 px-3 flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-1.5 w-1.5 rounded-full bg-white/20" />
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Submit button */}
      <div className="mt-4 h-8 w-full rounded-lg bg-[#4a9eff]/30 flex items-center justify-center">
        <div className="h-1.5 w-16 rounded-full bg-[#4a9eff]/70" />
      </div>
      {/* Footer link */}
      <div className="mt-3 flex justify-center gap-1">
        <div className="h-1.5 w-20 rounded-full bg-white/10" />
        <div className="h-1.5 w-12 rounded-full bg-[#4a9eff]/40" />
      </div>
    </div>
  );
}

function IllustrationExplorer() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/6 bg-[#080b14] p-6 shadow-2xl flex items-center justify-center">
      {/* Mini solar system */}
      <div className="relative h-40 w-40">
        {/* Sun */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-[#fbbf24]/80 shadow-[0_0_20px_rgba(251,191,36,0.5)]" />
        {/* Orbit 1 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-20 w-20 rounded-full border border-white/10" />
        {/* Planet 1 */}
        <div className="absolute left-1/2 top-[10%] -translate-x-1/2 h-3 w-3 rounded-full bg-[#60a5fa]/90 shadow-[0_0_8px_rgba(96,165,250,0.6)]" />
        {/* Orbit 2 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 rounded-full border border-white/6" />
        {/* Planet 2 */}
        <div className="absolute right-[6%] top-1/2 -translate-y-1/2 h-4 w-4 rounded-full bg-[#f97316]/80 shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
        {/* Orbit 3 */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[9.5rem] w-[9.5rem] rounded-full border border-white/4" />
        {/* Planet 3 */}
        <div className="absolute left-[8%] bottom-[12%] h-2.5 w-2.5 rounded-full bg-[#a78bfa]/80" />
      </div>
    </div>
  );
}

function IllustrationAchievement() {
  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/6 bg-[#080b14] p-6 shadow-2xl">
      {/* Achievement badge */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative h-12 w-12 flex-shrink-0">
          <div className="h-12 w-12 rounded-full border-2 border-[#4a9eff]/50 bg-[#4a9eff]/10 flex items-center justify-center shadow-[0_0_16px_rgba(74,158,255,0.25)]">
            {/* Star icon SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
                fill="#4a9eff"
                fillOpacity="0.8"
              />
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <div className="mb-1.5 h-2 w-24 rounded-full bg-[#4a9eff]/50" />
          <div className="h-1.5 w-16 rounded-full bg-white/20" />
        </div>
      </div>
      {/* XP bar */}
      <div className="mb-2 flex items-center justify-between">
        <div className="h-1.5 w-8 rounded-full bg-white/20" />
        <div className="h-1.5 w-12 rounded-full bg-[#4a9eff]/40" />
      </div>
      <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
        <div className="h-full w-3/5 rounded-full bg-gradient-to-r from-[#4a9eff]/60 to-[#4a9eff]/30" />
      </div>
      {/* Recent unlocks */}
      <div className="mt-4 space-y-2">
        {[1, 2].map((n) => (
          <div key={n} className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full bg-[#4a9eff]/15 border border-[#4a9eff]/20 flex-shrink-0" />
            <div
              className="h-1.5 rounded-full bg-white/10"
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
      className="relative bg-[#0d1117] py-28 px-6"
      aria-labelledby="how-heading"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a9eff]/20 to-transparent"
      />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center mb-20"
        >
          <h2
            id="how-heading"
            className="font-playfair text-4xl font-bold text-white sm:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-white/50 text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative flex flex-col gap-0">
          {/* Vertical connector line */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-[#4a9eff]/30 via-[#4a9eff]/10 to-transparent lg:block"
          />

          {steps.map(({ num, title, desc }, i) => {
            const isEven = i % 2 === 0;
            const Illustration = ILLUSTRATIONS[i] as React.FC;
            return (
              <motion.div
                key={num}
                initial={{
                  opacity: 0,
                  x: shouldReduce ? 0 : isEven ? -40 : 40,
                }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.65,
                  delay: i * 0.15,
                  ease: "easeOut",
                }}
                className={[
                  "relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 pb-20 last:pb-0",
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
                  <span className="block font-playfair text-6xl font-bold text-[#4a9eff]/15 select-none mb-2">
                    {num}
                  </span>
                  <h3 className="font-playfair text-2xl font-semibold text-white mb-3">
                    {title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed max-w-sm mx-auto lg:mx-0">
                    {desc}
                  </p>
                </div>

                {/* Center node */}
                <div
                  aria-hidden="true"
                  className="relative z-10 hidden lg:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#4a9eff]/40 bg-[#080b14] shadow-[0_0_20px_rgba(74,158,255,0.2)]"
                >
                  <div className="h-3 w-3 rounded-full bg-[#4a9eff]" />
                </div>

                {/* Visual side — unique illustration per step */}
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
