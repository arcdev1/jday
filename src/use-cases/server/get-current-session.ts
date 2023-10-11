import "server-only";

import { type Session, makeSession, SESSION_KEY } from "~/models/session";
import { cookies } from "next/headers";

export function getCurrentSession(throwOnExpired = false) {
  const sessionCookie = cookies().get(SESSION_KEY);
  if (sessionCookie == null) {
    return null;
  }
  const session = makeSession(JSON.parse(sessionCookie.value));
  if (throwOnExpired && isSessionExpired(session)) {
    throw new ExpiredSessionError();
  }
  return session;
}

export function isSessionExpired(session: Session) {
  return session.expiry < new Date();
}

export class ExpiredSessionError extends Error {
  constructor() {
    super("Session expired.");
  }
}
