import { Metadata } from "next";

import { prisma } from "@/app/lib/prisma";
import { ContentPage } from "@/app/schedule/components/content-page";

interface SchedulePageProps {
  params: {
    username: string;
  };
}

async function getUser({ params }: SchedulePageProps) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    return null;
  }

  return user;
}

export async function generateMetadata({
  params,
}: SchedulePageProps): Promise<Metadata> {
  const user = await getUser({ params });

  if (!user) {
    return {
      title: "User not found",
      description: "The requested user could not be found.",
    };
  }

  return {
    title: `${user.name}'s Schedule`,
    description: user.bio || "User schedule page",
    openGraph: {
      title: `${user.name}'s Schedule`,
      description: user.bio ?? "",
      images: user.avatar_url
        ? [
            {
              url: user.avatar_url,
              alt: `${user.name}'s avatar`,
            },
          ]
        : undefined,
    },
  };
}

export default async function Schedule({ params }: SchedulePageProps) {
  const user = await getUser({ params });

  if (!user) {
    return <h1>User not found</h1>;
  }

  return <ContentPage user={user} />;
}
