import { auth } from "@/auth";
import { getUserCapsules, createCapsule } from "@/lib/actions/capsule.actions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CapsuleType } from "@/lib/capsule-data";
import { DashboardClient } from "@/components/nuclea/DashboardClient";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const capsules = await getUserCapsules(userId);

  if (capsules.length === 0) {
    const cookieStore = await cookies();
    const type = cookieStore.get("capsule_type")?.value as CapsuleType | undefined;

    if (type) {
      await createCapsule({
        type,
        name: `Mi Cápsula ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        userId: userId,
      });
      redirect("/dashboard/perfil");
    }

    redirect("/capsulas");
  }

  return (
    <DashboardClient
      capsules={capsules}
      userName={session.user.name ?? ""}
    />
  );
}
