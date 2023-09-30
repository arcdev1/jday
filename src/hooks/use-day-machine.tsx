import { useMachine } from "@xstate/react";
import dayMachine, {
  type DayMachineContext,
  DayMachineState,
  type DayMachineEvent,
  setBad,
  setGood,
  setNotes,
  submit,
} from "~/machines/day-machine";

export const useDayMachine = (initialContext?: DayMachineContext) => {
  const machineConfig = initialContext
    ? dayMachine.withContext({ ...dayMachine.context, ...initialContext })
    : dayMachine;

  const [state, send, service] = useMachine(machineConfig);
  return {
    state,
    send,
    service,
    setBad,
    setGood,
    setNotes,
    submit,
    DayMachineState,
  };
};

export type { DayMachineEvent, DayMachineContext };
