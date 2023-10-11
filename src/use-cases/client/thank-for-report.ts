import { DailyReport } from "~/models/daily-report";
import { Session } from "~/models/session";

export function thankForReport({
  session,
  report,
}: {
  session: Session;
  report?: DailyReport | null;
}) {
  if (report != null) {
    return `Thanks for letting us know, ${session.name}!`;
  }
  return null;
}
