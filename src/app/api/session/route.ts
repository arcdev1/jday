import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "~/use-cases/server/get-current-session";
import { SESSION_KEY } from "~/models/session";
import { initiateSession } from "~/use-cases/server/initiate-session";
import { makeCredential } from "~/models/credential";
import { endSession } from "~/use-cases/server/end-session";

export async function POST(req: NextRequest) {
  let credential;

  try {
    credential = makeCredential(await req.json());
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: (error as Error).message,
        error,
      }),
      { status: 400 }
    );
  }

  try {
    const session = await initiateSession(credential);

    const serializedSession = JSON.stringify(session);
    let response = new NextResponse(serializedSession, { status: 201 });

    response.cookies.set(SESSION_KEY, serializedSession, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      expires: session.expiry,
    });

    return response;
  } catch (error) {
    console.error(error);
    return new NextResponse("Unauthorized.", { status: 401 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = getCurrentSession(true);
    if (session == null) {
      return new NextResponse("Not found.", { status: 404 });
    }
    return new NextResponse(JSON.stringify(session), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse("Unauthorized.", { status: 401 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    endSession(req);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        message: (error as Error).message,
        error,
      }),
      { status: 400 }
    );
  }
}
