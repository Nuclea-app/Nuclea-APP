import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserCapsule } from "@/lib/actions/capsule.actions";
import { getFutureMessages } from "@/lib/actions/futureMessage.actions";
import {
  FutureMessagesClient,
  FutureMessageItem,
} from "@/components/capsule/FutureMessagesClient";

interface PageProps {
  searchParams: Promise<{ capsule?: string }>;
}

export default async function MensajesFuturosPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { capsule: capsuleId } = await searchParams;
  const capsule = await getUserCapsule(session.user.id, capsuleId);
  if (!capsule) redirect("/capsulas");

  const messages = await getFutureMessages(capsule.id);
  const now = Date.now();

  const items: FutureMessageItem[] = messages.map((m) => ({
    id: m.id,
    type: m.type,
    unlocksAt: m.unlocksAt.toISOString(),
    unlocked: m.unlocksAt.getTime() <= now,
  }));

  return <FutureMessagesClient messages={items} capsuleName={capsule.name} />;
}
