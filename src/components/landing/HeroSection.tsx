"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { StarfieldCanvas } from "./StarfieldCanvas";

interface HeroSectionProps {
  locale: string;
}

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations("landing.hero");
  const shouldReduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 24 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] },
    }),
  };

  const headline = t("headline").split("\n");

  return (
    <section
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#080b14] px-6 text-center"
      aria-label="Hero"
    >
      {/* Starfield background */}
      <StarfieldCanvas />

      {/* Radial nebula glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 60%, rgba(74,158,255,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Eyebrow badge */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#4a9eff]/30 bg-[#4a9eff]/10 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[#7cb9ff]"
        >
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 rounded-full bg-[#4a9eff] animate-pulse"
          />
          Interactive 3D Universe
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
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
          custom={0.3}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg"
        >
          {t("subheadline")}
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            href={`/${locale}/signup`}
            className="group inline-flex items-center gap-2 rounded-full bg-[#4a9eff] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(74,158,255,0.3)] transition-all duration-300 hover:bg-[#7cb9ff] hover:shadow-[0_0_40px_rgba(74,158,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b14] cursor-pointer"
          >
            {t("ctaPrimary")}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-8 py-3.5 text-sm font-medium text-white/80 transition-all duration-200 hover:border-white/40 hover:text-white hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 cursor-pointer"
          >
            {t("ctaSecondary")}
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30"
        aria-hidden="true"
      >
        <span className="text-xs tracking-widest uppercase">
          {t("scrollHint")}
        </span>
        <motion.div
          animate={shouldReduce ? {} : { y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
