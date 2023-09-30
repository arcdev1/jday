// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    submit: "done.invoke.dayMachine.submitting:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    setBadRating: "SET_BAD";
    setGoodRating: "SET_GOOD";
    setNotes: "SET_NOTES";
    setUnknownRating: "SET_BAD" | "SET_GOOD";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {
    submit: "SUBMIT";
  };
  matchesStates:
    | "bad"
    | "failed"
    | "good"
    | "submitted"
    | "submitting"
    | "unknown";
  tags: never;
}
