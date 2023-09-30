import { DateTime } from "luxon";

export function toUTC(date: Date) {
  return DateTime.fromJSDate(date).toUTC().toJSDate();
}

export function getESTDayBoundaryInUTC() {
  const now = DateTime.fromJSDate(toEST(new Date()));
  const startOfDay = now.startOf("day");
  const endOfDay = now.endOf("day");
  const nowUTC = now.toUTC();
  const startOfDayUTC = startOfDay.toUTC();
  const endOfDayUTC = endOfDay.toUTC();
  return { nowUTC, startOfDayUTC, endOfDayUTC };
}

export function toEST(date: Date) {
  return DateTime.fromJSDate(date).setZone("America/Toronto").toJSDate();
}
