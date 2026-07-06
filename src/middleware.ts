import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/utils/supabase/middleware";

const intlMiddleware = createMiddleware(routing);

// Routes that do not require an authenticated session.
// Matched against the path with the locale prefix stripped.
const PUBLIC_PATHS = ["/login", "/signup"];

function isPublicPath(pathWithoutLocale: string) {
  return PUBLIC_PATHS.some(
    (path) =>
      pathWithoutLocale === path || pathWithoutLocale.startsWith(`${path}/`),
  );
}

export default async function middleware(request: NextRequest) {
  // Refresh the Supabase session first so `user` reflects the current
  // (possibly just-refreshed) auth state.
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/(${routing.locales.join("|")})`), "") || "/";

  if (!user && !isPublicPath(pathWithoutLocale)) {
    const locale =
      routing.locales.find((l) => pathname.startsWith(`/${l}`)) ??
      routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isPublicPath(pathWithoutLocale)) {
    const locale =
      routing.locales.find((l) => pathname.startsWith(`/${l}`)) ??
      routing.defaultLocale;
    const homeUrl = new URL(`/${locale}`, request.url);
    return NextResponse.redirect(homeUrl);
  }

  // Let next-intl handle locale detection/rewriting, then merge in the
  // Supabase session cookies so the refreshed session isn't lost.
  const intlResponse = intlMiddleware(request);
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value);
  });

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
