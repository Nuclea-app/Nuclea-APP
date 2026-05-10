import { auth } from "@/auth";
import { getUserCapsule, createCapsule } from "@/lib/actions/capsule.actions";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { CapsuleType } from "@/lib/capsule-data";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  const capsule = await getUserCapsule(userId);

  if (!capsule) {
    const cookieStore = await cookies();
    const type = cookieStore.get("capsule_type")?.value as CapsuleType | undefined;

    if (type) {
      await createCapsule({
        type,
        name: `Mi Cápsula ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        userId: userId
      });
      redirect("/dashboard/perfil");
    }
    
    redirect("/capsulas");
  }

  // Redirect to the profile view by default as requested in Step 3
  redirect(`/dashboard/perfil`);
}
