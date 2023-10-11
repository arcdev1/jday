// External libraries
import { createMachine, assign } from "xstate";

// Type imports
import type { Session } from "~/models/session";

// Internal modules
import { Rating } from "~/models/rating";
import { DailyReport } from "~/models/daily-report";
import { submitDailyReport } from "~/use-cases/client/submit-daily-report";
import { thankForReport } from "~/use-cases/client/thank-for-report";
import { canSubmitReport } from "~/use-cases/helpers/can-submit-report";
import { askForReport } from "~/use-cases/client/ask-for-report";

export function setNotesAction(notes: string) {
  return {
    type: "SET_NOTES",
    notes,
  } as const;
}

export function submitAction() {
  return {
    type: "SUBMIT",
  } as const;
}

export function rateGoodAction() {
  return {
    type: "RATE_GOOD",
  } as const;
}

export function rateBadAction() {
  return {
    type: "RATE_BAD",
  } as const;
}

export function resetAction() {
  return {
    type: "RESET",
  } as const;
}

type DailyReportMachineEvents =
  | {
      type: "SET_NOTES";
      notes: string;
    }
  | {
      type: "SUBMIT";
    }
  | {
      type: "RATE_GOOD";
    }
  | {
      type: "RATE_BAD";
    }
  | {
      type: "RESET";
    };

export const dailyReportMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QQIYEsA2BPASmADgPYBOALgLIoDGAFmgHZgDEAygKIAqA+gHIDyHNiwDaABgC6iUEVhpSaQvSkgAHogCMo0QE4AdADYA7AFYAHACZD2gCznN64wBoQWDeYC+756ky4CJCmo6Rl0oQkIIABEULFYAVQAhcgBJDjFJJBAZOQUlTLUEdXVzUQMrfWttbRLrUQBmZ1cEQ3U9Err1Iy1jYwrjT290bDwiMkpaBjBQ8KiYphwAQUEuAHE+Pkj05Wz5RWUC4rrTXVNjGx1tfVN9OoaXRFtDXXb1E211a2NDS2sBkB9hv4xkFJtMItFYotlgkFpsJNtCLJdnlQAd9OZjLp6tpRFZRNZTCZGogeupdB1tBZTtZrEV3n8AX5RoEJiEAEYoWaxFiJFJpeGZHa5fYadGY7G4nEEon3BCXUqGerqUyU3HGEqGBlDJkBcbBKYcrnzJZsVbrOEZaSInJ7fIaQx1ay6Sp2aqKw7mfTEhD6URk0ytU7qR2+kx1LW+Ea6kHszkQ43Q2FbQXW5EiwqGaxPExaNWGQz6Mzmb0YzHaYwdD6fYyvQymUwRwHMvWg1BYHiEUg4FCkSAJ01rDbJq1I4V2wrFUpGS6Var4+rerPZpWUlqF8wq-SNnXA1lTNsdrs9vtQ00wi0I0e21EaSdlGdVGoL2V1Au6RV1HSnKr6csmbdRru+q6Aenbdr2ECsJwvACEIw5ZKmY43s0b7GKI5iehUdZmJ0JY0gYAa3BYHSehhW5eP82qASywGwAArmyAC2cjyPQUBMBAihTAwABuhAANb7lRQI0aC9FMSxDBQAgvGEFQPa5Ok8FCteqiIJ6pSvJcLQmB8dSXIuWhYp0Bb6Z0xSXORgyRiJLYhOJzGkKx7FgMQxAkLo+AYD2ABmJCMSBwnNjGUwOZJbEyfQfHyciSkCiONoompCC9Loyp1GctSUhlpi0t6AZkmYty+uYn5Vh4FGMtRdmhQxjnOUwrnucQnneaQfnEAFVW2SFuhhU5UmRdFCmKEp6iWghV5JQUGlpeUOk1tY+lerKZx6OWHSEhUdR2NYVmUTZwV7n1dXhS5bkeV5vn+YFh3Rsd-XOUNckjfQSnmBNKnTepvpzdpryLct+W0s6FbpcqhKaPt3VHcBpA0Cg9D8QAmoQdHzEInDKYhqkFL+Ty3GcgblhYmaLkUuhVMV5kmAW5EUfQERwMoMP3fql6Jem1jA2lhFoacJRquGlVBWzoJhOCMQc2m44fOhWIkVYGUZTo3q9JitQdGhFT1KI6IAT1x2GhC0tIclrS4gYOvoqI1yaISastM8uUme82j6eWBuw62MSHuBkCm7jiCnHUzyXKYRG0uHpiLpYWIVuYBKesGJgVl7Yv2adA1sYH30pcWsrvKU9R9N8VN2+nQGgvDiMo2jufpl8TpGMqnxHL6uUF00S0a7+OLK0RDqeJ4QA */
    tsTypes: {} as import("./daily-report-machine.typegen").Typegen0,
    predictableActionArguments: true,
    id: "dailyReportMachine",
    initial: "dayNotRated",
    entry: ["ensureSession", "setQuestion"],
    context: {
      error: undefined as undefined | Error,
      notes: undefined as undefined | string,
      rating: Rating.UNKNOWN as Rating,
      reports: undefined as undefined | DailyReport[],
      thanks: null as null | string,
      question: undefined as undefined | string,
      session: null as null | Session,
    },
    schema: {
      events: {} as DailyReportMachineEvents,
      services: {} as {
        submit: {
          data: DailyReport;
        };
      },
    },
    on: {
      SET_NOTES: {
        actions: "setNotes",
      },
    },
    states: {
      goodDay: {
        entry: "setRatingGood",
        on: {
          SUBMIT: [
            {
              cond: "canSubmitGoodDay",
              target: "submitting",
            },
          ],
          RATE_GOOD: "dayNotRated",
          RATE_BAD: "badDay",
        },
      },
      badDay: {
        entry: "setRatingBad",
        on: {
          SUBMIT: [
            {
              cond: "canSubmitBadDay",
              target: "submitting",
            },
          ],
          RATE_GOOD: "goodDay",
          RATE_BAD: "dayNotRated",
        },
      },
      dayNotRated: {
        entry: "setRatingUnknown",
        on: {
          RATE_GOOD: {
            target: "goodDay",
          },
          RATE_BAD: {
            target: "badDay",
          },
          SET_NOTES: {
            cond: "hasNotes",
            actions: "setNotes",
          },
        },
      },
      submitting: {
        invoke: {
          src: "submit",
          onDone: {
            actions: ["setReports", "setThanks"],
            target: "thankYou",
          },
          onError: [
            {
              actions: "setError",
            },
            {
              cond: "isRatingGood",
              target: "goodDay",
            },
            {
              cond: "isRatingBad",
              target: "badDay",
            },
          ],
        },
      },
      thankYou: {
        on: {
          RESET: {
            actions: "resetContext",
            target: "dayNotRated",
          },
        },
      },
    },
  },
  {
    actions: {
      ensureSession: (context) => {
        if (!context.session) {
          throw new Error("Session is required");
        }
      },
      setQuestion: assign({
        question: (context) => askForReport(context.session!),
      }),
      setNotes: assign({
        notes: (_, event) => event.notes,
      }),
      setRatingGood: assign({
        rating: () => Rating.GOOD,
      }),
      setRatingBad: assign({
        rating: () => Rating.BAD,
      }),
      setRatingUnknown: assign({
        rating: () => Rating.UNKNOWN,
      }),
      setReports: assign((context, event) => ({
        reports: [event.data, ...(context.reports ?? [])],
      })),
      setThanks: assign((context, event) => ({
        thanks: thankForReport({
          session: context.session!,
          report: event.data,
        }),
      })),
      resetContext: assign({
        notes: undefined,
        rating: Rating.UNKNOWN,
        error: undefined,
        thanks: undefined,
      }),
      setError: assign({
        error: (_, event) => event.data as Error,
      }),
    },
    guards: {
      canSubmitGoodDay: (context) =>
        canSubmitReport({
          rating: Rating.GOOD,
          notes: context.notes,
        }).canSubmit,
      canSubmitBadDay: (context) =>
        canSubmitReport({
          rating: Rating.BAD,
          notes: context.notes,
        }).canSubmit,
      hasNotes: (_, event) => event.notes != null && event.notes.trim() !== "",
      isRatingGood: (context) => context.rating === Rating.GOOD,
      isRatingBad: (context) => context.rating === Rating.BAD,
    },
    services: {
      submit: submitDailyReport,
    },
  }
);
