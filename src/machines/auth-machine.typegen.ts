
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "done.invoke.authMachine.loggingIn:invocation[0]": { type: "done.invoke.authMachine.loggingIn:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.authMachine.loggingOut:invocation[0]": { type: "done.invoke.authMachine.loggingOut:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"done.invoke.authMachine.unknown:invocation[0]": { type: "done.invoke.authMachine.unknown:invocation[0]"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.authMachine.loggingIn:invocation[0]": { type: "error.platform.authMachine.loggingIn:invocation[0]"; data: unknown };
"error.platform.authMachine.loggingOut:invocation[0]": { type: "error.platform.authMachine.loggingOut:invocation[0]"; data: unknown };
"error.platform.authMachine.unknown:invocation[0]": { type: "error.platform.authMachine.unknown:invocation[0]"; data: unknown };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "getSession": "done.invoke.authMachine.unknown:invocation[0]";
"login": "done.invoke.authMachine.loggingIn:invocation[0]";
"logout": "done.invoke.authMachine.loggingOut:invocation[0]";
        };
        missingImplementations: {
          actions: never;
          delays: never;
          guards: never;
          services: never;
        };
        eventsCausingActions: {
          "clearError": "LOGIN" | "done.invoke.authMachine.loggingIn:invocation[0]" | "done.invoke.authMachine.loggingOut:invocation[0]" | "done.invoke.authMachine.unknown:invocation[0]";
"clearSession": "done.invoke.authMachine.loggingIn:invocation[0]" | "done.invoke.authMachine.loggingOut:invocation[0]" | "done.invoke.authMachine.unknown:invocation[0]" | "error.platform.authMachine.loggingIn:invocation[0]" | "error.platform.authMachine.unknown:invocation[0]";
"setError": "done.invoke.authMachine.loggingIn:invocation[0]" | "done.invoke.authMachine.unknown:invocation[0]" | "error.platform.authMachine.loggingIn:invocation[0]" | "error.platform.authMachine.loggingOut:invocation[0]" | "error.platform.authMachine.unknown:invocation[0]";
"setSession": "done.invoke.authMachine.loggingIn:invocation[0]" | "done.invoke.authMachine.unknown:invocation[0]";
        };
        eventsCausingDelays: {
          
        };
        eventsCausingGuards: {
          "isValidSession": "done.invoke.authMachine.loggingIn:invocation[0]" | "done.invoke.authMachine.unknown:invocation[0]";
        };
        eventsCausingServices: {
          "getSession": "xstate.init";
"login": "LOGIN";
"logout": "LOGOUT";
        };
        matchesStates: "loggedIn" | "loggedOut" | "loggingIn" | "loggingOut" | "unknown";
        tags: never;
      }
  