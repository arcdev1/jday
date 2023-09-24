import { useContext } from "react";
import {
  DayMachineState,
  enterMorning,
  enterSchoolDay,
  setBad,
  setGood,
  setNotes,
  submit,
} from "~/machines/day-machine";
import {
  DayMachineContextValue,
  DayMachineContext,
} from "~/providers/day-machine-provider";

export const useDayMachine = (): DayMachineContextValue => {
  const context = useContext(DayMachineContext);
  if (!context) {
    throw new Error("useDayMachine must be used within a DayMachineProvider");
  }
  return context;
};

export {
  DayMachineState,
  enterMorning,
  enterSchoolDay,
  setBad,
  setGood,
  setNotes,
  submit,
};
