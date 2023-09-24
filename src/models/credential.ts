import { z } from "zod";

const credentialSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(255),
});

export type Credential = z.infer<typeof credentialSchema>;

export function makeCredential(credential: unknown): Credential {
  return credentialSchema.parse(credential);
}
