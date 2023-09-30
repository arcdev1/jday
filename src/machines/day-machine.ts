import { createMachine, assign } from "xstate";
import { Rating } from "~/models/rating";

export type DayMachineContext = {
  rating: Rating;
  notes: string | null;
  error: string | null;
};

export type DayMachineEvent =
  | { type: "SET_GOOD" }
  | { type: "SET_BAD" }
  | { type: "SET_NOTES"; notes: string }
  | { type: "ENTER_SCHOOL_DAY" }
  | { type: "ENTER_MORNING" }
  | { type: "CANCEL" }
  | { type: "SUBMIT" };

export enum DayMachineState {
  UNKNOWN = "unknown",
  GOOD = "good",
  BAD = "bad",
  SUBMITTING = "submitting",
  SUBMITTED = "submitted",
  FAILED = "failed",
}

export function setGood(): DayMachineEvent {
  return { type: "SET_GOOD" };
}

export function setBad(): DayMachineEvent {
  return { type: "SET_BAD" };
}

export function setNotes(notes: string): DayMachineEvent {
  return { type: "SET_NOTES", notes };
}

export function cancel(): DayMachineEvent {
  return { type: "CANCEL" };
}

export function submit(): DayMachineEvent {
  return { type: "SUBMIT" };
}

const dayMachine = createMachine(
  {
    tsTypes: {} as import("./day-machine.typegen").Typegen0,
    predictableActionArguments: true,
    id: "dayMachine",
    initial: "unknown",
    schema: {
      events: {} as DayMachineEvent,
      services: {} as {
        submit: {
          data: Response;
        };
      },
      context: {} as DayMachineContext,
    },
    context: {
      notes: null,
      rating: Rating.UNKNOWN,
      error: null,
    },
    on: {
      SET_NOTES: {
        actions: "setNotes",
      },
      SUBMIT: "submitting",
    },
    states: {
      unknown: {
        on: {
          SET_GOOD: {
            target: "good",
            actions: assign<DayMachineContext>({
              rating: Rating.GOOD,
            }),
          },
          SET_BAD: {
            target: "bad",
            actions: assign<DayMachineContext>({ rating: Rating.BAD }),
          },
        },
      },
      good: {
        on: {
          SET_GOOD: {
            target: "unknown",
            actions: "setUnknownRating",
          },
          SET_BAD: {
            target: "bad",
            actions: "setBadRating",
          },
        },
      },
      bad: {
        on: {
          SET_GOOD: {
            target: "good",
            actions: "setGoodRating",
          },
          SET_BAD: {
            target: "unknown",
            actions: "setUnknownRating",
          },
        },
      },
      submitting: {
        on: {
          CANCEL: "unknown",
        },
        invoke: {
          src: "submit",
          onDone: {
            target: "submitted",
          },
          onError: {
            target: "failed",
          },
        },
      },
      submitted: {},
      failed: {},
    },
  },
  {
    actions: {
      setNotes: (_, event) => ({ notes: event.notes }),
      setGoodRating: () => ({ rating: Rating.GOOD }),
      setBadRating: () => ({ rating: Rating.BAD }),
      setUnknownRating: () => ({ rating: Rating.UNKNOWN }),
    },
    services: {
      submit: async (context) =>
        fetch("/api/daily-report", {
          method: "POST",
          body: JSON.stringify({
            rating: context.rating,
            notes: context.notes,
          }),
        }),
    },
  }
);

export default dayMachine;
