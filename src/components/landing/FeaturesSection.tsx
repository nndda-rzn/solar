"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Globe, Star, Orbit } from "lucide-react";

const FEATURE_ICONS = [Globe, Star, Orbit] as const;

export function FeaturesSection() {
  const t = useTranslations("landing.features");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduce = useReducedMotion();

  return (
    <section
      id="features"
      ref={ref}
      className="relative bg-[#080b14] py-28 px-6"
      aria-labelledby="features-heading"
    >
      {/* Subtle top separator */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a9eff]/20 to-transparent"
      />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-16"
        >
          <h2
            id="features-heading"
            className="font-playfair text-4xl font-bold text-white sm:text-5xl"
          >
            {t("title")}
          </h2>
          <p className="mt-4 text-white/50 text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_ICONS.map((FeatureIcon, i) => {
            const title = t(`items.${i}.title`);
            const desc = t(`items.${i}.desc`);
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 32 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }}
                className="group relative rounded-2xl border border-white/[0.08] bg-[#0d1117] p-8 transition-all duration-300 hover:border-[#4a9eff]/30 hover:bg-[#0d1117]/80 hover:shadow-[0_0_40px_rgba(74,158,255,0.06)]"
              >
                {/* Icon */}
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#4a9eff]/20 bg-[#4a9eff]/10 text-[#4a9eff] transition-colors duration-200 group-hover:border-[#4a9eff]/40 group-hover:bg-[#4a9eff]/15">
                  <FeatureIcon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 className="font-playfair text-xl font-semibold text-white mb-3">
                  {title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>

                {/* Hover accent line */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-0 left-8 right-8 h-px scale-x-0 bg-gradient-to-r from-transparent via-[#4a9eff]/40 to-transparent transition-transform duration-300 group-hover:scale-x-100"
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
