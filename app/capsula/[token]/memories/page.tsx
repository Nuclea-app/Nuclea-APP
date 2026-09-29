"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MemoriesClient } from "@/components/capsule/MemoriesClient";
import { useEntrega } from "@/components/entrega/EntregaProvider";

export default function GuestMemoriesPage() {
  const { token, capsula, recuerdos: memories } = useEntrega();

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
        <h1 className="font-serif text-3xl text-foreground mb-1">{capsula.nombre}</h1>
        <p className="text-[13px] text-foreground/50">
          {memories.length} recuerdo{memories.length !== 1 ? "s" : ""} guardado{memories.length !== 1 ? "s" : ""}
        </p>
      </div>

      <MemoriesClient memories={memories} readOnly />
    </div>
  );
}
