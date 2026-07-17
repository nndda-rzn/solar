import { useTranslations } from "next-intl";
import Link from "next/link";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { QuoteSection } from "@/components/landing/QuoteSection";
import { CtaSection } from "@/components/landing/CtaSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

interface WelcomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function WelcomePage({ params }: WelcomePageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#080b14] text-white">
      <LandingNav locale={locale} />
      <main>
        <HeroSection locale={locale} />
        <FeaturesSection />
        <HowItWorksSection />
        <StatsSection />
        <QuoteSection />
        <CtaSection locale={locale} />
      </main>
      <LandingFooter locale={locale} />
    </div>
  );
}
