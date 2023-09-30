import { SESSION_KEY, Session, makeSession } from "~/models/session";
import { toUTC } from "~/utils/date-time-utils";

/**
 * Retrieves the current session, either from cache or from the server.
 *
 * @returns {Promise<Session | null>} The current session or null if not available or expired.
 */
export async function getCurrentSession(): Promise<Session | null> {
  const cachedSession = getCachedSession();
  if (cachedSession != null) {
    return cachedSession;
  }

  const session = await getServersideSession();
  if (session != null) {
    saveSession(session);
  }
  return session;
}

/**
 * Retrieves the session from the browser's sessionStorage.
 *
 * @returns {Session | null} The cached session or null if not available or expired.
 */
function getCachedSession(): Session | null {
  const cachedSession = sessionStorage.getItem(SESSION_KEY);
  if (cachedSession) {
    const sessionJson = JSON.parse(cachedSession);
    if (!isSessionExpired(sessionJson)) {
      return makeSession(sessionJson);
    }
  }
  return null;
}

/**
 * Fetches the session from the server.
 *
 * @returns {Promise<Session | null>} The session from the server or null if not available or expired.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
async function getServersideSession(): Promise<Session | null> {
  const res = await fetch("/api/session");
  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  const newSession: Session = makeSession(json);

  if (isSessionExpired(newSession)) {
    return null;
  }
  return newSession;
}

/**
 * Saves the session to the browser's sessionStorage.
 *
 * @param {Session} session - The session to be saved.
 */
function saveSession(session: Session): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

/**
 * Checks if the session is expired.
 *
 * @param {Session} session - The session to be checked.
 * @returns {boolean} True if the session is expired, otherwise false.
 */
function isSessionExpired(session: Session): boolean {
  const now = toUTC(new Date());
  return session.expiry < now;
}
