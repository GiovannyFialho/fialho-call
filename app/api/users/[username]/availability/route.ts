import dayjs from "dayjs";
import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.pathname.split("/").at(-2);
  const date = request.nextUrl.searchParams.get("date");

  if (!date) {
    return NextResponse.json({ message: "Date not provided" }, { status: 400 });
  }

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

  const referenceDate = dayjs(String(date));
  const isPastDate = referenceDate.endOf("day").isBefore(new Date());

  // Se a data `referenceDate` for antes do dia atual - não deve retornada nada
  if (isPastDate) {
    return NextResponse.json(
      { possibleTimes: [], availableTimes: [] },
      { status: 200 }
    );
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get("day"),
    },
  });

  if (!userAvailability) {
    return NextResponse.json(
      { possibleTimes: [], availableTimes: [] },
      { status: 200 }
    );
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability;

  const startHour = time_start_in_minutes / 60;
  const endHour = time_end_in_minutes / 60;

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, index) => {
      return startHour + index;
    }
  );

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set("hour", startHour).toDate(),
        lte: referenceDate.set("hour", endHour).toDate(),
      },
    },
  });

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() === time
    );

    const isTimeInPast = referenceDate.set("hour", time).isBefore(new Date());

    return !isTimeBlocked && isTimeInPast;
  });

  return NextResponse.json({ possibleTimes, availableTimes }, { status: 200 });
}
