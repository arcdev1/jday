import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import db from "~/db";
import { makeSession } from "~/models/session";
import { getCurrentSession } from "~/server/session-utils";

const COOKIE_KEY = "session";

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as {
    email: string;
    password: string;
  };
  const user = await db?.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  console.log("user", user);

  if (!user) {
    return new NextResponse("No such user.", { status: 404 });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return new NextResponse("Unauthorized.", { status: 401 });
  }
  const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
  const serializedUser = JSON.stringify({
    ...user,
    expiry,
    password: undefined,
  });

  let response = new NextResponse(serializedUser, { status: 201 });
  response.cookies.set(COOKIE_KEY, serializedUser, {
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
