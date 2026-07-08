import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080b14",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Interactive Cosmic Explorer",
    template: "%s | Cosmic Explorer",
  },
  description:
    "Explore the universe in interactive 3D — solar system, stellar neighborhood, and beyond.",
  keywords: [
    "astronomy",
    "3D",
    "interactive",
    "solar system",
    "education",
    "space exploration",
  ],
  authors: [{ name: "Cosmic Explorer Team" }],
  creator: "Cosmic Explorer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Interactive Cosmic Explorer",
    title: "Interactive Cosmic Explorer",
    description:
      "Explore the universe in interactive 3D — solar system, stellar neighborhood, and beyond.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Cosmic Explorer",
    description:
      "Explore the universe in interactive 3D — solar system, stellar neighborhood, and beyond.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
