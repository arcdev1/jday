import { DailyReportSubmission } from "~/models/daily-report";
import { canSubmitReport } from "./can-submit-report";

export function validateReportSubmission(submmission: DailyReportSubmission) {
  const { errors, canSubmit } = canSubmitReport(submmission);
  if (!canSubmit) {
    throw new Error(errors?.join("\n") ?? "Failed to submit report.");
  }
}
