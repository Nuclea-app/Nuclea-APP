import { auth } from "@/auth";
import { getUserCapsule } from "@/lib/actions/capsule.actions";
import { CapsuleProfile } from "@/components/capsule/CapsuleProfile";
import { redirect } from "next/navigation";

interface PerfilPageProps {
  searchParams: Promise<{ capsule?: string }>;
}

export default async function PerfilPage({ searchParams }: PerfilPageProps) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const { capsule: capsuleId } = await searchParams;
  const capsule = await getUserCapsule(session.user.id, capsuleId);

  if (!capsule) {
    redirect("/capsulas");
  }

  const capsuleData = {
    ...capsule,
    type: capsule.type.toLowerCase(),
  };

  return <CapsuleProfile capsule={capsuleData} />;
}
