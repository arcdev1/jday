import { z } from "zod";

export const createdAtSchema = z
  .union([z.date(), z.string()])
  .transform((val) => (typeof val === "string" ? new Date(val) : val))
  .default(() => new Date());

export function makeCreatedAt(createdAt: unknown): Date {
  return createdAtSchema.parse(createdAt);
}
