"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

interface CtaSectionProps {
  locale: string;
}

export function CtaSection({ locale }: CtaSectionProps) {
  const t = useTranslations("landing.cta");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduce = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative bg-[#0d1117] py-28 px-6 overflow-hidden"
      aria-labelledby="cta-heading"
    >
      {/* Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(74,158,255,0.08)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a9eff]/20 to-transparent"
      />

      <motion.div
        initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-2xl text-center"
      >
        <h2
          id="cta-heading"
          className="font-playfair text-4xl font-bold text-white sm:text-5xl"
        >
          {t("headline")}
        </h2>
        <p className="mt-4 text-white/50 text-base">{t("subheadline")}</p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/signup`}
            className="group inline-flex items-center gap-2 rounded-full bg-[#4a9eff] px-8 py-3.5 text-sm font-semibold text-white shadow-[0_0_30px_rgba(74,158,255,0.3)] transition-all duration-300 hover:bg-[#7cb9ff] hover:shadow-[0_0_40px_rgba(74,158,255,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] cursor-pointer"
          >
            {t("button")}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>

        <p className="mt-6 text-sm text-white/30">
          {t("loginPrompt")}{" "}
          <Link
            href={`/${locale}/login`}
            className="text-[#4a9eff] hover:text-[#7cb9ff] underline underline-offset-4 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-sm"
          >
            {t("loginLink")}
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
