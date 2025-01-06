import { getServerSession } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/lib/prisma";

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    })
  ),
});

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { intervals } = timeIntervalsBodySchema.parse(body);

    try {
      await Promise.all(
        intervals.map((interval) => {
          return prisma.userTimeInterval.create({
            data: {
              week_day: interval.weekDay,
              time_start_in_minutes: interval.startTimeInMinutes,
              time_end_in_minutes: interval.endTimeInMinutes,
              user_id: session.user.id,
            },
          });
        })
      );

      return NextResponse.json({ status: 201 });
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

export function OPTIONS() {
  return NextResponse.json(null, { status: 204 });
}
