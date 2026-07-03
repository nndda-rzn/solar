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
      ...(await import(`@/messages/${locale}/common.json`)),
      ...(await import(`@/messages/${locale}/simulation.json`)),
      ...(await import(`@/messages/${locale}/infoPanel.json`)),
      ...(await import(`@/messages/${locale}/planets.json`)),
      ...(await import(`@/messages/${locale}/dwarfPlanets.json`)),
    },
  };
});
