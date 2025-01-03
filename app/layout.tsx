"use client";

import { globalStyles } from "@/app/globals";
import { getCssText } from "@ignite-ui/react";
import { SessionProvider } from "next-auth/react";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

globalStyles();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={roboto.className}>
      <head>
        <style
          id="stitches"
          dangerouslySetInnerHTML={{
            __html: getCssText(),
          }}
          suppressHydrationWarning
        />
        <meta name="description" content="Project Fialho Call" />
        <title>Fialho Call</title>
      </head>

      <body className="antialiased">
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
