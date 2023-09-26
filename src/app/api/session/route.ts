import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "~/db";
import { getCurrentSession } from "~/server/session-utils";
import { randomUUID } from "crypto";
import { SESSION_KEY, makeSession } from "~/models/session";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };
  const user = await db?.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    return new NextResponse("No such user.", { status: 404 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return new NextResponse("Unauthorized.", { status: 401 });
  }

  const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  const session = makeSession({
    ...user,
    id: randomUUID(),
    userId: user.id,
    expiry,
    password: undefined,
  });
  const serializedSession = JSON.stringify(session);

  let response = new NextResponse(serializedSession, { status: 201 });

  response.cookies.set(SESSION_KEY, serializedSession, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiry,
  });

  return response;
}

export async function GET(req: NextRequest) {
  try {
    const session = getCurrentSession(req, true);
    if (session == null) {
      return new NextResponse("Not found.", { status: 404 });
    }
    return new NextResponse(JSON.stringify(session), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Unauthorized.", { status: 401 });
  }
}
