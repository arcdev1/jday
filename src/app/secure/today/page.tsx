import React from "react";
import TodayPage from "~/components/today-page";
import { DailyReport } from "~/models/daily-report";
import { getCurrentSession } from "~/use-cases/helpers/session-utils";
import { viewTodaysReports } from "~/use-cases/server/view-todays-reports";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = getCurrentSession();
  const reports = await viewTodaysReports(new Date());
  if (!session) return <div>Not logged in</div>;
  return (
    <TodayPage session={session} initialReports={reports as DailyReport[]} />
  );
}
