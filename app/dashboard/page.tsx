import { auth } from "@/auth";
import { getUserCapsules } from "@/lib/actions/capsule.actions";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/nuclea/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const capsules = await getUserCapsules(session.user.id);

  // Usuario sin cápsulas → siempre a la pantalla de elegir cápsula.
  if (capsules.length === 0) {
    redirect("/capsulas");
  }

  return (
    <DashboardClient
      capsules={capsules}
      userName={session.user.name ?? ""}
    />
  );
}
