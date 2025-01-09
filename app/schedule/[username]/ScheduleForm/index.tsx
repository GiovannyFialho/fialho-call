import { useState } from "react";

import { CalendarStep } from "@/app/schedule/[username]/ScheduleForm/CalendarStep";
import { ConfirmStep } from "@/app/schedule/[username]/ScheduleForm/ConfirmStep";

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

  function handleClearSelectedDateTime() {
    setSelectedDateTime(null);
  }

  if (selectedDateTime) {
    return (
      <ConfirmStep
        schedulingDate={selectedDateTime}
        onCancelConfirmation={handleClearSelectedDateTime}
      />
    );
  }

  return <CalendarStep onSelectedDateTime={setSelectedDateTime} />;
}
