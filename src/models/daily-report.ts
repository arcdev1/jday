import { z } from "zod";
import { ratingSchema } from "./rating";

const dailyReportSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  createdAt: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val))
    .default(() => new Date()),
  updatedAt: z
    .union([z.date(), z.string()])
    .transform((val) => (typeof val === "string" ? new Date(val) : val)),
  notes: z.string().default(""),
  rating: ratingSchema,
});

export type DailyReport = z.infer<typeof dailyReportSchema>;

export function makeDailyReport(dailyReport: unknown): DailyReport {
  return dailyReportSchema.parse(dailyReport);
}
