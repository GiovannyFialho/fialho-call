"use client";

import { Heading, Text } from "@ignite-ui/react";
import Image from "next/image";

import previewImage from "@/app/assets/app-preview.png";

import { ClaimUsernameForm } from "@/app/home/components/ClaimUsernameForm";
import { Container, Hero, Preview } from "@/app/home/styles";

export function ContentHome() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          Agendamento descomplicado
        </Heading>

        <Text size="xl">
          Conecte seu calendário e permita que as pessoas marquem agendamentos
          no seu tempo livre.
        </Text>

        <ClaimUsernameForm />
      </Hero>

      <Preview>
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt="Calendário simbolizando aplicação em funcionamento"
        />
      </Preview>
    </Container>
  );
}
