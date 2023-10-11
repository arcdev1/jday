import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 255;

const credentialSchema = z.object({
  email: z.string().email(),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});

export type Credential = z.infer<typeof credentialSchema>;

export function makeCredential(credential: unknown): Credential {
  return credentialSchema.parse(credential);
}
