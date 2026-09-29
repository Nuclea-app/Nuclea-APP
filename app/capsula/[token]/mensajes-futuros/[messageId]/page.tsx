"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ChevronLeft, Lock, LockOpen, Mic, Video, FileText, Calendar } from "lucide-react";
import { useEntrega } from "@/components/entrega/EntregaProvider";

export default function GuestMensajeFuturoDetailPage() {
  const { messageId } = useParams<{ messageId: string }>();
  const { token, capsula, mensajes } = useEntrega();

  const message = mensajes.find((fm) => fm.id === messageId);
  if (!message) notFound();

  const unlocksAt = new Date(message.unlocksAt);
  // Lo decide el servidor: de un mensaje cerrado no llega ni el texto.
  const unlocked = message.unlocked;
  const fileUrl = message.fileUrl;

  const formattedDate = unlocksAt.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const typeLabel =
    message.type === "AUDIO" ? "Audio" : message.type === "VIDEO" ? "Vídeo" : "Nota";

  return (
    <div className="flex flex-col min-h-screen pt-8 pb-20 px-6">
      {/* Back */}
      <Link
        href={`/capsula/${token}/mensajes-futuros`}
        className="flex items-center gap-1 text-[13px] text-foreground/50 hover:text-foreground mb-6 -ml-1 w-fit"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver
      </Link>

      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface border border-border mb-5">
          {unlocked ? (
            <LockOpen className="h-7 w-7 text-foreground/70" strokeWidth={1.5} />
          ) : (
            <Lock className="h-7 w-7 text-foreground/70" strokeWidth={1.5} />
          )}
        </div>
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-2">
          MENSAJE FUTURO ✦
        </p>
        <h1 className="font-serif text-3xl text-foreground mb-1">{capsula.nombre}</h1>
        <p className="text-[13px] text-foreground/50 flex items-center gap-1.5 mt-1">
          <Calendar className="h-3.5 w-3.5" />
          {unlocked ? "Disponible desde" : "Se abre el"} {formattedDate}
        </p>
      </div>

      {/* Content */}
      {!unlocked ? (
        <div className="rounded-3xl border border-border bg-surface/30 p-8 text-center">
          <Lock className="h-8 w-8 text-foreground/20 mx-auto mb-3" strokeWidth={1.5} />
          <p className="font-sans text-[14px] text-foreground/50">
            Este mensaje se abrirá el {formattedDate}.
          </p>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-background p-5 shadow-sm">
          <div className="flex items-center gap-2 border-b border-border/50 pb-3 mb-4">
            <div className="h-7 w-7 rounded-full bg-surface flex items-center justify-center text-foreground/60">
              {message.type === "AUDIO" && <Mic className="h-4 w-4" />}
              {message.type === "VIDEO" && <Video className="h-4 w-4" />}
              {message.type === "NOTE" && <FileText className="h-4 w-4" />}
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/60">
              {typeLabel} ✦
            </span>
          </div>

          {message.type === "AUDIO" && fileUrl && (
            <audio src={fileUrl} controls className="w-full" />
          )}

          {message.type === "VIDEO" && fileUrl && (
            <video src={fileUrl} controls className="w-full rounded-2xl" />
          )}

          {message.type === "NOTE" && (
            <p className="font-sans italic text-[15px] text-foreground/70 leading-relaxed pl-3 border-l-2 border-foreground/10 py-1">
              {message.ilegible
                ? "Este mensaje no se ha podido abrir. Escríbenos y lo revisamos."
                : <>&ldquo;{message.texto || "Sin contenido"}&rdquo;</>}
            </p>
          )}
        </div>
      )}

      {/* Status note */}
      <div className="flex items-start gap-3 rounded-2xl bg-surface/50 border border-border p-4 mt-4">
        {unlocked ? (
          <LockOpen className="h-4 w-4 shrink-0 text-foreground/40 mt-0.5" />
        ) : (
          <Lock className="h-4 w-4 shrink-0 text-foreground/40 mt-0.5" />
        )}
        <p className="text-[12px] text-foreground/50 leading-relaxed">
          {unlocked
            ? "Este mensaje ya está disponible para ti."
            : "Este mensaje permanece protegido y se abrirá en la fecha elegida."}
        </p>
      </div>
    </div>
  );
}
