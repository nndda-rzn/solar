"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Telescope } from "lucide-react";

interface LandingNavProps {
  locale: string;
}

export function LandingNav({ locale }: LandingNavProps) {
  const t = useTranslations("landing.nav");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300",
        scrolled
          ? "bg-[#090d14]/90 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href={`/${locale}/welcome`}
          className="flex items-center gap-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
        >
          <Telescope
            className="h-5 w-5 text-cosmic-accent"
            aria-hidden="true"
          />
          <span className="font-sans text-base font-semibold tracking-wide">
            Cosmic Explorer
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {(["features", "howItWorks"] as const).map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
              >
                {t(key)}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={`/${locale}/login`}
            className="text-sm text-white/70 hover:text-white transition-colors duration-200 px-3 py-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            Log in
          </Link>
          <Link
            href={`/${locale}/signup`}
            className="inline-flex items-center gap-2 rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/90 transition-colors duration-200 hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#090d14] cursor-pointer"
          >
            {t("launch")}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="block w-5 h-px bg-current mb-1" />
          <span className="block w-5 h-px bg-current mb-1" />
          <span className="block w-5 h-px bg-current" />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#090d14]/95 backdrop-blur-md border-t border-white/[0.06] px-6 pb-6 pt-4">
          <ul className="flex flex-col gap-4" role="list">
            {(["features", "howItWorks"] as const).map((key) => (
              <li key={key}>
                <a
                  href={`#${key}`}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-white/70 hover:text-white transition-colors duration-200"
                >
                  {t(key)}
                </a>
              </li>
            ))}
            <li className="pt-2 border-t border-white/[0.06] flex flex-col gap-3">
              <Link
                href={`/${locale}/login`}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                href={`/${locale}/signup`}
                className="inline-flex items-center justify-center rounded-lg bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/90 hover:bg-white/[0.1] transition-colors duration-200 cursor-pointer"
              >
                {t("launch")}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
