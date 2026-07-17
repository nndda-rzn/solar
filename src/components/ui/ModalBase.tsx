"use client";

import { useEffect, type ReactNode, type RefObject } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CloseButton } from "./CloseButton";

interface ModalBaseProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel: string;
  icon?: ReactNode;
  title?: string;
  children: ReactNode;
  maxWidthClassName?: string;
  roundedClassName?: string;
  backgroundClassName?: string;
}

export function ModalBase({
  isOpen,
  onClose,
  ariaLabel,
  icon,
  title,
  children,
  maxWidthClassName = "max-w-md",
  roundedClassName = "rounded-xl",
  backgroundClassName = "bg-cosmic-deep/95",
}: ModalBaseProps) {
  const t = useTranslations("common");
  const modalRef = useFocusTrap(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-md"
        >
          <motion.div
            ref={modalRef as RefObject<HTMLDivElement>}
            role="dialog"
            aria-modal="true"
            aria-label={ariaLabel}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className={`relative w-full ${maxWidthClassName} ${roundedClassName} border border-white/10 ${backgroundClassName} p-6 shadow-xl`}
          >
            <CloseButton onClick={onClose} ariaLabel={t("close")} />

            {(icon || title) && (
              <div className="mb-4 flex items-center gap-2">
                {icon}
                {title && (
                  <h2 className="text-lg font-bold text-white">{title}</h2>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
