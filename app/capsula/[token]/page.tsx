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
  BookOpen,
  X,
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
    description?: string | null;
    coverUrl?: string | null;
    memories: Memory[];
    user?: { name: string | null; image: string | null } | null;
  };
};

type Phase = "opening" | "bienvenida" | "dentro";

// ─── Read-only memory card (thumbnail) ───────────────────────────────────────
function MemoryThumb({
  memory,
  onClick,
}: {
  memory: Memory;
  onClick: () => void;
}) {
  const label =
    memory.type === "PHOTO"
      ? "FOTO"
      : memory.type === "VIDEO"
        ? "VIDEO"
        : memory.type === "AUDIO"
          ? "AUDIO"
          : memory.type === "DRAWING"
            ? "DIBUJO"
            : "NOTA";

  return (
    <button
      onClick={onClick}
      className="shrink-0 w-[140px] flex flex-col rounded-2xl overflow-hidden border border-border/60 bg-background active:scale-[0.98] transition-all"
    >
      {/* Image area */}
      <div className="relative w-full aspect-square bg-surface overflow-hidden">
        {(memory.type === "PHOTO" || memory.type === "DRAWING") &&
          memory.fileUrl ? (
          <Image
            src={memory.fileUrl}
            alt={label}
            fill
            className="object-cover"
          />
        ) : memory.type === "VIDEO" && memory.fileUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-slate-100">
            <Play className="h-8 w-8 text-foreground/30" />
          </div>
        ) : memory.type === "AUDIO" ? (
          <div className="flex h-full w-full items-center justify-center bg-surface">
            <Mic className="h-8 w-8 text-foreground/30" />
          </div>
        ) : memory.type === "NOTE" ? (
          <div className="flex h-full w-full items-start p-3 bg-surface/50">
            <p className="text-[11px] text-foreground/60 line-clamp-5 leading-tight text-left">
              {memory.content || "Nota"}
            </p>
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="h-8 w-8 opacity-10" />
          </div>
        )}
      </div>
      {/* Label */}
      <div className="px-3 pt-2 pb-3">
        <p className="text-[11px] font-semibold text-foreground/50 truncate">
          {label} ✦
        </p>
      </div>
    </button>
  );
}

// ─── Full-screen memory viewer overlay ───────────────────────────────────────
function MemoryViewer({
  memory,
  onClose,
}: {
  memory: Memory;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
      <div className="flex items-center justify-end p-4">
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        {(memory.type === "PHOTO" || memory.type === "DRAWING") &&
          memory.fileUrl ? (
          <div className="relative w-full max-h-[70vh] aspect-square">
            <Image
              src={memory.fileUrl}
              alt="Recuerdo"
              fill
              className="object-contain"
            />
          </div>
        ) : memory.type === "VIDEO" && memory.fileUrl ? (
          <video
            src={toProxiedMediaUrl(memory.fileUrl) ?? memory.fileUrl}
            className="w-full max-h-[70vh] rounded-xl"
            controls
            autoPlay
          />
        ) : memory.type === "AUDIO" && memory.fileUrl ? (
          <div className="flex flex-col items-center gap-6 w-full max-w-[300px]">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <Mic className="h-10 w-10 text-white/60" />
            </div>
            <audio
              src={toProxiedMediaUrl(memory.fileUrl) ?? memory.fileUrl}
              controls
              autoPlay
              className="w-full"
            />
          </div>
        ) : memory.type === "NOTE" ? (
          <div className="w-full max-w-[360px] rounded-3xl bg-white/10 p-6">
            <FileText className="h-5 w-5 text-white/40 mb-3" />
            <p className="text-white/80 text-[15px] leading-relaxed">
              {memory.content || "Sin contenido"}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CapsuleTokenPage() {
  const { token } = useParams<{ token: string }>();
  const [delivery, setDelivery] = useState<DeliveryData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [phase, setPhase] = useState<Phase>("opening");
  const [viewerMemory, setViewerMemory] = useState<Memory | null>(null);

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

  // ── Paso 2+3: animación de apertura ──────────────────────────────────────
  if (phase === "opening") {
    return <CapsuleOpening onComplete={() => setPhase("bienvenida")} />;
  }

  // ── Paso 4: pantalla de bienvenida ───────────────────────────────────────
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
          className="w-full max-w-[320px] flex items-center justify-center gap-2 rounded-sm bg-foreground text-background py-4 text-sm font-semibold tracking-wider uppercase transition-all active:scale-[0.98] hover:opacity-90"
        >
          <SparkIcon className="text-[10px]" />
          <span>VER MI CÁPSULA</span>
        </button>
      </div>
    );
  }

  // ── Paso 5: dentro de la cápsula — igual que CapsuleProfile (read-only) ──
  const DEFAULT_DESCRIPTION =
    "Elegimos seguir escribiendo nuestra historia, cada día, juntos.";

  return (
    <>
      <div className="flex flex-col items-center pb-12 px-6">

        {/* Badge */}
        <div className="mb-8">
          <span className="rounded-full border border-foreground/10 px-6 py-1 text-[10px] font-bold tracking-[0.3em] uppercase bg-surface/50">
            CÁPSULA DE RECUERDOS ✦
          </span>
        </div>

        {/* Cover image */}
        <div className="relative mb-6">
          <div className="h-[120px] w-[120px] rounded-full bg-surface overflow-hidden border-4 border-background shadow-sm">
            {delivery.capsule.coverUrl ? (
              <Image
                src={delivery.capsule.coverUrl}
                alt={delivery.capsule.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-serif text-foreground/20 uppercase">
                {delivery.capsule.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1 className="font-serif text-3xl font-semibold text-foreground text-center mb-4">
          {delivery.capsule.name}
        </h1>

        {/* Separator */}
        <div className="flex gap-2 items-center justify-center w-full mb-4">
          <div className="w-[35%] h-px bg-gray-300" />
          <Heart className="h-4 w-4 text-foreground/20" />
          <div className="w-[35%] h-px bg-gray-300" />
        </div>

        {/* Description */}
        <p className="font-sans italic text-[15px] text-foreground/60 text-center leading-relaxed max-w-[300px] mb-4">
          {delivery.capsule.description || DEFAULT_DESCRIPTION}
        </p>

        <Heart className="h-4 w-4 text-foreground/20 mb-10" />

        {/* Stats */}
        <div className="w-full rounded-3xl p-6 mb-6 border-border border bg-background shadow-sm">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen
                className="h-5 w-5 text-foreground/40"
                strokeWidth={1.5}
              />
              <span className="text-xl font-serif">
                {delivery.capsule.memories.length}
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">
              Recuerdos
            </span>
          </div>
        </div>

        {/* Memories */}
        <div className="w-full mb-8">
          <h3 className="font-sans text-[17px] font-semibold text-foreground mb-4">
            Recuerdos
          </h3>
          {delivery.capsule.memories.length === 0 ? (
            <div className="flex h-[100px] w-full items-center justify-center rounded-2xl border border-border">
              <p className="text-[12px] text-foreground/40 italic">
                Aún no hay recuerdos
              </p>
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar -mx-6 px-6">
              {delivery.capsule.memories.map((memory) => (
                <MemoryThumb
                  key={memory.id}
                  memory={memory}
                  onClick={() => setViewerMemory(memory)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Mensajes futuros — bloqueado */}
        <div className="w-full rounded-3xl p-6 mb-8 border border-border/50 bg-surface/30">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border">
              <Lock className="h-5 w-5 text-foreground/30" strokeWidth={1.5} />
            </div>
            <p className="font-sans text-[14px] font-semibold text-foreground/50">
              Mensajes futuros
            </p>
            <p className="text-[12px] text-foreground/30 leading-relaxed">
              Esta sección es privada para el creador de la cápsula.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 opacity-30">
          <SparkIcon className="text-[10px]" />
          <span className="font-sans text-[11px] tracking-[0.2em]">NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
      </div>

      {/* Memory viewer overlay */}
      {viewerMemory && (
        <MemoryViewer
          memory={viewerMemory}
          onClose={() => setViewerMemory(null)}
        />
      )}
    </>
  );
}
