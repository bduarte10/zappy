import { redirect } from "next/navigation";

export default async function DashboardLayout() {
  return redirect("/dashboard/disparo-em-massa");
}
