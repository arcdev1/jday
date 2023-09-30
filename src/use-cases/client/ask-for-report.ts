import { Session } from "~/models/session";
import { Role } from "~/models/role";

export function askForReport({
  name,
  role,
}: {
  name: Session["name"];
  role: Session["role"];
}) {
  switch (role) {
    case Role.GUARDIAN:
      return `Hi ${name}, how was Jacob's morning?`;
    case Role.EDUCATOR:
      return `Hi ${name}, how was Jacob's day?`;
    default:
      return `Hi ${name}, how's Jacob'?`;
  }
}
