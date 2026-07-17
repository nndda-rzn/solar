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
      className="relative border-t border-white/[0.06] bg-[#090d14] py-16 px-6"
      aria-label="Quote"
    >
      <motion.figure
        initial={{ opacity: 0, y: shouldReduce ? 0 : 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-3xl text-center"
      >
        <Quote
          className="mx-auto mb-6 h-6 w-6 text-cosmic-muted/40"
          aria-hidden="true"
        />
        <blockquote>
          <p className="font-playfair text-2xl font-medium italic leading-relaxed text-white/80 sm:text-3xl">
            &ldquo;{t("text")}&rdquo;
          </p>
          <figcaption className="mt-6 flex items-center justify-center gap-3">
            <div aria-hidden="true" className="h-px w-8 bg-cosmic-muted/40" />
            <cite className="text-sm not-italic font-medium tracking-wider uppercase text-cosmic-muted">
              {t("author")}
            </cite>
            <div aria-hidden="true" className="h-px w-8 bg-cosmic-muted/40" />
          </figcaption>
        </blockquote>
      </motion.figure>
    </section>
  );
}
