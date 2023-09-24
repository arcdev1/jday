import React, { createContext, useContext, useEffect, useState } from "react";
import { useMachine } from "@xstate/react";
import dayMachine, {
  DayMachineContext as DayMachineContextType,
  DayMachineEvent,
} from "~/machines/day-machine";

export interface DayMachineProviderProps {
  children: React.ReactNode;
  initialContext?: Partial<DayMachineContextType>;
}

export interface DayMachineContextValue {
  send: (event: DayMachineEvent) => void;
  state: typeof dayMachine.initialState;
}

export const DayMachineContext = createContext<DayMachineContextValue | null>(
  null
);

export const DayMachineProvider: React.FC<DayMachineProviderProps> = ({
  children,
  initialContext,
}) => {
  const machineConfig = initialContext
    ? dayMachine.withContext({ ...dayMachine.context, ...initialContext })
    : dayMachine;

  const [state, send] = useMachine(machineConfig);

  return (
    <DayMachineContext.Provider value={{ state, send }}>
      {children}
    </DayMachineContext.Provider>
  );
};
