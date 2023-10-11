import { z } from "zod";
import { roleSchema } from "~/models/role"; // Replace with the actual path to your roleSchema
import { createdAtSchema } from "./created-at";
import { updatedAtSchema } from "./updated-at";

export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string(),
  password: z.string(),
  role: roleSchema, // Using the imported roleSchema
  createdAt: createdAtSchema,
  updatedAt: updatedAtSchema,
  version: z.number().default(1),
});

export type User = z.infer<typeof userSchema>;

export function makeUser(user: unknown): User {
  return userSchema.parse(user);
}
