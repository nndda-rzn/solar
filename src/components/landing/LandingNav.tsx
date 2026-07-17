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
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#080b14]/90 backdrop-blur-md border-b border-white/5 shadow-lg"
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
          className="flex items-center gap-2 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-sm"
        >
          <Telescope className="h-5 w-5 text-[#4a9eff]" aria-hidden="true" />
          <span className="font-playfair text-lg font-semibold tracking-wide">
            Cosmic Explorer
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {(["features", "howItWorks"] as const).map((key) => (
            <li key={key}>
              <a
                href={`#${key}`}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-sm"
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
            className="text-sm text-white/70 hover:text-white transition-colors duration-200 px-3 py-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff]"
          >
            Log in
          </Link>
          <Link
            href={`/${locale}/signup`}
            className="inline-flex items-center gap-2 rounded-full bg-[#4a9eff] px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[#7cb9ff] hover:shadow-[0_0_20px_rgba(74,158,255,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080b14] cursor-pointer"
          >
            {t("launch")}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-white/70 hover:text-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-sm"
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
        <div className="md:hidden bg-[#080b14]/95 backdrop-blur-md border-t border-white/5 px-6 pb-6 pt-4">
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
            <li className="pt-2 border-t border-white/10 flex flex-col gap-3">
              <Link
                href={`/${locale}/login`}
                className="text-sm text-white/70 hover:text-white transition-colors duration-200"
              >
                Log in
              </Link>
              <Link
                href={`/${locale}/signup`}
                className="inline-flex items-center justify-center rounded-full bg-[#4a9eff] px-5 py-2 text-sm font-medium text-white hover:bg-[#7cb9ff] transition-all duration-200 cursor-pointer"
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
