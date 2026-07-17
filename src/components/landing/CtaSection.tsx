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
      className="relative border-t border-white/[0.06] bg-[#0d1117] py-16 px-6"
      aria-labelledby="cta-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto max-w-2xl text-center"
      >
        <h2
          id="cta-heading"
          className="font-sans text-3xl font-semibold text-white/90 sm:text-4xl"
        >
          {t("headline")}
        </h2>
        <p className="mt-3 text-white/50 text-base">{t("subheadline")}</p>

        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href={`/${locale}/signup`}
            className="group inline-flex items-center gap-2 rounded-xl bg-cosmic-warm px-7 py-3 text-sm font-semibold text-[#0f1419] shadow-lg transition-all duration-200 hover:bg-amber-400 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cosmic-warm focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] cursor-pointer"
          >
            {t("button")}
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>

        <p className="mt-5 text-sm text-white/40">
          {t("loginPrompt")}{" "}
          <Link
            href={`/${locale}/login`}
            className="text-white/70 underline underline-offset-4 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
          >
            {t("loginLink")}
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
