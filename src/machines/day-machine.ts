import { createMachine, assign } from "xstate";
import { Rating } from "~/models/rating";

export type DayMachineContext = {
  morningRating: Rating;
  dayRating: Rating;
  morningNotes: string | null;
  dayNotes: string | null;
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
  MORNING = "morning",
  SCHOOL_DAY = "school_day",
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

export function enterSchoolDay(): DayMachineEvent {
  return { type: "ENTER_SCHOOL_DAY" };
}

export function enterMorning(): DayMachineEvent {
  return { type: "ENTER_MORNING" };
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
  initial: "morning",
  context: {
    morningRating: Rating.UNKNOWN,
    dayRating: Rating.UNKNOWN,
    morningNotes: null,
    dayNotes: null,
  },
  states: {
    morning: {
      initial: "unknown",
      states: {
        unknown: {
          on: {
            SET_GOOD: {
              target: "good",
              actions: assign<DayMachineContext>({
                morningRating: Rating.GOOD,
              }),
            },
            SET_BAD: {
              target: "bad",
              actions: assign<DayMachineContext>({ morningRating: Rating.BAD }),
            },
          },
        },
        good: {
          on: {
            SET_GOOD: {
              target: "unknown",
              actions: assign<DayMachineContext>({
                morningRating: Rating.UNKNOWN,
              }),
            },
            SET_BAD: {
              target: "bad",
              actions: assign<DayMachineContext>({ morningRating: Rating.BAD }),
            },
            SET_NOTES: {
              actions: assign({ morningNotes: (_, event) => event.notes }),
            },
          },
        },
        bad: {
          on: {
            SET_GOOD: {
              target: "good",
              actions: assign<DayMachineContext>({
                morningRating: Rating.GOOD,
              }),
            },
            SET_BAD: {
              target: "unknown",
              actions: assign<DayMachineContext>({
                morningRating: Rating.UNKNOWN,
              }),
            },
            SET_NOTES: {
              actions: assign({ morningNotes: (_, event) => event.notes }),
            },
          },
        },
      },
      on: {
        ENTER_SCHOOL_DAY: "school_day",
        SUBMIT: "submitting",
      },
    },
    school_day: {
      initial: "unknown",
      states: {
        unknown: {
          on: {
            SET_GOOD: {
              target: "good",
              actions: assign<DayMachineContext>({
                dayRating: Rating.GOOD,
              }),
            },
            SET_BAD: {
              target: "bad",
              actions: assign<DayMachineContext>({ dayRating: Rating.BAD }),
            },
          },
        },
        good: {
          on: {
            SET_GOOD: {
              target: "unknown",
              actions: assign<DayMachineContext>({
                dayRating: Rating.UNKNOWN,
              }),
            },
            SET_BAD: {
              target: "bad",
              actions: assign<DayMachineContext>({ dayRating: Rating.BAD }),
            },
            SET_NOTES: {
              actions: assign({ morningNotes: (_, event) => event.notes }),
            },
          },
        },
        bad: {
          on: {
            SET_GOOD: {
              target: "good",
              actions: assign<DayMachineContext>({
                dayRating: Rating.GOOD,
              }),
            },
            SET_BAD: {
              target: "unknown",
              actions: assign<DayMachineContext>({
                dayRating: Rating.UNKNOWN,
              }),
            },
            SET_NOTES: {
              actions: assign({ morningNotes: (_, event) => event.notes }),
            },
          },
        },
      },
      on: {
        ENTER_MORNING: "morning",
        SUBMIT: "submitting",
      },
    },
    submitting: {
      on: {
        CANCEL: "morning",
      },
    },
  },
});

export default dayMachine;
