import { DailyReportSubmission, makeDailyReport } from "~/models/daily-report";
import { validateReportSubmission } from "../helpers/validate-report-submission";

export async function submitDailyReport(report: DailyReportSubmission) {
  validateReportSubmission(report);

  let trimmedNotes = report.notes?.trim();
  if (trimmedNotes && trimmedNotes.length === 0) {
    trimmedNotes = undefined;
  }

  const normalizedReport = { ...report, notes: trimmedNotes };

  const response = await fetch("/api/daily-report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(normalizedReport),
  });

  if (!response.ok) {
    throw new Error("Failed to submit daily report.");
  }

  let json = await response.json();
  return makeDailyReport(json);
}
