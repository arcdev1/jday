import { DailyReport } from "~/models/daily-report";
import RatingIcon from "~/components/rating-icon";
import { useState } from "react";

export default function ReportCard({ report }: { report: DailyReport }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const bg = report.rating == "GOOD" ? "bg-green-200" : "bg-red-200";
  const time = (report.updatedAt ?? report.createdAt).toLocaleTimeString(
    "en-CA",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }
  );
  const okOrDistresses = report.rating == "GOOD" ? "okay" : "distressed";
  return (
    <div
      className={`border rounded-lg items-center justify-center py-2 px-4 flex border-gray-800 shadow shadow-black bg-slate-100 mb-4 gap-4 cursor-pointer max-w-11/12`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div
        className={`text-2xl rounded-full ${bg} py-1 px-2 shadow shadow-black`}
      >
        <RatingIcon rating={report.rating} />
      </div>
      <div
        className={`${isExpanded ? "h-auto" : "h-12 truncate"} max-w-lg w-full`}
      >
        At {time}{" "}
        <a
          href={`mailto:${report.reportedBy?.email}`}
          className="underline text-blue-600 font-semibold"
        >
          {report.reportedBy?.name}
        </a>{" "}
        said that Jacob was <strong>{okOrDistresses}</strong>.
        {report.notes && (
          <p>
            <strong>Notes:</strong> &ldquo;{report.notes}&rdquo;
          </p>
        )}
      </div>
    </div>
  );
}
