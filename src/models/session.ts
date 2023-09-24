import { z } from "zod";
import { Role } from "./role";
const sessionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty().min(2).max(255),
  email: z.string().email(),
  role: z.enum([Role.DAY_REPORTER, Role.MORNING_REPORTER]),
  expiry: z.union([z.date(), z.string()]).transform((val) => {
    if (typeof val === "string") {
      return new Date(val);
    }
    return val;
  }),
});

export type Session = z.infer<typeof sessionSchema>;

export function makeSession(session: unknown): Session {
  return sessionSchema.parse(session);
}

export const SESSION_KEY = "session";
