import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  const { name, username } = await request.json();

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  });

  return NextResponse.json({ data: user }, { status: 201 });
}
