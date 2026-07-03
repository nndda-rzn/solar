import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as "en" | "id")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      common: (await import(`@/messages/${locale}/common.json`)).default,
      simulation: (await import(`@/messages/${locale}/simulation.json`))
        .default,
      infoPanel: (await import(`@/messages/${locale}/infoPanel.json`)).default,
      planets: (await import(`@/messages/${locale}/planets.json`)).default,
      dwarfPlanets: (await import(`@/messages/${locale}/dwarfPlanets.json`))
        .default,
    },
  };
});
