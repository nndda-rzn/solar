import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { env } from "@/lib/env";

const SITE_URL = env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const PUBLIC_ROUTES = [
  "/",
  "/dashboard",
  "/library",
  "/help",
  "/login",
  "/signup",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of PUBLIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${route === "/" ? "" : route}`,
        lastModified,
        changeFrequency: "weekly",
        priority: route === "/" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `/${l}${route === "/" ? "" : route}`,
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
