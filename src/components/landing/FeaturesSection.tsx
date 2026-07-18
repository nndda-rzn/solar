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
      className="relative border-t border-white/[0.06] bg-[#090d14] py-16 px-6"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center mb-10"
        >
          <h2
            id="features-heading"
            className="font-sans text-3xl font-semibold text-white/90 sm:text-4xl"
          >
            {t("title")}
          </h2>
          <p className="mt-3 text-white/50 text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURE_ICONS.map((FeatureIcon, i) => {
            const title = t(`items.${i}.title`);
            const desc = t(`items.${i}.desc`);
            return (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group relative rounded-xl border border-white/[0.06] bg-[#0f1419] p-6 transition-colors duration-200 hover:border-white/[0.12]"
              >
                {/* Icon */}
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-cosmic-muted">
                  <FeatureIcon className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 className="font-sans text-lg font-semibold text-white/90 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
