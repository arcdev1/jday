import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentSession, isSessionExpired } from "./server/session-utils";

export function middleware(request: NextRequest) {
  const currentUrl = new URL(request.url);
  const session = getCurrentSession(request);

  const isSessionValid = session != null && !isSessionExpired(session);
  const isSessionInvalid = !isSessionValid;

  // Redirect to the root if the session is invalid and the current path is not the root
  if (isSessionInvalid && currentUrl.pathname !== "/") {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", currentUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect if the session is valid and the current path is the root
  if (isSessionValid && currentUrl.pathname == "/") {
    const next = request.nextUrl.searchParams.get("next") ?? "/secure/today";
    console.log("next", next);
    return NextResponse.redirect(new URL(next, request.url));
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
