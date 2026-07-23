import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

const locales = ["en", "fr"];
const defaultLocale = "en";

function getLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  if (cookieLocale && locales.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    if (acceptLanguage.startsWith("fr")) return "fr";
  }

  return defaultLocale;
}

const clerk = clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 1. Ensure locale prefix exists
  const currentLocale = locales.find(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (!currentLocale) {
    const locale = getLocale(request);
    const newPathname = `/${locale}${pathname === "/" ? "" : pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  }

  // Extract path after locale, e.g. "/en/admin/orders" -> "/admin/orders"
  const unprefixedPath = pathname.substring(currentLocale.length + 1) || "/";

  // 2. Check Admin routes (e.g. /admin, /admin/orders, but NOT /admin-login)
  if (unprefixedPath === "/admin" || unprefixedPath.startsWith("/admin/")) {
    const hasAdminAuth = request.cookies.has("ADMIN_AUTH");
    if (!hasAdminAuth) {
      const adminLoginUrl = new URL(`/${currentLocale}/admin-login`, request.url);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // 3. Check Clerk Protected routes (e.g. /account)
  if (unprefixedPath === "/account" || unprefixedPath.startsWith("/account/")) {
    const session = await auth();
    if (!session.userId) {
      const signInUrl = new URL(`/${currentLocale}`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  return clerk(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
