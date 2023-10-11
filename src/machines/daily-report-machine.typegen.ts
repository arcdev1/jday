// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.dailyReportMachine.submitting:invocation[0]": {
      type: "done.invoke.dailyReportMachine.submitting:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.dailyReportMachine.submitting:invocation[0]": {
      type: "error.platform.dailyReportMachine.submitting:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    submit: "done.invoke.dailyReportMachine.submitting:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    ensureSession: "xstate.init";
    resetContext: "RESET";
    setError: "error.platform.dailyReportMachine.submitting:invocation[0]";
    setNotes: "SET_NOTES";
    setQuestion: "xstate.init";
    setRatingBad:
      | "RATE_BAD"
      | "error.platform.dailyReportMachine.submitting:invocation[0]";
    setRatingGood:
      | "RATE_GOOD"
      | "error.platform.dailyReportMachine.submitting:invocation[0]";
    setRatingUnknown: "RATE_BAD" | "RATE_GOOD" | "RESET" | "xstate.init";
    setReports: "done.invoke.dailyReportMachine.submitting:invocation[0]";
    setThanks: "done.invoke.dailyReportMachine.submitting:invocation[0]";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {
    canSubmitBadDay: "SUBMIT";
    canSubmitGoodDay: "SUBMIT";
    hasNotes: "SET_NOTES";
    isRatingBad: "error.platform.dailyReportMachine.submitting:invocation[0]";
    isRatingGood: "error.platform.dailyReportMachine.submitting:invocation[0]";
  };
  eventsCausingServices: {
    submit: "SUBMIT";
  };
  matchesStates:
    | "badDay"
    | "dayNotRated"
    | "goodDay"
    | "submitting"
    | "thankYou";
  tags: never;
}
