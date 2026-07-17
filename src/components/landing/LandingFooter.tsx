"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Telescope } from "lucide-react";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

interface LandingFooterProps {
  locale: string;
}

export function LandingFooter({ locale }: LandingFooterProps) {
  const t = useTranslations("landing.footer");

  return (
    <footer className="relative bg-[#080b14] border-t border-white/5 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <Link
            href={`/${locale}/welcome`}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-sm"
          >
            <Telescope className="h-4 w-4 text-[#4a9eff]" aria-hidden="true" />
            <span className="font-playfair text-sm font-semibold tracking-wide">
              {t("brand")}
            </span>
          </Link>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul
              className="flex flex-wrap items-center justify-center gap-6"
              role="list"
            >
              <li>
                <Link
                  href={`/${locale}/help`}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-sm"
                >
                  {t("links.help")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}`}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-sm"
                >
                  {t("links.explorer")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/dashboard`}
                  className="text-xs text-white/40 hover:text-white/70 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4a9eff] rounded-sm"
                >
                  {t("links.dashboard")}
                </Link>
              </li>
              <li>
                <LanguageToggle />
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-xs text-white/20">
          {t("copyright")}
        </p>
      </div>
    </footer>
  );
}
