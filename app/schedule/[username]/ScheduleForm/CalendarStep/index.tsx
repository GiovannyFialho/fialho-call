import { Calendar } from "@/app/components/Calendar";

import { Container } from "@/app/schedule/[username]/ScheduleForm/CalendarStep/styles";

export function CalendarStep() {
  return (
    <Container>
      <Calendar />
    </Container>
  );
}
