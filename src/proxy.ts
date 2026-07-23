import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
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

const isClerkProtectedRoute = createRouteMatcher([
  "/:locale/account(.*)",
]);

const isAdminRoute = createRouteMatcher([
  "/:locale/admin(.*)",
]);

const clerk = clerkMiddleware(async (auth, request) => {
  const locale = request.nextUrl.pathname.split("/")[1] || getLocale(request);

  if (isAdminRoute(request)) {
    const hasAdminAuth = request.cookies.has("ADMIN_AUTH");
    if (!hasAdminAuth) {
      const adminLoginUrl = new URL(`/${locale}/admin-login`, request.url);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  if (isClerkProtectedRoute(request)) {
    const session = await auth();
    if (!session.userId) {
      const signInUrl = new URL(`/${locale}`, request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  if (!pathnameHasLocale) {
    const newPathname = `/${locale}${pathname}`;
    const url = request.nextUrl.clone();
    url.pathname = newPathname;
    const response = NextResponse.redirect(url);
    response.cookies.set("NEXT_LOCALE", locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
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
