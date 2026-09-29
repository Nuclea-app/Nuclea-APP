"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import {
  FutureMessagesClient,
  type FutureMessageItem,
} from "@/components/capsule/FutureMessagesClient";
import { useEntrega } from "@/components/entrega/EntregaProvider";

export default function GuestMensajesFuturosPage() {
  const { token, capsula, mensajes } = useEntrega();

  // Si está abierto lo decide el SERVIDOR (con su reloj, en la consulta), no
  // el reloj de este navegador: el texto de un mensaje cerrado ni siquiera
  // llega hasta aquí.
  const items: FutureMessageItem[] = mensajes.map((m) => ({
    id: m.id,
    type: m.type,
    unlocksAt: m.unlocksAt,
    unlocked: m.unlocked,
  }));

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
        capsuleName={capsula.nombre}
        capsuleId={token}
        messageBasePath={`/capsula/${token}/mensajes-futuros`}
      />
    </div>
  );
}
