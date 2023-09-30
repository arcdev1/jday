import { NextRequest } from "next/server";
import { SESSION_KEY } from "~/models/session";

export function endSession(req: NextRequest) {
  req.cookies.set(SESSION_KEY, "");
}
