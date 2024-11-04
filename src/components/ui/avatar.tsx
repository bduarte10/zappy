"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function UserAvatar() {
  const session = useSession();

  return (
    <div className="w-9 h-9 rounded-full overflow-hidden mr-2">
      {session?.data?.user?.image && (
        <Image
          src={session?.data?.user?.image}
          alt="Avatar do usuário"
          width={36}
          height={36}
          layout="responsive"
          className="rounded-full"
        />
      )}
    </div>
  );
}
