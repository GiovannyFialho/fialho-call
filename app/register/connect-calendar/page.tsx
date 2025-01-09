import { Metadata } from "next";

import { ContentConnectCalendar } from "@/app/register/components/ContentConnectCalendar";

export const metadata: Metadata = {
  title: "Fialho Call | Conectar conta",
};

export default function ConnectCalendar() {
  return <ContentConnectCalendar />;
}
