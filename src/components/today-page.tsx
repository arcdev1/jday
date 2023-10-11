"use client";

import { Rating } from "~/models/rating";
import RatingIcon from "./rating-icon";
import { useDailyReport } from "~/hooks/use-daily-report";
import TextareaAutosize from "react-textarea-autosize";
import ReportCard from "./report-card";
import { Session } from "~/models/session";
import { DailyReport } from "~/models/daily-report";
import { BeatLoader } from "react-spinners";
import { areNotesRequired } from "~/use-cases/helpers/are-notes-required";

export default function TodayPage({
  session,
  initialReports,
}: {
  session: Session;
  initialReports?: DailyReport[];
}) {
  const {
    canEditNotes,
    disableSubmit,
    error,
    hasSubmitted,
    isSubmitting,
    notes,
    question,
    rateBad,
    rateGood,
    rating,
    reports,
    reset,
    setNotes,
    submit,
    thanks,
  } = useDailyReport({ initialReports, session });

  return (
    <div className="flex flex-col items-center justify-center pt-12">
      {hasSubmitted() ? (
        <>
          <h1 className="text-3xl mt-4">{thanks}</h1>
          <button
            onClick={reset}
            className="bg-blue-500 py-2 px-4 rounded text-white mt-4"
          >
            Report something else
          </button>
        </>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
        >
          {error && <div className="text-red-500 mb-4">{error.message}</div>}
          <h1 className="text-3xl mb-8 text-black drop-shadow-md text-center">
            {question}
          </h1>
          <div className="flex space-x-8 mb-4 w-full justify-center">
            <button
              id="good"
              name="good"
              type="button"
              className={`text-9xl p-4 rounded-full ${
                rating == Rating.GOOD
                  ? "bg-green-200 border border-green-500"
                  : "border border-transparent"
              }`}
              onClick={rateGood}
            >
              <RatingIcon rating={Rating.GOOD} />
            </button>
            <button
              type="button"
              className={`text-9xl p-4 rounded-full ${
                rating == Rating.BAD
                  ? "bg-red-200 border border-red-500"
                  : "border border-transparent"
              }`}
              onClick={rateBad}
            >
              <RatingIcon rating={Rating.BAD} />
            </button>
          </div>

          {canEditNotes() && (
            <>
              <label
                className="text-xl mb-4 text-black drop-shadow-md"
                htmlFor="notes"
              >
                Notes:
              </label>

              <TextareaAutosize
                id="notes"
                minRows={3}
                className="w-full h-32 p-2 rounded text-black resize-y"
                placeholder="Tell me more..."
                value={notes ?? ""}
                required={areNotesRequired({ rating })}
                onChange={(e) => setNotes(e.target.value)}
              ></TextareaAutosize>
              <button
                type="submit"
                className="mt-4 p-2 bg-blue-500 disabled:bg-gray-300 text-white rounded w-full"
                disabled={disableSubmit()}
              >
                {isSubmitting() ? <BeatLoader /> : "Submit"}
              </button>
            </>
          )}
        </form>
      )}
      <div>
        <hr className="border border-1 border-blue-200 m-4"></hr>
        {reports?.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
