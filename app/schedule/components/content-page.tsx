"use client";

import { Avatar, Heading, Text } from "@ignite-ui/react";

import { ScheduleForm } from "@/app/schedule/[username]/ScheduleForm";
import { Container, UserHeader } from "@/app/schedule/[username]/styles";

interface ContentPageProps {
  user: {
    name: string;
    bio: string | null;
    avatar_url: string | null;
  };
}

export function ContentPage({ user }: ContentPageProps) {
  return (
    <Container>
      <UserHeader>
        <Avatar src={user.avatar_url} />
        <Heading>{user.name}</Heading>
        <Text>{user.bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  );
}
