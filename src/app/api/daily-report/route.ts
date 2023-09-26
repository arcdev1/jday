import { DateTime } from "luxon";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import db from "~/db";
import { makeDailyReport } from "~/models/daily-report";
import { getCurrentSession, isSessionExpired } from "~/server/session-utils";

export async function POST(req: NextRequest) {
  try {
    const session = authorize(req);
    const jsonBody = await req.json();
    const { nowUTC, startOfDayUTC, endOfDayUTC } = getESTDayBoundaryInUTC();

    const newReport = makeDailyReport({
      ...jsonBody,
      userId: session.userId,
      id: randomUUID(),
      createdAt: nowUTC.toJSDate(),
      updatedAt: nowUTC.toJSDate(),
    });

    const existingReport = await db?.dailyReport.findFirst({
      where: {
        userId: session.userId,
        createdAt: {
          gte: startOfDayUTC.toJSDate(),
          lte: endOfDayUTC.toJSDate(),
        },
      },
    });

    let dbResult;

    if (existingReport != null) {
      dbResult = await db?.dailyReport.update({
        where: { id: existingReport.id },
        data: {
          rating: newReport.rating,
          notes: newReport.notes,
          updatedAt: nowUTC.toJSDate(),
        },
      });
    } else {
      dbResult = await db?.dailyReport.create({
        data: newReport,
      });
    }

    return new NextResponse(JSON.stringify(dbResult), { status: 201 });
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

async function GET(req: NextRequest) {
  try {
    const reqUrl = new URL(req.nextUrl);
    const session = authorize(req);
    const scope = reqUrl.searchParams.get("scope")?.toLowerCase() ?? "today";
    if (scope === "today") {
      const { nowUTC, startOfDayUTC, endOfDayUTC } = getESTDayBoundaryInUTC();
      const reports = await db?.dailyReport.findMany({
        where: {
          createdAt: {
            gte: startOfDayUTC.toJSDate(),
            lte: endOfDayUTC.toJSDate(),
          },
        },
      });
    }
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

function getESTDayBoundaryInUTC() {
  const nowUTC = DateTime.utc();

  // Convert UTC to Eastern Time (automatically handles DST)
  const nowET = nowUTC.setZone("America/Toronto");

  // Get the start and end of the day in Eastern Time
  const startOfDayET = nowET.startOf("day");
  const endOfDayET = nowET.endOf("day");

  // Convert back to UTC for querying
  const startOfDayUTC = startOfDayET.toUTC();
  const endOfDayUTC = endOfDayET.toUTC();

  return { nowUTC, nowET, startOfDayUTC, endOfDayUTC };
}

function authorize(req: NextRequest) {
  const session = getCurrentSession(req);
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
