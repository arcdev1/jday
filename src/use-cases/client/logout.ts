import { SESSION_KEY } from "~/models/session";

export async function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  const response = await fetch("/api/session", { method: "DELETE" });
  if (!response.ok) {
    throw new Error("Failed to logout.");
  }
}
