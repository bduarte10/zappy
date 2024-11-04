"use client";
import { AppSidebar } from "@/components/app-sidebar";
import UserAvatar from "@/components/ui/avatar";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SignOutButton } from "@/components/ui/sign-out-button";
import { ThemeToggle } from "@/components/ui/toggle-theme";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: session } = useSession();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <p className="text-lg">
            Bem vindo,{" "}
            <span className="">{session?.user?.name?.split(" ")[0]}</span>
          </p>
          <div className="flex items-center ">
            <ThemeToggle />
            <Separator orientation="vertical" className="mx-2 h-4" />
            {session?.user?.image && <UserAvatar />}
            <SignOutButton />
          </div>
        </header>
        <main className="h-full w-full p-4 flex flex-row items-center justify-center">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
