import "server-only";

import { getUTCDayBoundary } from "~/use-cases/helpers/date-time-utils";
import db from "~/db";

export async function viewTodaysReports(today: Date = new Date()) {
  const { startOfDayUTC, endOfDayUTC } = getUTCDayBoundary(today);
  return db.dailyReport.findMany({
    where: {
      createdAt: {
        gte: startOfDayUTC,
        lte: endOfDayUTC,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      reportedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
}
