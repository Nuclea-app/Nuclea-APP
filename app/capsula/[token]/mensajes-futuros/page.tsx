import { getDeliveryByToken } from "@/lib/actions/delivery.actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  FutureMessagesClient,
  type FutureMessageItem,
} from "@/components/capsule/FutureMessagesClient";
import { isFutureMessageUnlocked } from "@/lib/futureMessages";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function GuestMensajesFuturosPage({ params }: PageProps) {
  const { token } = await params;
  const delivery = await getDeliveryByToken(token);
  if (!delivery) notFound();

  const items: FutureMessageItem[] = (delivery.capsule.futureMessages ?? []).map((fm) => {
    const unlocksAt =
      fm.unlocksAt instanceof Date ? fm.unlocksAt.toISOString() : String(fm.unlocksAt);
    return {
      id: fm.id,
      type: fm.type,
      unlocksAt,
      unlocked: isFutureMessageUnlocked(
        fm.unlocksAt instanceof Date ? fm.unlocksAt : new Date(fm.unlocksAt)
      ),
    };
  });

  return (
    <div className="flex flex-col pt-8">
      {/* Back */}
      <div className="px-6">
        <Link
          href={`/capsula/${token}`}
          className="flex items-center gap-1 text-[13px] text-foreground/50 hover:text-foreground mb-6 -ml-1 w-fit"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver
        </Link>
      </div>

      <FutureMessagesClient
        messages={items}
        capsuleName={delivery.capsule.name}
        capsuleId={token}
        messageBasePath={`/capsula/${token}/mensajes-futuros`}
      />
    </div>
  );
}
