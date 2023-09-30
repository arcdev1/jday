"use client";

import { useDayMachine } from "~/hooks/use-day-machine";
import { Rating } from "~/models/rating";
import { Role } from "~/models/role";
import RatingIcon from "./rating-icon";
import { useSession } from "~/hooks/use-session";

export default function TodayPage() {
  const { state, send, setBad, setGood, setNotes, DayMachineState, submit } =
    useDayMachine();
  const session = useSession();

  const onRatingClick = (rating: Rating) => {
    if (rating === Rating.GOOD) {
      send(setGood());
    } else {
      send(setBad());
    }
  };

  const currentRating = state.context.rating;
  const currentNotes = state.context.notes;
  const question =
    session?.role === Role.GUARDIAN
      ? "How was Jacob's morning?"
      : "How was Jacob's day?";
  if (state.matches(DayMachineState.SUBMITTED)) {
    return <>Thanks!</>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send(submit());
      }}
    >
      <div className="flex flex-col items-center justify-center pt-12">
        <h2 className="text-4xl mb-8 text-black drop-shadow-md">{question}</h2>
        <div className="flex space-x-8 mb-4">
          <button
            type="button"
            className={`text-9xl p-4 rounded-full ${
              currentRating == Rating.GOOD
                ? "bg-green-200 border border-green-500"
                : "border border-transparent"
            }`}
            onClick={() => onRatingClick(Rating.GOOD)}
          >
            <RatingIcon rating={Rating.GOOD} />
          </button>
          <button
            type="button"
            className={`text-9xl p-4 rounded-full ${
              currentRating == Rating.BAD
                ? "bg-red-200 border border-red-500"
                : "border border-transparent"
            }`}
            onClick={() => onRatingClick(Rating.BAD)}
          >
            <RatingIcon rating={Rating.BAD} />
          </button>
        </div>
        {(currentRating != Rating.UNKNOWN || currentNotes) && (
          <>
            <label
              className="text-xl mb-4 text-black drop-shadow-md"
              htmlFor="notes"
            >
              Notes
            </label>
            <textarea
              id="notes"
              className="w-full h-32 p-2 rounded text-black"
              placeholder="Tell me more..."
              value={currentNotes ?? ""}
              onChange={(e) => send(setNotes(e.target.value))}
            ></textarea>
            <button
              type="submit"
              className="mt-4 p-2 bg-blue-500 disabled:bg-gray-300 text-white rounded"
              disabled={
                state.matches(DayMachineState.SUBMITTING) ||
                currentRating == Rating.UNKNOWN
              }
            >
              Submit
            </button>
          </>
        )}
      </div>
    </form>
  );
}
