import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function shouldRedirectToHoldingPage(pathname: string, mode: string | undefined) {
  return mode !== "demo" && pathname !== "/";
}

export function proxy(request: NextRequest) {
  if (shouldRedirectToHoldingPage(request.nextUrl.pathname, process.env.PORTAL_MODE)) {
    return NextResponse.redirect(new URL("/", request.url), 303);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
