"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { CapsuleOpening } from "@/components/capsule/CapsuleOpening";
import { MemoryCalendar, FutureMessageMarker } from "@/components/capsule/MemoryCalendar";
import { MemoryCard, Memory } from "@/components/capsule/MomentosClaveClient";
import { MemoryViewerDrawer } from "@/components/capsule/MemoryViewerDrawer";
import { getDeliveryByToken } from "@/lib/actions/delivery.actions";
import { toDeliveryMediaUrl } from "@/lib/utils";
import { Heart, BookOpen, Mail } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type DeliveryData = {
  /**
   * Nulable desde la Fase 2: el nombre de quien recibe pasa a poder vaciarse
   * cuando el contenido de la capsula esta cifrado, asi que aqui puede llegar
   * sin el. La cabecera dice «Para ti» en ese caso, que es verdad igual.
   */
  recipientName: string | null;
  capsule: {
    name: string;
    type: string;
    description?: string | null;
    coverUrl?: string | null;
    memories: Memory[];
    futureMessages: { id: string; unlocksAt: string }[];
    user?: { name: string | null; image: string | null } | null;
  };
};

type Phase = "opening" | "bienvenida" | "dentro";

const DEFAULT_DESCRIPTION =
  "Elegimos seguir escribiendo nuestra historia, cada día, juntos.";

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CapsuleTokenPage() {
  const { token } = useParams<{ token: string }>();
  const [delivery, setDelivery] = useState<DeliveryData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [phase, setPhase] = useState<Phase>("opening");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  useEffect(() => {
    getDeliveryByToken(token).then((data) => {
      if (!data) { setNotFound(true); return; }

      const transformed: DeliveryData = {
        recipientName: data.recipientName,
        capsule: {
          ...data.capsule,
          memories: (data.capsule.memories as Memory[]).map((m) => ({
            ...m,
            fileUrl: m.fileUrl ? (toDeliveryMediaUrl(m.fileUrl, token) ?? m.fileUrl) : null,
          })),
          futureMessages: (data.capsule.futureMessages ?? []).map((fm) => {
            const unlocksAt =
              fm.unlocksAt instanceof Date
                ? fm.unlocksAt.toISOString()
                : String(fm.unlocksAt);
            return { id: fm.id, unlocksAt };
          }),
        },
      };

      setDelivery(transformed);
    });
  }, [token]);

  // ── Opening animation plays immediately while data loads in background ───
  if (phase === "opening") {
    return <CapsuleOpening onComplete={() => setPhase("bienvenida")} />;
  }

  // ── Loading / not found (after animation completes) ───────────────────────
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <SparkIcon className="text-2xl opacity-20 mb-4" />
        <p className="font-serif text-2xl text-foreground mb-2">Esta cápsula no existe.</p>
        <p className="text-[13px] text-foreground/50">El enlace puede haber expirado o ser incorrecto.</p>
      </div>
    );
  }

  // In the unlikely case data hasn't loaded by the time the animation finishes
  if (!delivery) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-6 w-6 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
      </div>
    );
  }

  // ── Welcome screen ────────────────────────────────────────────────────────
  if (phase === "bienvenida") {
    const senderName = delivery.capsule.user?.name ?? "Alguien especial";
    const avatar = delivery.capsule.user?.image ?? delivery.capsule.coverUrl;

    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-center max-w-[430px] mx-auto w-full">
        <SparkIcon className="text-xl text-foreground mb-8" />
        <h1 className="font-serif text-3xl leading-tight text-foreground max-w-[280px] mb-4">
          Esto fue guardado para ti.
        </h1>
        <p className="font-sans text-[14px] text-foreground/55 leading-relaxed max-w-[300px] mb-10">
          Alguien especial ha creado esta cápsula con recuerdos, palabras y momentos que quiere que conserves.
        </p>

        <div className="relative mb-10">
          <div className="h-[140px] w-[140px] rounded-full overflow-hidden bg-surface border border-border">
            {avatar ? (
              <Image src={toDeliveryMediaUrl(avatar, token) ?? avatar} alt={senderName} width={140} height={140} className="h-full w-full object-cover" />
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

        <p className="font-sans text-[15px] text-foreground/70 mb-6">De: {senderName}</p>

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
          className="w-full max-w-[320px] flex items-center justify-center gap-2 rounded-sm bg-foreground text-background py-4 text-sm font-semibold tracking-wider uppercase transition-all active:scale-[0.98] hover:opacity-90"
        >
          <SparkIcon className="text-[10px]" />
          <span>VER MI CÁPSULA</span>
        </button>
      </div>
    );
  }

  // ── Dentro ────────────────────────────────────────────────────────────────
  const { capsule } = delivery;
  const futureMessageMarkers: FutureMessageMarker[] = capsule.futureMessages;
  const favoritesCount = capsule.memories.filter((m) => m.isFavorite).length;

  return (
    <>
      <div className="flex flex-col items-center pt-10 pb-12 px-6 max-w-[430px] mx-auto w-full">

        {/* Badge */}
        <div className="mb-8">
          <span className="rounded-full border border-foreground/10 px-6 py-1 text-[10px] font-bold tracking-[0.3em] uppercase bg-surface/50">
            {capsule.type.toLowerCase()} ✦
          </span>
        </div>

        {/* Cover */}
        <div className="relative mb-6">
          <div className="h-[120px] w-[120px] rounded-full bg-surface overflow-hidden border-4 border-background shadow-sm relative">
            {capsule.coverUrl ? (
              <Image src={toDeliveryMediaUrl(capsule.coverUrl, token) ?? capsule.coverUrl} alt={capsule.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-serif text-foreground/20 uppercase">
                {capsule.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1 className="font-serif text-3xl font-semibold text-foreground text-center mb-2">
          {capsule.name}
        </h1>

        {/* Recipient */}
        <p className="text-[13px] text-foreground/50 mb-4">
          {delivery.recipientName ? `Para: ${delivery.recipientName}` : "Para ti"}
        </p>

        <div className="flex gap-2 items-center justify-center w-full mb-4">
          <div className="w-[35%] h-px bg-gray-300" />
          <Heart className="h-4 w-4 text-foreground/20" />
          <div className="w-[35%] h-px bg-gray-300" />
        </div>

        <p className="font-sans italic text-[15px] text-foreground/60 text-center leading-relaxed max-w-[300px] mb-4">
          {capsule.description || DEFAULT_DESCRIPTION}
        </p>

        <Heart className="h-4 w-4 text-foreground/20 mb-10" />

        {/* Stats — identical layout to CapsuleProfile */}
        <div className="w-full rounded-3xl p-6 mb-6 border-border border bg-background shadow-sm">
          <div className="flex w-full items-center justify-between mb-4">
            <Link
              href={`/capsula/${token}/memories`}
              className="group flex flex-col items-center gap-1 flex-1 border-r border-border"
            >
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
                <span className="text-xl font-serif">{capsule.memories.length}</span>
              </div>
              <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40 group-hover:text-foreground/70 transition-colors">
                Recuerdos
              </span>
            </Link>
            <Link
              href={`/capsula/${token}/momentos-clave`}
              className="group flex flex-col items-center gap-1 flex-1"
            >
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
                <span className="text-xl font-serif">{favoritesCount}</span>
              </div>
              <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40 group-hover:text-foreground/70 transition-colors">
                Momentos clave
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-border" />
            <SparkIcon className="text-[12px] opacity-30" />
            <div className="h-px flex-1 bg-border" />
          </div>

          <Link
            href={`/capsula/${token}/mensajes-futuros`}
            className="group flex flex-col items-center gap-1 mt-4"
          >
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
              <span className="text-xl font-serif">{capsule.futureMessages.length}</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40 group-hover:text-foreground/70 transition-colors">
              Mensajes futuros
            </span>
          </Link>
        </div>

        {/* Calendar — navigates to /capsula/[token]/dia/[fecha] */}
        <div className="w-full mb-6">
          <MemoryCalendar
            memories={capsule.memories}
            futureMessages={futureMessageMarkers}
            routePrefix={`/capsula/${token}`}
          />
        </div>

        {/* Últimos recuerdos */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-[17px] font-semibold text-foreground">Últimos recuerdos</h3>
            <Link
              href={`/capsula/${token}/memories`}
              className="text-[12px] font-medium text-foreground/40 hover:text-foreground"
            >
              Ver todos →
            </Link>
          </div>
          {capsule.memories.length === 0 ? (
            <div className="flex h-[100px] w-full items-center justify-center rounded-2xl border border-border">
              <p className="text-[12px] text-foreground/40 italic">Aún no hay recuerdos</p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar -mx-6 px-6">
              {capsule.memories.map((memory) => (
                <div key={memory.id} className="shrink-0 w-[120px] min-[320px]:w-[140px]">
                  <MemoryCard memory={memory} onClick={() => setSelectedMemory(memory)} readOnly />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 opacity-30">
          <SparkIcon className="text-[10px]" />
          <span className="font-sans text-[11px] tracking-[0.2em]">NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
      </div>

      {/* Memory viewer drawer (for the horizontal strip) */}
      <MemoryViewerDrawer
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        readOnly
      />
    </>
  );
}
