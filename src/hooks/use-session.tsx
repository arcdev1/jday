import { useActor } from "@xstate/react";
import React, { useCallback } from "react";
import {
  AuthMachineState,
  loginAction,
  logoutAction,
} from "~/machines/auth-machine";
import { SessionContext } from "~/providers/session-provider";

export function useSession() {
  const context = React.useContext(SessionContext);

  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  const [state, send] = useActor(context.authService);

  const getSessionState = useCallback(
    function getSessionState() {
      switch (true) {
        case state.matches(AuthMachineState.LOGGED_IN):
          return AuthMachineState.LOGGED_IN;
        case state.matches(AuthMachineState.LOGGED_OUT):
          return AuthMachineState.LOGGED_OUT;
        case state.matches(AuthMachineState.UNKNOWN):
          return AuthMachineState.UNKNOWN;
        case state.matches(AuthMachineState.LOGGING_IN):
          return AuthMachineState.LOGGING_IN;
        case state.matches(AuthMachineState.LOGGING_OUT):
          return AuthMachineState.LOGGING_OUT;
        default:
          return AuthMachineState.UNKNOWN;
      }
    },
    [state]
  );

  const logIn = useCallback(
    function logIn(credentials: { email: string; password: string }) {
      send(loginAction(credentials));
    },
    [send]
  );

  const logOut = useCallback(
    function logOut() {
      send(logoutAction());
    },
    [send]
  );

  const isLoggedIn = useCallback(
    function isLoggedIn() {
      return getSessionState() === AuthMachineState.LOGGED_IN;
    },
    [getSessionState]
  );

  return {
    session: state.context.session,
    logInError: state.context.error,
    getSessionState,
    isLoggedIn,
    logIn,
    logOut,
  };
}
