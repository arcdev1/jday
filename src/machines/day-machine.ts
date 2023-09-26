import { createMachine, assign } from "xstate";
import { Rating } from "~/models/rating";

export type DayMachineContext = {
  rating: Rating;
  notes: string | null;
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

const dayMachine = createMachine<DayMachineContext, DayMachineEvent>({
  predictableActionArguments: true,
  id: "dayMachine",
  initial: "unknown",
  context: {
    notes: null,
    rating: Rating.UNKNOWN,
  },
  on: {
    SET_NOTES: {
      actions: assign({ notes: (_, event) => event.notes }),
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
          actions: assign<DayMachineContext>({
            rating: Rating.UNKNOWN,
          }),
        },
        SET_BAD: {
          target: "bad",
          actions: assign<DayMachineContext>({ rating: Rating.BAD }),
        },
      },
    },
    bad: {
      on: {
        SET_GOOD: {
          target: "good",
          actions: assign<DayMachineContext>({
            rating: Rating.GOOD,
          }),
        },
        SET_BAD: {
          target: "unknown",
          actions: assign<DayMachineContext>({
            rating: Rating.UNKNOWN,
          }),
        },
      },
    },
    submitting: {
      on: {
        CANCEL: "unknown",
      },
    },
  },
});

export default dayMachine;
