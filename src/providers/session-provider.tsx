"use client";
import React, { PropsWithChildren, createContext } from "react";
import { useInterpret } from "@xstate/react";
import { authMachine } from "../machines/auth-machine";
import { InterpreterFrom } from "xstate";

export const SessionContext = createContext(
  {} as { authService: InterpreterFrom<typeof authMachine> }
);

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const authService = useInterpret(authMachine);

  return (
    <SessionContext.Provider value={{ authService }}>
      {children}
    </SessionContext.Provider>
  );
};
