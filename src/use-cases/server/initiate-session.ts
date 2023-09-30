import { Credential } from "~/models/credential";
import db from "~/db";
import { randomUUID } from "crypto";
import { makeSession } from "~/models/session";
import bcrypt from "bcryptjs";

export async function initiateSession(credential: Credential) {
  const { email, password } = credential;
  const user = await db?.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new NoSuchUserError("No such user.");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new NotAuthorizedError("Unauthorized.");
  }

  const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  return makeSession({
    ...user,
    id: randomUUID(),
    userId: user.id,
    expiry,
    password: undefined,
  });
}

class NotAuthorizedError extends Error {}
class NoSuchUserError extends Error {}
