import { DailyReportSubmission } from "~/models/daily-report";
import { areNotesRequired } from "./are-notes-required";
import { Rating } from "~/models/rating";

export function canSubmitReport(submission: DailyReportSubmission) {
  let errors = [];

  const notesMissing =
    submission.notes == null || submission.notes.trim().length == 0;

  if (areNotesRequired(submission) && notesMissing) {
    errors.push("Notes are required for bad ratings.");
  }

  if (submission.rating == null || submission.rating === Rating.UNKNOWN) {
    errors.push("Please provide a rating.");
  }

  return {
    errors: errors.length > 0 ? errors : null,
    canSubmit: errors.length == 0,
  };
}
