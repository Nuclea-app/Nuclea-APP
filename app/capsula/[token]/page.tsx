"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { CapsuleOpening } from "@/components/capsule/CapsuleOpening";
import { MemoryCalendar, FutureMessageMarker } from "@/components/capsule/MemoryCalendar";
import { MemoryCard, Memory } from "@/components/capsule/MomentosClaveClient";
import { MemoryViewerDrawer } from "@/components/capsule/MemoryViewerDrawer";
import { getDeliveryByToken } from "@/lib/actions/delivery.actions";
import { toDeliveryMediaUrl } from "@/lib/utils";
import {
  Heart, BookOpen, Lock, LockOpen, Mail, Send,
  X, ChevronRight, Mic, Video, FileText, Calendar,
  Image as ImageIcon,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────

type FutureMessageFull = {
  id: string;
  unlocksAt: string;
  type: string;
  content: string | null;
  fileUrl: string | null;
  unlocked: boolean;
};

type DeliveryData = {
  recipientName: string;
  capsule: {
    name: string;
    type: string;
    description?: string | null;
    coverUrl?: string | null;
    memories: Memory[];
    futureMessages: FutureMessageFull[];
    user?: { name: string | null; image: string | null } | null;
  };
};

type Phase = "opening" | "bienvenida" | "dentro";

type SelectedDay = { day: number; year: number; month: number };

const DEFAULT_DESCRIPTION =
  "Elegimos seguir escribiendo nuestra historia, cada día, juntos.";

const MONTH_NAMES = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
];

const isUnlocked = (unlocksAt: string) => new Date(unlocksAt) <= new Date();

// ── Page ──────────────────────────────────────────────────────────────────────

export default function CapsuleTokenPage() {
  const { token } = useParams<{ token: string }>();
  const [delivery, setDelivery] = useState<DeliveryData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [phase, setPhase] = useState<Phase>("opening");

  // Memory viewer
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  // Day drawer
  const [selectedDay, setSelectedDay] = useState<SelectedDay | null>(null);

  // Future message detail drawer
  const [selectedFutureMessage, setSelectedFutureMessage] = useState<FutureMessageFull | null>(null);
  const [futureTab, setFutureTab] = useState<"unlocked" | "locked">("unlocked");

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
            return {
              ...fm,
              unlocksAt,
              fileUrl: fm.fileUrl
                ? (toDeliveryMediaUrl(fm.fileUrl, token) ?? fm.fileUrl)
                : null,
              unlocked: isUnlocked(unlocksAt),
            };
          }),
        },
      };

      setDelivery(transformed);
    });
  }, [token]);

  // ── Loading / not found ───────────────────────────────────────────────────
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <SparkIcon className="text-2xl opacity-20 mb-4" />
        <p className="font-serif text-2xl text-foreground mb-2">Esta cápsula no existe.</p>
        <p className="text-[13px] text-foreground/50">El enlace puede haber expirado o ser incorrecto.</p>
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

  // ── Opening animation ─────────────────────────────────────────────────────
  if (phase === "opening") {
    return <CapsuleOpening onComplete={() => setPhase("bienvenida")} />;
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
              <Image src={avatar} alt={senderName} width={140} height={140} className="h-full w-full object-cover" />
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
  const futureMessagesFull = capsule.futureMessages;
  const futureMessageMarkers: FutureMessageMarker[] = futureMessagesFull.map((fm) => ({
    id: fm.id,
    unlocksAt: fm.unlocksAt,
  }));

  const unlockedMessages = futureMessagesFull.filter((fm) => fm.unlocked);
  const lockedMessages = futureMessagesFull.filter((fm) => !fm.unlocked);

  // Day filtering
  const memoriesForDay = selectedDay
    ? capsule.memories.filter((m) => {
        const d = new Date(m.createdAt);
        return (
          d.getDate() === selectedDay.day &&
          d.getMonth() === selectedDay.month &&
          d.getFullYear() === selectedDay.year
        );
      })
    : [];

  const futureMessagesForDay = selectedDay
    ? futureMessagesFull.filter((fm) => {
        const d = new Date(fm.unlocksAt);
        return (
          d.getDate() === selectedDay.day &&
          d.getMonth() === selectedDay.month &&
          d.getFullYear() === selectedDay.year
        );
      })
    : [];

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
              <Image src={capsule.coverUrl} alt={capsule.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-serif text-foreground/20 uppercase">
                {capsule.name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <h1 className="font-serif text-3xl font-semibold text-foreground text-center mb-4">
          {capsule.name}
        </h1>

        <div className="flex gap-2 items-center justify-center w-full mb-4">
          <div className="w-[35%] h-px bg-gray-300" />
          <Heart className="h-4 w-4 text-foreground/20" />
          <div className="w-[35%] h-px bg-gray-300" />
        </div>

        <p className="font-sans italic text-[15px] text-foreground/60 text-center leading-relaxed max-w-[300px] mb-4">
          {capsule.description || DEFAULT_DESCRIPTION}
        </p>

        <Heart className="h-4 w-4 text-foreground/20 mb-10" />

        {/* Stats */}
        <div className="w-full rounded-3xl p-6 mb-6 border-border border bg-background shadow-sm">
          <div className="flex w-full items-center justify-between mb-4">
            <div className="flex flex-col items-center gap-1 flex-1 border-r border-border">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
                <span className="text-xl font-serif">{capsule.memories.length}</span>
              </div>
              <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">Recuerdos</span>
            </div>
            <div className="flex flex-col items-center gap-1 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Send className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
                <span className="text-xl font-serif">{delivery.recipientName.split(" ")[0]}</span>
              </div>
              <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">Destinatario</span>
            </div>
          </div>

          <div className="flex items-center gap-3 my-1">
            <div className="h-px flex-1 bg-border" />
            <SparkIcon className="text-[12px] opacity-30" />
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="flex flex-col items-center gap-1 mt-4">
            <div className="flex items-center gap-2 mb-1">
              <Mail className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
              <span className="text-xl font-serif">{futureMessagesFull.length}</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">Mensajes futuros</span>
          </div>
        </div>

        {/* ── Calendario — días clickables ── */}
        <div className="w-full mb-6">
          <MemoryCalendar
            memories={capsule.memories}
            futureMessages={futureMessageMarkers}
            onDayClick={(day, year, month) => setSelectedDay({ day, year, month })}
          />
        </div>

        {/* ── Últimos recuerdos ── */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-sans text-[17px] font-semibold text-foreground">Últimos recuerdos</h3>
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

        {/* ── Mensajes futuros ── */}
        {futureMessagesFull.length > 0 ? (
          <div className="w-full mb-8">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-4">
              MENSAJES FUTUROS · {futureMessagesFull.length}
            </p>

            {/* Tabs */}
            <div className="flex items-center gap-1 rounded-2xl bg-surface border border-border p-1 mb-4">
              <button
                onClick={() => setFutureTab("unlocked")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium transition-all ${
                  futureTab === "unlocked" ? "bg-background shadow-sm text-foreground" : "text-foreground/50"
                }`}
              >
                <LockOpen className="h-4 w-4" />
                <span>Disponibles</span>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1.5 text-[11px]">
                  {unlockedMessages.length}
                </span>
              </button>
              <button
                onClick={() => setFutureTab("locked")}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-medium transition-all ${
                  futureTab === "locked" ? "bg-background shadow-sm text-foreground" : "text-foreground/50"
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>Próximos</span>
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground/10 px-1.5 text-[11px]">
                  {lockedMessages.length}
                </span>
              </button>
            </div>

            {/* List */}
            {(futureTab === "unlocked" ? unlockedMessages : lockedMessages).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <SparkIcon className="text-2xl text-foreground/20" />
                <p className="text-[13px] text-foreground/40 text-center">
                  {futureTab === "unlocked" ? "Aún no hay mensajes disponibles." : "No hay mensajes próximos."}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {(futureTab === "unlocked" ? unlockedMessages : lockedMessages).map((fm) => (
                  <button
                    key={fm.id}
                    onClick={() => fm.unlocked && setSelectedFutureMessage(fm)}
                    disabled={!fm.unlocked}
                    className={`group flex w-full items-center gap-4 rounded-3xl border-2 p-4 text-left transition-all duration-200 active:scale-[0.99] ${
                      fm.unlocked
                        ? "border-foreground/10 bg-background hover:border-foreground/30 hover:bg-surface"
                        : "border-foreground/5 bg-surface/50 cursor-default"
                    }`}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface">
                      {fm.unlocked ? (
                        <LockOpen className="h-5 w-5 text-foreground/60" />
                      ) : (
                        <Lock className="h-5 w-5 text-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[11px] text-foreground/40">
                        {fm.unlocked ? "Disponible desde" : "Se abre el"}
                      </span>
                      <h3 className="font-serif text-[18px] leading-tight text-foreground">
                        {new Date(fm.unlocksAt).toLocaleDateString("es-ES", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </h3>
                    </div>
                    {fm.unlocked && (
                      <ChevronRight className="h-5 w-5 shrink-0 text-foreground/30 group-hover:text-foreground transition-colors" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full rounded-3xl p-6 mb-8 border border-border bg-background shadow-sm">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border">
                <Mail className="h-5 w-5 text-foreground/30" strokeWidth={1.5} />
              </div>
              <p className="font-sans text-[13px] text-foreground/40 italic">
                Esta cápsula no tiene mensajes futuros.
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 opacity-30">
          <SparkIcon className="text-[10px]" />
          <span className="font-sans text-[11px] tracking-[0.2em]">NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
      </div>

      {/* ── Memory viewer drawer ── */}
      <MemoryViewerDrawer
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
        readOnly
      />

      {/* ── Day drawer ── */}
      {selectedDay && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedDay(null)} />
          <div className="relative bg-background rounded-t-[32px] px-6 pt-6 pb-12 max-w-[430px] w-full mx-auto shadow-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40">
                  {MONTH_NAMES[selectedDay.month]} {selectedDay.year}
                </p>
                <h3 className="font-serif text-2xl text-foreground">
                  Día {selectedDay.day}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDay(null)}
                className="p-2 rounded-full hover:bg-surface"
              >
                <X className="h-5 w-5 text-foreground/40" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              {memoriesForDay.length === 0 && futureMessagesForDay.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <SparkIcon className="text-2xl text-foreground/20" />
                  <p className="text-[13px] text-foreground/40 text-center italic">
                    No hay recuerdos ni mensajes en este día.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 pb-2">
                  {/* Memories */}
                  {memoriesForDay.map((memory) => (
                    <button
                      key={memory.id}
                      onClick={() => { setSelectedMemory(memory); setSelectedDay(null); }}
                      className="w-full flex items-center gap-4 rounded-3xl border border-border bg-background p-4 text-left hover:bg-surface transition-colors active:scale-[0.99]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
                        {(memory.type === "PHOTO" || memory.type === "DRAWING") && <ImageIcon className="h-4 w-4 text-foreground/50" />}
                        {memory.type === "VIDEO" && <Video className="h-4 w-4 text-foreground/50" />}
                        {memory.type === "AUDIO" && <Mic className="h-4 w-4 text-foreground/50" />}
                        {memory.type === "NOTE" && <FileText className="h-4 w-4 text-foreground/50" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/40">
                          {memory.type === "DRAWING" ? "Dibujo" : memory.type.charAt(0) + memory.type.slice(1).toLowerCase()} ✦
                        </span>
                        <p className="text-[14px] text-foreground truncate">
                          {memory.title || (memory.type === "NOTE" && memory.content ? `"${memory.content.slice(0, 40)}..."` : "Ver recuerdo")}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-foreground/30 shrink-0" />
                    </button>
                  ))}

                  {/* Future messages for this day */}
                  {futureMessagesForDay.map((fm) => (
                    <button
                      key={fm.id}
                      onClick={() => { if (fm.unlocked) { setSelectedFutureMessage(fm); setSelectedDay(null); } }}
                      disabled={!fm.unlocked}
                      className={`w-full flex items-center gap-4 rounded-3xl border p-4 text-left transition-colors active:scale-[0.99] ${
                        fm.unlocked ? "border-border bg-background hover:bg-surface" : "border-border/50 bg-surface/50 cursor-default"
                      }`}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface">
                        {fm.unlocked ? <LockOpen className="h-4 w-4 text-foreground/50" /> : <Lock className="h-4 w-4 text-foreground/30" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/40">
                          Mensaje futuro ✦
                        </span>
                        <p className="text-[14px] text-foreground/70">
                          {fm.unlocked ? "Disponible — toca para ver" : "Aún no disponible"}
                        </p>
                      </div>
                      {fm.unlocked && <ChevronRight className="h-4 w-4 text-foreground/30 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Future message detail drawer ── */}
      {selectedFutureMessage && (
        <div className="fixed inset-0 z-[70] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedFutureMessage(null)} />
          <div className="relative bg-background rounded-t-[32px] px-6 pt-6 pb-12 max-w-[430px] w-full mx-auto shadow-2xl max-h-[85vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-5 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border">
                  <LockOpen className="h-5 w-5 text-foreground/60" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40">MENSAJE FUTURO</p>
                  <p className="text-[13px] text-foreground/60 flex items-center gap-1.5">
                    <Calendar className="h-3 w-3" />
                    {new Date(selectedFutureMessage.unlocksAt).toLocaleDateString("es-ES", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <button onClick={() => setSelectedFutureMessage(null)} className="p-2 rounded-full hover:bg-surface">
                <X className="h-5 w-5 text-foreground/40" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto flex-1">
              <div className="rounded-3xl border border-border bg-background p-5">
                <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
                  <div className="h-7 w-7 rounded-full bg-surface flex items-center justify-center text-foreground/60">
                    {selectedFutureMessage.type === "AUDIO" && <Mic className="h-4 w-4" />}
                    {selectedFutureMessage.type === "VIDEO" && <Video className="h-4 w-4" />}
                    {selectedFutureMessage.type === "NOTE" && <FileText className="h-4 w-4" />}
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/60">
                    {selectedFutureMessage.type === "AUDIO" ? "Audio" : selectedFutureMessage.type === "VIDEO" ? "Vídeo" : "Nota"} ✦
                  </span>
                </div>

                {selectedFutureMessage.type === "NOTE" && (
                  <p className="font-sans italic text-[15px] text-foreground/70 leading-relaxed pl-3 border-l-2 border-foreground/10 py-1">
                    &ldquo;{selectedFutureMessage.content || "Sin contenido"}&rdquo;
                  </p>
                )}

                {selectedFutureMessage.type === "AUDIO" && selectedFutureMessage.fileUrl && (
                  <audio src={selectedFutureMessage.fileUrl} controls className="w-full" />
                )}

                {selectedFutureMessage.type === "VIDEO" && selectedFutureMessage.fileUrl && (
                  <video src={selectedFutureMessage.fileUrl} controls className="w-full rounded-2xl" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
