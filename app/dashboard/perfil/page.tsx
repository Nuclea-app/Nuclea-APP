import { auth } from "@/auth";
import { getUserCapsule } from "@/lib/actions/capsule.actions";
import { CapsuleProfile } from "@/components/capsule/CapsuleProfile";
import { redirect } from "next/navigation";

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const capsule = await getUserCapsule(session.user.id);

  if (!capsule) {
    redirect("/capsulas");
  }

  const capsuleData = {
    ...capsule,
    type: capsule.type.toLowerCase(),
  };

  return <CapsuleProfile capsule={capsuleData} />;
}
