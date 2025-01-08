"use client";

import { globalStyles } from "@/app/globals";
import { getCssText } from "@ignite-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { Roboto } from "next/font/google";

import "@/app/lib/dayjs";
import { queryClient } from "@/app/lib/react-query";

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
      </head>

      <body className="antialiased">
        <QueryClientProvider client={queryClient}>
          <SessionProvider>{children}</SessionProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
