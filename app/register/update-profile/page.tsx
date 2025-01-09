import { Metadata } from "next";

import { ContentUpdateProfile } from "@/app/register/components/ContentUpdateProfile";

export const metadata: Metadata = {
  title: "Fialho Call | Atualização de perfil",
};

export default function UpdateProfile() {
  return <ContentUpdateProfile />;
}
