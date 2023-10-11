import { NextRequest, NextResponse } from "next/server";
import { makeDailyReportSubmission } from "~/models/daily-report";
import {
  getCurrentSession,
  isSessionExpired,
} from "~/use-cases/helpers/session-utils";
import { viewTodaysReports } from "~/use-cases/server/view-todays-reports";
import { viewReportHistory } from "~/use-cases/server/view-report-history";
import {
  receiveReport,
  AnonymousSubmissionError,
} from "~/use-cases/server/receive-report";
import { ExpiredSessionError } from "~/use-cases/helpers/session-utils";

export async function POST(req: NextRequest) {
  try {
    const jsonBody = await req.json();
    const submission = makeDailyReportSubmission(jsonBody);
    const receivedReport = await receiveReport(submission);
    return new NextResponse(JSON.stringify(receivedReport), { status: 201 });
  } catch (error) {
    if (
      error instanceof AnonymousSubmissionError ||
      error instanceof ExpiredSessionError
    ) {
      console.warn(error);
      return new NextResponse("Unauthorized.", { status: 401 });
    }

    console.error(error);
    return new NextResponse(`Bad request. ${(error as Error).message}`, {
      status: 400,
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    const reqUrl = new URL(req.nextUrl);
    authorize(req);
    const scope = reqUrl.searchParams.get("scope")?.toLowerCase() ?? "today";

    let reports: Awaited<
      | ReturnType<typeof viewTodaysReports>
      | ReturnType<typeof viewReportHistory>
    >;

    if (scope === "today") {
      reports = await viewTodaysReports();
    } else {
      reports = await viewReportHistory();
    }

    return new NextResponse(JSON.stringify(reports ?? []), { status: 200 });
  } catch (error) {
    console.error(error);
    if (error instanceof NotAuthorizedError) {
      return new NextResponse("Unauthorized.", { status: 401 });
    }
    return new NextResponse(`Bad request. ${(error as Error).message}`, {
      status: 400,
    });
  }
}

function authorize(req: NextRequest) {
  const session = getCurrentSession(false);
  if (session == null || isSessionExpired(session)) {
    throw new NotAuthorizedError();
  }
  return session;
}

class NotAuthorizedError extends Error {
  constructor() {
    super("Unauthorized.");
  }
}
