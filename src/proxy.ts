import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

const clerk = clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // 1. Check Admin routes (e.g. /admin, /admin/orders, but NOT /admin-login)
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const hasAdminAuth = request.cookies.has("ADMIN_AUTH");
    if (!hasAdminAuth) {
      const adminLoginUrl = new URL(`/admin-login`, request.url);
      return NextResponse.redirect(adminLoginUrl);
    }
  }

  // 2. Check Clerk Protected routes (e.g. /account)
  if (pathname === "/account" || pathname.startsWith("/account/")) {
    const session = await auth();
    if (!session.userId) {
      const signInUrl = new URL(`/`, request.url);
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
