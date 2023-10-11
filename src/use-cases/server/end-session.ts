import "server-only";

import { NextRequest } from "next/server";
import { SESSION_KEY } from "~/models/session";
import { cookies } from "next/headers";
export function endSession(req: NextRequest) {
  cookies().delete(SESSION_KEY);
}
