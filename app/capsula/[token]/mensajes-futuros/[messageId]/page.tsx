import { getDeliveryByToken } from "@/lib/actions/delivery.actions";
import { toDeliveryMediaUrl } from "@/lib/utils";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Lock, LockOpen, Mic, Video, FileText, Calendar } from "lucide-react";
import { isFutureMessageUnlocked } from "@/lib/futureMessages";

interface PageProps {
  params: Promise<{ token: string; messageId: string }>;
}

export default async function GuestMensajeFuturoDetailPage({ params }: PageProps) {
  const { token, messageId } = await params;
  const delivery = await getDeliveryByToken(token);
  if (!delivery) notFound();

  const message = (delivery.capsule.futureMessages ?? []).find((fm) => fm.id === messageId);
  if (!message) notFound();

  const unlocksAt =
    message.unlocksAt instanceof Date ? message.unlocksAt : new Date(message.unlocksAt);
  const unlocked = isFutureMessageUnlocked(unlocksAt);

  const formattedDate = unlocksAt.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const typeLabel =
    message.type === "AUDIO" ? "Audio" : message.type === "VIDEO" ? "Vídeo" : "Nota";

  const fileUrl = message.fileUrl
    ? (toDeliveryMediaUrl(message.fileUrl, token) ?? message.fileUrl)
    : null;

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
        <h1 className="font-serif text-3xl text-foreground mb-1">{delivery.capsule.name}</h1>
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
              &ldquo;{message.content || "Sin contenido"}&rdquo;
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
