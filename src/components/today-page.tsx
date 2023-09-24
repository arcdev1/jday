"use client";

import { useEffect, useState } from "react";
import {
  enterMorning,
  enterSchoolDay,
  setBad,
  setGood,
  submit,
  useDayMachine,
  DayMachineState,
} from "~/hooks/use-day-machine";
import { useSession } from "~/hooks/use-session";
import { Rating } from "~/models/rating";
import RatingIcon from "./rating-icon";

export default function TodayPage() {
  const { state, send } = useDayMachine();
  const session = useSession();
  const currentTime = new Date();

  const isMorning = currentTime.getHours() < 12;

  useEffect(() => {
    if (isMorning) {
      send(enterMorning());
    } else {
      send(enterSchoolDay());
    }
  }, [isMorning, send]);

  const handleEmojiClick = (emoji: string) => {
    if (emoji === "👍") {
      send(setGood());
    } else {
      send(setBad());
    }
  };

  const currentRating = state.matches(DayMachineState.MORNING)
    ? state.context.morningRating
    : state.context.dayRating;

  const currentNotes = state.matches(DayMachineState.MORNING)
    ? state.context.morningNotes
    : state.context.dayNotes;

  console.log(currentRating);
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send(submit());
      }}
    >
      <div className="flex flex-col items-center justify-center pt-12">
        <h2 className="text-4xl mb-8 text-black drop-shadow-md">
          {isMorning
            ? `How was Jacob's morning${
                session != null ? `, ${session.name}` : ""
              }?`
            : `How was Jacob's day?`}
        </h2>
        <div className="flex space-x-8 mb-4">
          <button
            type="button"
            className={`text-9xl p-4 rounded-full ${
              currentRating == Rating.GOOD
                ? "bg-green-200 border border-green-500"
                : "border border-transparent"
            }`}
            onClick={() => handleEmojiClick("👍")}
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
            onClick={() => handleEmojiClick("👎")}
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
              onChange={(e) =>
                send({ type: "SET_NOTES", notes: e.target.value })
              }
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
