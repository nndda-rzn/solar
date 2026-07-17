"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

export function QuoteSection() {
  const t = useTranslations("landing.quote");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduce = useReducedMotion();

  return (
    <section
      ref={ref}
      className="relative bg-[#080b14] py-28 px-6 overflow-hidden"
      aria-label="Quote"
    >
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_50%_50%,rgba(74,158,255,0.06)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a9eff]/20 to-transparent"
      />

      <motion.figure
        initial={{ opacity: 0, y: shouldReduce ? 0 : 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl text-center"
      >
        <Quote
          className="mx-auto mb-8 h-8 w-8 text-[#4a9eff]/30"
          aria-hidden="true"
        />
        <blockquote>
          <p className="font-playfair text-2xl font-medium italic leading-relaxed text-white/85 sm:text-3xl lg:text-4xl">
            &ldquo;{t("text")}&rdquo;
          </p>
          <figcaption className="mt-8 flex items-center justify-center gap-3">
            <div aria-hidden="true" className="h-px w-8 bg-[#4a9eff]/40" />
            <cite className="text-sm not-italic font-medium tracking-widest uppercase text-[#4a9eff]/70">
              {t("author")}
            </cite>
            <div aria-hidden="true" className="h-px w-8 bg-[#4a9eff]/40" />
          </figcaption>
        </blockquote>
      </motion.figure>
    </section>
  );
}
