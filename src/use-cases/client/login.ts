import { type Credential } from "~/models/credential";
import { SESSION_KEY, makeSession } from "~/models/session";

export async function login(credential: Credential) {
  const response = await fetch("/api/session", {
    method: "POST",
    body: JSON.stringify(credential),
  });

  if (response.ok) {
    const session = makeSession(await response.json());
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } else {
    throw new Error(`Login failed. (${response.status})`);
  }
}
