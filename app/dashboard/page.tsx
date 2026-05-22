import { auth } from "@/auth";
import { getUserCapsules, getReceivedCapsules } from "@/lib/actions/capsule.actions";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/nuclea/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [capsules, receivedCapsules] = await Promise.all([
    getUserCapsules(session.user.id),
    getReceivedCapsules(session.user.id),
  ]);

  // Usuario sin cápsulas propias ni recibidas → pantalla de elegir cápsula.
  if (capsules.length === 0 && receivedCapsules.length === 0) {
    redirect("/capsulas");
  }

  return (
    <DashboardClient
      capsules={capsules}
      receivedCapsules={receivedCapsules}
      userName={session.user.name ?? ""}
    />
  );
}
