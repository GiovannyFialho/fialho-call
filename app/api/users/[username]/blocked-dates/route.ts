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

  return NextResponse.json({ blockedWeekDays }, { status: 200 });
}
