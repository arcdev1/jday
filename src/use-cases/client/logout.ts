import { SESSION_KEY } from "~/models/session";

export async function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  fetch("/api/session", { method: "DELETE" });
}
