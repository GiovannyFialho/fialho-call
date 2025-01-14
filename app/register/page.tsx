import { Metadata } from "next";

import { ContentRegister } from "@/app/register/components/ContentRegister";

export const metadata: Metadata = {
  title: "Fialho Call | Cadastro",
};

export default function Register() {
  return <ContentRegister />;
}
