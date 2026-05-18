import { auth } from "@/auth";
import { getUserCapsule } from "@/lib/actions/capsule.actions";
import { getFutureMessages } from "@/lib/actions/futureMessage.actions";
import { CapsuleProfile } from "@/components/capsule/CapsuleProfile";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CapsulaPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id: capsuleId } = await params;
  const capsule = await getUserCapsule(session.user.id, capsuleId);
  if (!capsule) redirect("/capsulas");

  const futureMessages = await getFutureMessages(capsule.id);

  const capsuleData = {
    ...capsule,
    type: capsule.type.toLowerCase(),
    futureMessages: futureMessages.map((fm) => ({
      id: fm.id,
      unlocksAt: fm.unlocksAt.toISOString(),
    })),
  };

  return <CapsuleProfile capsule={capsuleData} />;
}
