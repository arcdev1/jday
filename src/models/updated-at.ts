import { z } from "zod";

export const updatedAtSchema = z
  .union([z.date(), z.string()])
  .transform((val) => (typeof val === "string" ? new Date(val) : val));

export function makeUpdatedAt(updatedAt: unknown): Date {
  return updatedAtSchema.parse(updatedAt);
}
