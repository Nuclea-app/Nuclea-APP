import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserCapsule } from "@/lib/actions/capsule.actions";
import { getFutureMessages } from "@/lib/actions/futureMessage.actions";
import { isFutureMessageUnlocked } from "@/lib/futureMessages";
import {
  FutureMessagesClient,
  FutureMessageItem,
} from "@/components/capsule/FutureMessagesClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MensajesFuturosPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id: capsuleId } = await params;
  const capsule = await getUserCapsule(session.user.id, capsuleId);
  if (!capsule) redirect("/capsulas");

  const messages = await getFutureMessages(capsule.id);

  const items: FutureMessageItem[] = messages.map((m) => ({
    id: m.id,
    type: m.type,
    unlocksAt: m.unlocksAt.toISOString(),
    unlocked: isFutureMessageUnlocked(m.unlocksAt),
  }));

  return (
    <FutureMessagesClient
      messages={items}
      capsuleName={capsule.name}
      capsuleId={capsule.id}
    />
  );
}
