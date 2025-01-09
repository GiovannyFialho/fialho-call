import { Metadata } from "next";

import { ContentTimeIntervals } from "@/app/register/components/ContentTimeIntervals";

export const metadata: Metadata = {
  title: "Fialho Call | Intervalos",
};

export default function TimeIntervals() {
  return <ContentTimeIntervals />;
}
