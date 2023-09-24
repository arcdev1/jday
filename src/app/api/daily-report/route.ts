import { NextRequest, NextResponse } from "next/server";
import db from "~/db";

export async function POST(req: NextRequest) {
  return new NextResponse("Not implemented.", { status: 501 });
}
