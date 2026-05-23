import { getDeliveryByToken } from "@/lib/actions/delivery.actions";
import { toDeliveryMediaUrl } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MemoriesClient } from "@/components/capsule/MemoriesClient";
import type { Memory } from "@/components/capsule/MomentosClaveClient";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function GuestMemoriesPage({ params }: PageProps) {
  const { token } = await params;
  const delivery = await getDeliveryByToken(token);
  if (!delivery) notFound();

  const memories: Memory[] = (delivery.capsule.memories as Memory[]).map((m) => ({
    ...m,
    fileUrl: m.fileUrl ? (toDeliveryMediaUrl(m.fileUrl, token) ?? m.fileUrl) : null,
  }));

  return (
    <div className="flex flex-col pt-8 pb-12 px-6">
      {/* Back */}
      <Link
        href={`/capsula/${token}`}
        className="flex items-center gap-1 text-[13px] text-foreground/50 hover:text-foreground mb-6 -ml-1 w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver
      </Link>

      {/* Hero */}
      <div className="mb-8 text-center">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-2">
          RECUERDOS ✦
        </p>
        <h1 className="font-serif text-3xl text-foreground mb-1">{delivery.capsule.name}</h1>
        <p className="text-[13px] text-foreground/50">
          {memories.length} recuerdo{memories.length !== 1 ? "s" : ""} guardado{memories.length !== 1 ? "s" : ""}
        </p>
      </div>

      <MemoriesClient memories={memories} readOnly />
    </div>
  );
}
