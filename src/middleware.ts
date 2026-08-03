import { NextRequest, NextFetchEvent } from "next/server";
import { proxy } from "./proxy";

export function middleware(request: NextRequest, event: NextFetchEvent) {
  return proxy(request, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
