import { Metadata } from "next";

import { ContentHome } from "@/app/home/components/ContentHome";

export const metadata: Metadata = {
  title: "Fialho Call",
};

export default function Home() {
  return <ContentHome />;
}
