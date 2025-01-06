import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

const updateProfileBodySchema = z.object({
  bio: z.string(),
});

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { bio } = updateProfileBodySchema.parse(body);

    try {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          bio,
        },
      });

      return new NextResponse(null, { status: 204 });
    } catch (error) {
      console.error("Prisma error:", error);

      return NextResponse.json(
        { error: "Database operation failed", details: error },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid data", details: error },
      { status: 400 }
    );
  }
}
