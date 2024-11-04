import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme.provider";
import { NextAuthProvider } from "./contexts/auth.provider";
import QueryProvider from "./contexts/query.provider";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Zappy",
  description: "Disparo de mensagens em massa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <QueryProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
            <Toaster richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
