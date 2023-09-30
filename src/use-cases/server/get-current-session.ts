import { NextRequest } from "next/server";
import { type Session, makeSession, SESSION_KEY } from "~/models/session";

export function getCurrentSession(req: NextRequest, throwOnExpired = false) {
  const sessionCookie = req.cookies.get(SESSION_KEY);
  if (sessionCookie == null) {
    return null;
  }
  const session = makeSession(JSON.parse(sessionCookie.value));
  if (throwOnExpired && isSessionExpired(session)) {
    throw new Error("Session expired.");
  }
  return session;
}

export function isSessionExpired(session: Session) {
  return session.expiry < new Date();
}
