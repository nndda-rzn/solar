"use client";

import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import { CosmicLoader } from "@/components/ui/CosmicLoader";
import { useTranslations } from "next-intl";

export function SceneLoader() {
  const { active, progress } = useProgress();
  const t = useTranslations("common");

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-[60]"
        >
          <CosmicLoader label={t("loader.loading")} progress={progress} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
