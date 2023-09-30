import { makeDailyReport } from "~/models/daily-report";

export async function viewTodaysReports() {
  const response = await fetch("/api/daily-report?scope=today");
  if (response.ok) {
    const json = await response.json();
    if (Array.isArray(json)) {
      return json.map(makeDailyReport);
    }
  }
  throw new Error("Failed to fetch reports.");
}
