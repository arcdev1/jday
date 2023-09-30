// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "done.invoke.dailyReportMachine.submitting:invocation[0]": {
      type: "done.invoke.dailyReportMachine.submitting:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    loadReports: "done.invoke.dailyReportMachine.loadingReports:invocation[0]";
    submit: "done.invoke.dailyReportMachine.submitting:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: "submit";
  };
  eventsCausingActions: {};
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    loadReports:
      | "done.invoke.dailyReportMachine.submitting:invocation[0]"
      | "xstate.init";
    submit: "SUBMIT";
  };
  matchesStates:
    | "error"
    | "loadingReports"
    | "reportsLoaded"
    | "reportsLoaded.badDay"
    | "reportsLoaded.dayNotRated"
    | "reportsLoaded.goodDay"
    | "submitting"
    | { reportsLoaded?: "badDay" | "dayNotRated" | "goodDay" };
  tags: never;
}
