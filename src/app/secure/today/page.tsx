"use client";
import React from "react";
import { DayMachineProvider } from "~/providers/day-machine-provider";
import TodayPage from "~/components/today-page";

export default function Home() {
  return (
    <DayMachineProvider>
      <TodayPage />
    </DayMachineProvider>
  );
}
