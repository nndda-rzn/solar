"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { StarfieldCanvas } from "./StarfieldCanvas";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("landing.hero");
  const shouldReduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 16 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const headline = t("headline").split("\n");

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#090d14] px-6 text-center"
      aria-label="Hero"
    >
      {/* Starfield background */}
      <StarfieldCanvas />

      {/* Subtle nebula glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(74,158,255,0.04) 0%, transparent 80%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="font-playfair text-5xl font-bold leading-tight tracking-tight text-white sm:text-6xl lg:text-7xl"
        >
          {headline.map((line, i) => (
            <span key={i} className={i > 0 ? "block text-[#4a9eff]" : "block"}>
              {line}
            </span>
          ))}
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mt-6 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={`/${locale}/signup`}
            className="group inline-flex items-center gap-2 rounded-xl bg-cosmic-warm px-7 py-3 text-sm font-semibold text-[#0f1419] shadow-lg transition-all duration-200 hover:bg-amber-400 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-warm focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d14] cursor-pointer"
          >
            {t("ctaPrimary")}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-7 py-3 text-sm font-medium text-white/75 transition-all duration-200 hover:border-white/30 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
          >
            {t("ctaSecondary")}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
