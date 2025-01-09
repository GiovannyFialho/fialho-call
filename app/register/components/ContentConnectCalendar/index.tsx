"use client";

import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check } from "phosphor-react";

import { Container, Header } from "@/app/register/styles";

import {
  AuthError,
  ConnectBox,
  ConnectItem,
} from "@/app/register/connect-calendar/styles";

export function ContentConnectCalendar() {
  const session = useSession();
  const searchParams = useSearchParams();
  const { push } = useRouter();

  const hasAuthError = !!searchParams.get("error");
  const isSignedId = session.status === "authenticated";

  async function handleConnectCalendar() {
    await signIn("google");
  }

  function handleNavigateToNextStep() {
    push("/register/time-intervals");
  }

  return (
    <Container>
      <Header>
        <Heading as="strong">Conecte sua agenda!</Heading>

        <Text>
          Conecte o seu calendário para verificar automaticamente as horas
          ocupadas e os novos eventos à medida em que são agendados.
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>

      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>

          {isSignedId ? (
            <Button size="sm" disabled>
              Conectado
              <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectCalendar}
            >
              Conectar
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            Falha ao se conectar ao Google, verifique se você habilitou as
            permissões de acesso ao Google Calendar
          </AuthError>
        )}

        <Button
          type="button"
          onClick={handleNavigateToNextStep}
          disabled={!isSignedId}
        >
          Próximo passo
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}