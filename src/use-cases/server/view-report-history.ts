import "server-only";

import db from "~/db";

export async function viewReportHistory() {
  return db.dailyReport.findMany({
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
