"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { CapsuleOpening } from "@/components/capsule/CapsuleOpening";
import { getDeliveryByToken } from "@/lib/actions/delivery.actions";
import { toProxiedMediaUrl } from "@/lib/utils";
import {
  FileText,
  Image as ImageIcon,
  Mic,
  Play,
  Lock,
  Heart,
} from "lucide-react";

type Memory = {
  id: string;
  type: "PHOTO" | "VIDEO" | "AUDIO" | "NOTE" | "DRAWING";
  fileUrl?: string | null;
  content?: string | null;
  createdAt: Date | string;
};

type DeliveryData = {
  recipientName: string;
  capsule: {
    name: string;
    coverUrl?: string | null;
    memories: Memory[];
    user?: { name: string | null; image: string | null } | null;
  };
};

type Phase = "opening" | "bienvenida" | "dentro";

export default function CapsuleTokenPage() {
  const { token } = useParams<{ token: string }>();
  const [delivery, setDelivery] = useState<DeliveryData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [phase, setPhase] = useState<Phase>("opening");

  useEffect(() => {
    getDeliveryByToken(token).then((data) => {
      if (!data) {
        setNotFound(true);
        return;
      }
      setDelivery(data as DeliveryData);
    });
  }, [token]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <SparkIcon className="text-2xl opacity-20 mb-4" />
        <p className="font-serif text-2xl text-foreground mb-2">
          Esta cápsula no existe.
        </p>
        <p className="text-[13px] text-foreground/50">
          El enlace puede haber expirado o ser incorrecto.
        </p>
      </div>
    );
  }

  if (!delivery) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-6 w-6 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  // Paso 2 + 3: animación de apertura
  if (phase === "opening") {
    return <CapsuleOpening onComplete={() => setPhase("bienvenida")} />;
  }

  // Paso 4: pantalla de bienvenida
  if (phase === "bienvenida") {
    const senderName = delivery.capsule.user?.name ?? "Alguien especial";
    const avatar = delivery.capsule.user?.image ?? delivery.capsule.coverUrl;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center max-w-[430px] mx-auto">
        <SparkIcon className="text-xl text-foreground mb-8" />

        <h1 className="font-serif text-3xl leading-tight text-foreground max-w-[280px] mb-4">
          Esto fue guardado para ti.
        </h1>
        <p className="font-sans text-[14px] text-foreground/55 leading-relaxed max-w-[300px] mb-10">
          Alguien especial ha creado esta cápsula con recuerdos, palabras y
          momentos que quiere que conserves.
        </p>

        {/* Imagen del remitente */}
        <div className="relative mb-10">
          <div className="h-[140px] w-[140px] rounded-full overflow-hidden bg-surface border border-border">
            {avatar ? (
              <Image
                src={avatar}
                alt={senderName}
                width={140}
                height={140}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-4xl font-serif text-foreground/20 uppercase">
                {senderName.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-background border border-border shadow-sm">
            <Heart className="h-4 w-4 text-foreground" strokeWidth={2.5} />
          </div>
        </div>

        <p className="font-sans text-[15px] text-foreground/70 mb-6">
          De: {senderName}
        </p>

        <div className="flex gap-2 items-center justify-center w-full mb-6">
          <div className="w-[35%] h-px bg-gray-300" />
          <span className="text-xl">✦</span>
          <div className="w-[35%] h-px bg-gray-300" />
        </div>

        <p className="font-sans italic text-[14px] text-foreground/55 leading-relaxed max-w-[280px] mb-10">
          Abre tu cápsula para descubrir todo lo que hay dentro.
        </p>

        <button
          onClick={() => setPhase("dentro")}
          className="w-full max-w-[320px] flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:opacity-90"
        >
          <SparkIcon className="text-[10px]" />
          <span>VER MI CÁPSULA</span>
        </button>
      </div>
    );
  }

  // Paso 5: dentro de la cápsula
  return (
    <div className="flex flex-col pb-12 px-6 pt-10 min-h-screen">
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px]">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-2">
          CÁPSULA DE RECUERDOS ✦
        </p>
        <h1 className="font-serif text-2xl text-foreground mb-1">
          {delivery.capsule.name}
        </h1>
        <p className="text-[13px] text-foreground/50">
          Creada especialmente para {delivery.recipientName}
        </p>
      </div>

      {delivery.capsule.memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-surface/30 py-16 text-center">
          <SparkIcon className="text-2xl opacity-20" />
          <p className="text-[13px] text-foreground/40 italic">
            Esta cápsula aún no tiene recuerdos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {delivery.capsule.memories.map((memory) => (
            <div
              key={memory.id}
              className="relative aspect-square rounded-2xl bg-surface overflow-hidden"
            >
              {(memory.type === "PHOTO" || memory.type === "DRAWING") &&
                (memory.fileUrl ? (
                  <>
                    <Image
                      src={memory.fileUrl}
                      alt="Recuerdo"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-[9px] text-white font-medium uppercase tracking-wider">
                      {memory.type === "DRAWING" ? "DIBUJO" : "PHOTO"} ✦
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 opacity-10" />
                  </div>
                ))}

              {memory.type === "VIDEO" &&
                (memory.fileUrl ? (
                  <div className="relative w-full h-full bg-slate-100">
                    <video
                      src={toProxiedMediaUrl(memory.fileUrl) ?? memory.fileUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                    <div className="absolute top-2 left-2 text-[9px] text-white font-medium uppercase tracking-wider bg-black/40 rounded px-1">
                      VIDEO ✦
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Play className="h-8 w-8 opacity-10" />
                  </div>
                ))}

              {memory.type === "AUDIO" && memory.fileUrl && (
                <div className="flex flex-col items-center justify-center h-full gap-2 p-4 bg-surface/50">
                  <Mic className="h-6 w-6 text-foreground/40" />
                  <audio src={toProxiedMediaUrl(memory.fileUrl) ?? memory.fileUrl} controls className="w-full" />
                  <span className="text-[9px] text-foreground/40 font-medium uppercase tracking-wider">
                    AUDIO ✦
                  </span>
                </div>
              )}

              {memory.type === "NOTE" && (
                <div className="flex flex-col h-full p-4 gap-2 bg-surface/50">
                  <FileText className="h-4 w-4 text-foreground/40" />
                  <p className="text-[11px] text-foreground/60 line-clamp-6 leading-tight">
                    {memory.content || "Sin contenido"}
                  </p>
                  <span className="text-[8px] font-medium tracking-widest uppercase text-foreground/30 mt-auto">
                    NOTA ✦
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 flex items-center justify-center gap-2 opacity-30">
        <Lock className="h-3 w-3" />
        <span className="font-sans text-[10px] tracking-[0.2em]">
          Creado especialmente para ti
        </span>
      </div>
    </div>
  );
}
