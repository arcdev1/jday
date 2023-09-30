import { createMachine, assign } from "xstate";
import { Rating } from "~/models/rating";
import { DailyReport } from "~/models/daily-report";
import { viewTodaysReports } from "~/use-cases/client/view-todays-reports";

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

export const dailyReportMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QQIYEsA2BPASmADgPYBOALgLIoDGAFmgHZgB0GhKEDUeRZsAxBEKMmDAG6EA1s1SZcBEhWp1hrdp24LYCMYSopSaIQG0ADAF1TZxKCKw0BodZAAPRACYArAGYmJjwBYANgB2AA4ggEZ-T1CPABoQLEQI0LcmAJNMiK8TYL8ATnyAXyKEmWwNMkpaBmZVDnoueV4+MGJiEiZ8DH0AMxIAWyZyuR5FGpU2BqaxrR09B3pLSydbe0N6J1cEDzcEpIRssKYvNwi3fI8IwPy3YPzgkrL0Cubx5WZiN9gAGSnIPgAZQAogAVAD6ADkAPKg4GAlZIEBrRZbRD+YKBJiBU73fyFQKBCLBNz+faIEmhJihQKhc4PQqhUImYqlEAjSrvWpML6zP7sSBMKCEQgQAAiKCwQIAqgAhcgASVBiJshDsqKR2wiKQi2P8XnyJlp+S8Xg8wS85MOJjcPkCZzcsSCXnxNqe7JeowU1Q+PO+-IgguFoolUpwAEE4eCAOLQ6FilXItXrRya9yGpiXLznYn+UJmh6BK3avKZkyRe6Gp0Rd0ct4+7m8zQBoMi8WSvgRqOy8MJ8yrZMa0DbQImKm5On+DwEjwmCLF7JY07ncL58LnLy1z2chvCJu8FsQJgAI3YoZl8qViZRGzRCHysSYbhM2YiuWihtOVtuaQxK9u+Q4jijxsnWYy7p8-r-Eep7tmGkbAjGcZ9lYSI3qmw6IKO45hFE06AbO86JMkKRYqk9KZC+4RElusg7kojZQQKMFnh2XaIT2KEDuqt5pgg9q6qa06ElOJL2nsxEIKE+T+NSDr3CEFxhIEtGvOBDF7kxgZHqgWCQoQpA4PoALsUh8bXoOvGYQgFwmJm3g5sEeYFpixZuGcTD+OW9rZh49pMqpXpVBpkF8tBwySvphnGRAnYIeCnEWTxGEuOmdlZo5znTq5klvhEHjpME2RnLcZpnJuoHbvWIVMLAACux4DPYBiNAIQjMDoUgRXR1UTMw9WNc1nDaPQ4gLBsyz9mhlkpdsJJWqO+TYjqQTuREhRToF9F9bVDVNaQLVQK07SdN0fSDN1anejVA37YdI1jfoE3mElKabHx-7YnOHg-fq5bBNOC1vuk1zmgDqR5OtJRsvQopwE4YHXX13FvXeAC0RaSfkupzoE5oGnmfm5BVzw9epO31Oo3wo0OqUINExbHFceMA54fnPoE-hbb1vr7qQvzQTTVl0zcVrMsEJwOnmRKzvibjc+TvNaa2IaSkLs3ov4snnLLXmpH4-jXAuOJyecmIBODmIK0jSthcxJ6sQcqrJe91m4U++KAdjo44uWYuFJ5RV3B44Rzn48uVWTNuMXb2kRXpBlGaQkDq67dMlsWlFMDmdzPrktpQ5HV3BTtt1DY0qd3tq1yeWcNIZIBFyhAtY6ZiaUTXFEOT2tbJe+m0HTEJXH36kthvj+Ez40mOC0GkwTnZi+5ZvmaKnQ0AA */
    tsTypes: {} as import("./daily-report-machine.typegen").Typegen0,
    predictableActionArguments: true,
    id: "dailyReportMachine",
    initial: "loadingReports",
    context: {
      rating: Rating.UNKNOWN as Rating,
      notes: null as null | string,
      reports: [] as DailyReport[],
      error: null as null | Error,
    },
    schema: {
      events: {} as
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
          },
      services: {} as {
        loadReports: {
          data: DailyReport[];
        };
        submit: {
          data: void;
        };
      },
    },
    states: {
      loadingReports: {
        invoke: {
          src: "loadReports",
          onDone: {
            target: "reportsLoaded",
            actions: assign({
              reports: (_, event) => event.data,
            }),
          },
          onError: {
            target: "error",
            actions: assign({
              error: (_, event) => event.data as Error,
            }),
          },
        },
      },
      reportsLoaded: {
        initial: "dayNotRated",
        on: {
          SET_NOTES: {
            actions: assign({
              notes: (_, event) => event.notes,
            }),
          },
        },
        states: {
          goodDay: {
            entry: assign({
              rating: () => Rating.GOOD,
            }),
            on: {
              SUBMIT: "#dailyReportMachine.submitting",
              RATE_GOOD: "dayNotRated",
              RATE_BAD: "badDay",
            },
          },

          badDay: {
            entry: assign({
              rating: () => Rating.BAD,
            }),
            on: {
              SUBMIT: "#dailyReportMachine.submitting",
              RATE_GOOD: "goodDay",
              RATE_BAD: "dayNotRated",
            },
          },

          dayNotRated: {
            entry: assign({
              rating: () => Rating.UNKNOWN,
            }),
            on: {
              RATE_GOOD: {
                target: "goodDay",
              },
              RATE_BAD: {
                target: "badDay",
              },
            },
          },
        },
      },
      submitting: {
        invoke: {
          src: "submit",
          onDone: "loadingReports",
          onError: {
            target: "error",
            actions: assign({
              error: (_, event) => event.data,
            }),
          },
        },
      },
      error: {},
    },
  },
  {
    services: {
      loadReports: viewTodaysReports,
    },
  }
);
