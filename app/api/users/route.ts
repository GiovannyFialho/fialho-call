import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  const { name, username } = await request.json();

  const userExists = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (userExists) {
    return NextResponse.json(
      { message: "Username already taken" },
      { status: 400 }
    );
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  const response = NextResponse.json({ data: user }, { status: 201 });

  response.cookies.set("@fialho-call:userId", user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });

  return response;
}
