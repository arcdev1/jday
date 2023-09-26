import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentSession, isSessionExpired } from "./server/session-utils";

export function middleware(request: NextRequest) {
  const currentUrl = new URL(request.url);
  const session = getCurrentSession(request);

  // Check if the session is null or expired
  const isSessionInvalid = session == null || isSessionExpired(session);

  // Redirect to the root if the session is invalid and the current path is not the root
  if (isSessionInvalid && currentUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url).href);
  }

  // Redirect to /secure/today if the session is valid and the current path is the root
  if (!isSessionInvalid && currentUrl.pathname == "/") {
    return NextResponse.redirect(new URL("/secure/today", request.url));
  }

  // Continue to the next middleware or route handler
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api/session|_next/static|_next/image|favicon.ico).*)",
  ],
};
