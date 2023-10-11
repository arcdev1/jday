import { z } from "zod";
import { ratingSchema } from "./rating";
import { userSchema } from "./user";
import { createdAtSchema } from "./created-at";
import { updatedAtSchema } from "./updated-at";

const dailyReportSchema = z.object({
  id: z.string().uuid(),
  reportedById: z.string().uuid(),
  reportedBy: userSchema.pick({ name: true, email: true }).optional(),
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  notes: z.string().default(""),
  rating: ratingSchema,
});

const dailyReportSubmissionSchema = z.object({
  rating: dailyReportSchema.shape.rating,
  notes: dailyReportSchema.shape.notes.optional(),
});

export type DailyReport = z.infer<typeof dailyReportSchema>;
export type DailyReportSubmission = z.infer<typeof dailyReportSubmissionSchema>;

export function makeDailyReport(dailyReport: unknown): DailyReport {
  return dailyReportSchema.parse(dailyReport);
}

export function makeDailyReportSubmission(
  dailyReportSubmission: unknown
): DailyReportSubmission {
  return dailyReportSubmissionSchema.parse(dailyReportSubmission);
}
