import { useMachine } from "@xstate/react";
import { useCallback } from "react";
import {
  rateBadAction,
  rateGoodAction,
  setNotesAction,
  submitAction,
  resetAction,
  dailyReportMachine,
} from "~/machines/daily-report-machine";
import { DailyReport } from "~/models/daily-report";
import { Rating } from "~/models/rating";
import { Session } from "~/models/session";
import { deepFreeze } from "~/utils/deep-freeze";

export function useDailyReport({
  initialReports,
  session,
}: {
  initialReports?: DailyReport[];
  session: Session;
}) {
  const [state, send] = useMachine(dailyReportMachine, {
    context: { reports: initialReports, session },
  });
  const { context } = state;
  const { error, rating, notes, question, thanks, reports } = context;

  const rateGood = useCallback(
    function rateGood() {
      send(rateGoodAction());
    },
    [send]
  );

  const rateBad = useCallback(
    function rateBad() {
      send(rateBadAction());
    },
    [send]
  );

  const setNotes = useCallback(
    function setNotes(notes: string) {
      send(setNotesAction(notes));
    },
    [send]
  );

  const submit = useCallback(
    function submit() {
      send(submitAction());
    },
    [send]
  );

  const reset = useCallback(
    function reset() {
      send(resetAction());
    },
    [send]
  );

  return deepFreeze({
    error,
    rating,
    notes,
    question,
    thanks,
    reports,
    reset,
    isSubmitting: () => state.matches("submitting"),
    hasSubmitted: () => state.matches("thankYou"),
    canEditNotes: () => rating != Rating.UNKNOWN || notes,
    disableSubmit: () =>
      rating === Rating.UNKNOWN || state.matches("submitting"),
    rateGood,
    rateBad,
    setNotes,
    submit,
  });
}
