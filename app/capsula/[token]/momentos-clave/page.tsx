"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MomentosClaveClient } from "@/components/capsule/MomentosClaveClient";
import { useEntrega } from "@/components/entrega/EntregaProvider";

export default function GuestMomentosClaveePage() {
  const { token, capsula, recuerdos } = useEntrega();
  const favorites = recuerdos.filter((m) => m.isFavorite);

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
          MOMENTOS CLAVE ✦
        </p>
        <h1 className="font-serif text-3xl text-foreground mb-1">{capsula.nombre}</h1>
        <p className="text-[13px] text-foreground/50 italic mb-1">
          Lo que quedó guardado para siempre.
        </p>
        <p className="text-[12px] text-foreground/40">
          {favorites.length} favorito{favorites.length !== 1 ? "s" : ""}
        </p>
      </div>

      <MomentosClaveClient memories={favorites} readOnly />
    </div>
  );
}
