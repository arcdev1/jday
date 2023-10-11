import { Session } from "~/models/session";
import { Role } from "~/models/role";
import { DailyReport } from "~/models/daily-report";

export function askForReport({
  name,
  role,
}: {
  name: Session["name"];
  role: Session["role"];
}) {
  if (role === Role.GUARDIAN) {
    return `Hi ${name}, how was Jacob's morning?`;
  }

  return `Hi ${name}, how's Jacob?`;
}
