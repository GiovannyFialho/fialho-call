import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/app/lib/prisma";

export async function POST(request: NextRequest) {
  const username = request.nextUrl.pathname.split("/").at(-2);

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  });

  if (!user) {
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 400 }
    );
  }

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string(),
    date: z.string().datetime(),
  });

  try {
    const body = await request.json();
    const { name, email, observations, date } =
      createSchedulingBody.parse(body);

    const schedulingDate = dayjs(date).startOf("hour");

    if (schedulingDate.isBefore(new Date())) {
      return NextResponse.json(
        { message: "Date is in the past" },
        { status: 400 }
      );
    }

    const conflictingScheduling = await prisma.scheduling.findFirst({
      where: {
        user_id: user.id,
        date: schedulingDate.toDate(),
      },
    });

    if (conflictingScheduling) {
      return NextResponse.json(
        { message: "There is another scheduling at the same time" },
        { status: 400 }
      );
    }

    try {
      await prisma.scheduling.create({
        data: {
          user_id: user.id,
          name,
          email,
          observations,
          date: schedulingDate.toDate(),
        },
      });

      return new NextResponse(null, { status: 201 });
    } catch (error) {
      return NextResponse.json(
        {
          message: "It was not possible to create a scheduling",
          details: error,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid data", details: error },
      { status: 400 }
    );
  }
}
