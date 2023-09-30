import { createMachine, assign } from "xstate";
import { type Session } from "~/models/session";
import { type Credential } from "~/models/credential";
import { getCurrentSession } from "~/use-cases/client/get-current-session";
import { login } from "~/use-cases/client/login";
import { logout } from "~/use-cases/client/logout";

export type AuthMachineEvent =
  | {
      type: "LOGIN";
      credential: Credential;
    }
  | {
      type: "LOGOUT";
    };

export enum AuthMachineState {
  UNKNOWN = "unknown",
  LOGGED_IN = "loggedIn",
  LOGGED_OUT = "loggedOut",
  LOGGING_IN = "loggingIn",
  LOGGING_OUT = "loggingOut",
}

export function loginAction(credential: Credential) {
  return {
    type: "LOGIN",
    credential,
  } as const;
}

export function logoutAction() {
  return {
    type: "LOGOUT",
  } as const;
}

export const authMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QEMCuAXAFgWWQY0wEsA7MAOlWIGtiB7Ad2IGIJbSySA3Wq8tLXARLlKNBsQRdaeZOkJsA2gAYAuspWJQAB1qxCctppAAPRACYArAEYyAdlsBmACxOAbA4tKAHA7MBOVwAaEABPRFcLVzI-Mys-KzMnWL97LwBfNOD+HHwidlE6RhY2cileMmzBPJFqQokpGQNidQUrDSQQHT0mo1MESxt7ZzcPb18A4LCEJysoqyU-By8zRNiIswysjByhfNrxJjAAJyPaI7ItABtZADMzgFsK7arhCn3GSWJuRvlm1XUjF19L9euZrHZHC53J4fP4gqFEBYHFFrJEHAsFlZZn5NiBKrlXtkwMQ5I1IEwADIAeQA4lSAKoAFQBHSBPQ6fXmXgsZBmTgWZiWZiUtgmCIQXhsniUMtc81cEVcTgcuPxuxqRJJhDJEEptIAkgA5FnaXTAwwcxC2SJkCy2ZZKBxWHxiqbKmySmK2JTWKypFWZPHPAnsTWk2QkKDFdhlPjB9VPLDE8NyYhQT7fCOKf6qQFm9mgTlKVx+aIxMySpSrCx+CyTRD82y8syuH1eVyWEWWVXx6qJzDJ7URtOHE5nC7XdB3I6PNV9sND1PphpZv5qXOs-Mgy0Ia0o+3Cp0u+FTJ0OXlWdECiIJZw9gQhjXbQc-EesGNfHhxh8JygL1-Lp+PzZuu7Smt026FmCgyQiMMLjCe5i1nYjqXh41qxMi947H2f7PlqAGjqc5xXLcDz9i8ez-sOgGZk0LQbuB5rEKC-TgkMUKjLCrrmFWZCdjKnrxLYfquBkgZ0BAcBGHOwh5hBFpQQgAC0iEqVEMqaVpWmxNhlE1GIjDycxrFJPWCBKk20pVpexZeE4op6Y+-YvrIkDGQWJiIAkWLREiVhOMsyoWPZ5kuE4ZAOKKfoiuMAZbD+uHENR6DuZuCksTudpNq2sxLEkToJHW4ouE2sSdvySodi2TkJilkYeZBXkIH43hkF4rW2LEnjCj4akzF4kXRd6jj2hYKy1Ul9Vpo1inNSFZAdk4fjxJYfjcu4akVjyqGWA59j+Ck4lpEAA */
    tsTypes: {} as import("./auth-machine.typegen").Typegen0,
    id: "authMachine",
    predictableActionArguments: true,
    initial: AuthMachineState.UNKNOWN,
    schema: {
      events: {} as AuthMachineEvent,
      services: {} as {
        getSession: {
          data: Session | null;
        };
        login: {
          data: Session | null;
        };
        logout: {
          data: void;
        };
      },
    },
    context: {
      session: null as Session | null,
      error: null as Error | null,
    },
    states: {
      unknown: {
        invoke: {
          src: "getSession",
          onDone: [
            {
              id: "hasSession",
              cond: "isValidSession",
              target: AuthMachineState.LOGGED_IN,
              actions: ["clearError", "setSession"],
            },
            {
              id: "noSession",
              target: AuthMachineState.LOGGED_OUT,
              actions: ["clearSession", "setError"],
            },
          ],
          onError: {
            id: "sessionRetrievalError",
            target: AuthMachineState.LOGGED_OUT,
            actions: ["clearSession", "setError"],
          },
        },
      },
      loggedIn: {
        on: {
          LOGOUT: {
            target: AuthMachineState.LOGGING_OUT,
          },
        },
      },
      loggedOut: {
        on: {
          LOGIN: {
            target: AuthMachineState.LOGGING_IN,
            actions: "clearError",
          },
        },
      },
      loggingIn: {
        invoke: {
          src: "login",
          onDone: [
            {
              cond: "isValidSession",
              target: AuthMachineState.LOGGED_IN,
              actions: ["clearError", "setSession"],
            },
            {
              target: AuthMachineState.LOGGED_OUT,
              actions: ["clearSession", "setError"],
            },
          ],
          onError: {
            target: AuthMachineState.LOGGED_OUT,
            actions: ["clearSession", "setError"],
          },
        },
      },
      loggingOut: {
        invoke: {
          src: "logout",
          onDone: {
            target: AuthMachineState.LOGGED_OUT,
            actions: ["clearSession", "clearError"],
          },
          onError: {
            target: AuthMachineState.LOGGED_OUT,
            actions: "setError",
          },
        },
      },
    },
  },
  {
    services: {
      getSession: async () => getCurrentSession(),
      login: async (_, event) => login(event.credential),
      logout: async () => logout(),
    },
    actions: {
      setSession: assign({
        session: (_context, event) => event.data,
      }),
      setError: assign({
        error: (_, event) => event.data as Error,
      }),
      clearError: assign({
        error: null,
      }),
      clearSession: assign({
        session: null,
      }),
    },
    guards: {
      isValidSession: (_, event) => event.data != null,
    },
  }
);

export default authMachine;
