"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatItemProps {
  value: string;
  label: string;
  delay: number;
  inView: boolean;
}

function StatItem({ value, label, delay, inView }: StatItemProps) {
  const shouldReduce = useReducedMotion();
  const isNumeric = /^\d+$/.test(value);
  const numericVal = isNumeric ? parseInt(value, 10) : null;
  const [displayed, setDisplayed] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!inView || !isNumeric || numericVal === null || shouldReduce) {
      if (inView) setDisplayed(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start - delay * 1000;
      if (elapsed < 0) {
        requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(String(Math.round(eased * numericVal)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, isNumeric, numericVal, value, delay, shouldReduce]);

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="flex flex-col items-center gap-2"
    >
      <span className="font-playfair text-5xl font-bold text-white sm:text-6xl tabular-nums">
        {displayed}
      </span>
      <span className="text-xs uppercase tracking-widest text-white/40">
        {label}
      </span>
    </motion.div>
  );
}

export function StatsSection() {
  const t = useTranslations("landing.stats");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const stats = [
    { value: t("value1"), label: t("label1") },
    { value: t("value2"), label: t("label2") },
    { value: t("value3"), label: t("label3") },
    { value: t("value4"), label: t("label4") },
  ];

  return (
    <section
      ref={ref}
      className="relative bg-[#080b14] py-24 px-6"
      aria-label="Statistics"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_50%,rgba(74,158,255,0.05)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4a9eff]/20 to-transparent"
      />

      <div className="relative mx-auto max-w-5xl grid grid-cols-2 gap-12 sm:gap-16 lg:grid-cols-4">
        {stats.map(({ value, label }, i) => (
          <StatItem
            key={label}
            value={value}
            label={label}
            delay={i * 0.1}
            inView={inView}
          />
        ))}
      </div>
    </section>
  );
}
