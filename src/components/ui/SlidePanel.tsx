"use client";

import type { ReactNode, RefObject } from "react";
import { CloseButton } from "./CloseButton";

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  ariaLabel?: string;
  closeAriaLabel: string;
  panelRef: RefObject<HTMLElement | null>;
  children: ReactNode;
}

/**
 * Shared right-side slide-in panel shell: backdrop + translate transition
 * + close button. Used by InfoPanel and StellarInfoPanel to avoid
 * duplicating the aside/backdrop/transition boilerplate.
 */
export function SlidePanel({
  isOpen,
  onClose,
  ariaLabel,
  closeAriaLabel,
  panelRef,
  children,
}: SlidePanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <aside
        ref={panelRef as RefObject<HTMLElement>}
        role="dialog"
        aria-modal={isOpen}
        aria-label={ariaLabel}
        className={`fixed right-0 top-0 z-50 flex h-full w-96 flex-col overflow-y-auto border-l border-white/10 bg-black/80 backdrop-blur-xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } pointer-events-auto`}
      >
        <CloseButton
          onClick={onClose}
          ariaLabel={closeAriaLabel}
          className="transition-all duration-200 hover:bg-white/10"
        />
        {children}
      </aside>
    </>
  );
}
