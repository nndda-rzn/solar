"use client";

import { useTranslations } from "next-intl";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface StatItemProps {
  value: string;
  label: string;
  inView: boolean;
}

function StatItem({ value, label, inView }: StatItemProps) {
  const shouldReduce = useReducedMotion();
  const isNumeric = /^\d+$/.test(value);
  const numericVal = isNumeric ? parseInt(value, 10) : null;
  const [displayed, setDisplayed] = useState(isNumeric ? 0 : value);

  useEffect(() => {
    if (!inView || !isNumeric || numericVal === null || shouldReduce) {
      if (inView) setDisplayed(value);
      return;
    }
    const duration = 1000;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      if (elapsed < duration) {
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(String(Math.round(eased * numericVal)));
        requestAnimationFrame(tick);
      } else {
        setDisplayed(value);
      }
    };
    requestAnimationFrame(tick);
  }, [inView, isNumeric, numericVal, value, shouldReduce]);

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduce ? 0 : 12 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col items-center gap-2"
    >
      <span className="font-sans text-5xl font-semibold text-white/90 sm:text-6xl tabular-nums">
        {displayed}
      </span>
      <span className="text-xs uppercase tracking-wider text-white/40">
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
      className="relative border-t border-white/[0.06] bg-[#090d14] py-12 px-6"
      aria-label="Statistics"
    >
      <div className="relative mx-auto max-w-5xl grid grid-cols-2 gap-8 sm:gap-12 lg:grid-cols-4">
        {stats.map(({ value, label }) => (
          <StatItem key={label} value={value} label={label} inView={inView} />
        ))}
      </div>
    </section>
  );
}
