import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  return NextResponse.json({ session, body });
}

export function OPTIONS() {
  return NextResponse.json(null, { status: 204 });
}
