import "server-only";

import { DailyReportSubmission, makeDailyReport } from "~/models/daily-report";
import { validateReportSubmission } from "~/use-cases/helpers/validate-report-submission";
import { getUTCDayBoundary } from "~/use-cases/helpers/date-time-utils";
import { getCurrentSession } from "~/use-cases/helpers/session-utils";
import { randomUUID } from "node:crypto";
import { Session } from "~/models/session";
import db from "~/db";

// This function receives a report submission.
// - reportSubmission: The submitted report.
// - reportSubmissionKey: The key for the submitted report.
export async function receiveReport(submission: DailyReportSubmission) {
  let session = getCurrentSession(true);
  session = handleAnonymousSubmission(session);
  validateReportSubmission(submission);

  //handle idempotency
  const duplicate = await findDuplicate(submission, session);
  if (duplicate) {
    return duplicate;
  }

  const nowUTC = new Date();

  const newReport = makeDailyReport({
    ...submission,
    reportedById: session.userId,
    id: randomUUID(),
    createdAt: nowUTC,
    updatedAt: nowUTC,
  });

  const { reportedBy, ...data } = newReport;
  const dbResult = await db.dailyReport.create({
    data,
    include: {
      reportedBy: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!dbResult) {
    throw new Error("Report creation failed");
  }

  return makeDailyReport(dbResult);
}

function handleAnonymousSubmission(session: Session | null) {
  if (session == null) {
    throw new AnonymousSubmissionError();
  }
  return session;
}

async function findDuplicate(
  submission: DailyReportSubmission,
  session: Session
) {
  const { startOfDayUTC, endOfDayUTC } = getUTCDayBoundary(new Date());
  const existingReports = await db.dailyReport.findMany({
    where: {
      reportedById: session.userId,
      createdAt: {
        gte: startOfDayUTC,
        lte: endOfDayUTC,
      },
    },
  });
  if (existingReports && existingReports.length > 0) {
    const duplicates = existingReports.filter(
      (report) =>
        report.rating === submission.rating && report.notes === submission.notes
    );
    if (duplicates.length == 1) {
      return duplicates[0];
    }
    if (duplicates.length > 1) {
      throw new Error(
        "Multiple reports with the same rating and notes were found."
      );
    }
  }
}

export class AnonymousSubmissionError extends Error {
  constructor() {
    super("Reports cannot be submitted anonymously.");
  }
}
