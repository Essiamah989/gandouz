import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "en";

function getLocale(request: NextRequest) {
  // Check if a cookie is set for the locale
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  // Basic language detection from Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    if (acceptLanguage.startsWith("fr")) return "fr";
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip for API routes, static files, and images
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  let newPathname = pathname;
  let shouldRedirect = false;

  // Add locale prefix if missing
  if (!pathnameHasLocale) {
    newPathname = `/${locale}${pathname}`;
    shouldRedirect = true;
  }

  // Admin route protection — redirect to login if no auth cookie
  const isAdminRoute =
    newPathname.includes("/admin") && !newPathname.includes("/admin-login");
  if (isAdminRoute) {
    const isAdminAuth = request.cookies.get("ADMIN_AUTH")?.value === "true";
    if (!isAdminAuth) {
      // Determine the effective locale for the login path
      const effectiveLocale = pathnameHasLocale
        ? locales.find((loc) => pathname.startsWith(`/${loc}`)) || defaultLocale
        : locale;
      newPathname = `/${effectiveLocale}/admin-login`;
      shouldRedirect = true;
    }
  }

  if (shouldRedirect) {
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    const response = NextResponse.redirect(url);
    // Persist locale preference in cookie
    response.cookies.set("NEXT_LOCALE", locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
