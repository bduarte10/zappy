import type { Metadata } from "next";

import "./globals.css";
import { ThemeProvider } from "@/components/theme.provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
