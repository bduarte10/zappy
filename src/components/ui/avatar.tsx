/* eslint-disable @next/next/no-img-element */
import { auth } from "@/auth";

export default async function UserAvatar() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <div className="w-9 h-9 rounded-full overflow-hidden mr-2">
      <img src={session?.user?.image || ""} alt="User Avatar" />
    </div>
  );
}
