import { type NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma";

export async function GET(request: NextRequest) {
  const username = request.nextUrl.pathname.split("/").at(-2);
  const year = request.nextUrl.searchParams.get("year");
  const month = request.nextUrl.searchParams.get("month");

  if (!year || !month) {
    return NextResponse.json(
      { message: "Year or month not specified." },
      { status: 400 }
    );
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

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  });

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekday) => {
    return !availableWeekDays.some(
      (availableWeekDay) => availableWeekDay.week_day === weekday
    );
  });

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
    SELECT
      EXTRACT(DAY FROM S.DATE) AS date,
      COUNT(S.date),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    FROM schedulings S

    LEFT JOIN user_time_intervals UTI
      ON UTI.week_day = EXTRACT(DOW FROM S.date + INTERVAL '1 day')

    WHERE S.user_id = ${user.id}
      AND EXTRACT(YEAR FROM S.date) = ${year}::int
      AND EXTRACT(MONTH FROM S.date) = ${month}::int

    GROUP BY EXTRACT(DAY FROM S.DATE),
      ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

    HAVING
      COUNT(S.date) >= ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60);
  `;

  const blockedDates = blockedDatesRaw.map((item) => item.date);

  return NextResponse.json({ blockedWeekDays, blockedDates }, { status: 200 });
}
