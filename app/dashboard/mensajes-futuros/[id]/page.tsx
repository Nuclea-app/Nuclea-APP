import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { Lock, LockOpen, Mic, Video, FileText, Calendar } from "lucide-react";
import { isFutureMessageUnlocked } from "@/lib/futureMessages";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MensajeFuturoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const message = await prisma.futureMessage.findUnique({
    where: { id },
    include: { capsule: { select: { userId: true, name: true, id: true } } },
  });

  if (!message || message.capsule.userId !== session.user.id) {
    notFound();
  }

  const unlocked = isFutureMessageUnlocked(message.unlocksAt);
  const formattedDate = message.unlocksAt.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const typeLabel =
    message.type === "AUDIO"
      ? "Audio"
      : message.type === "VIDEO"
        ? "Vídeo"
        : "Nota";

  return (
    <div className="flex flex-col min-h-screen pb-20 px-6">
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
        <h1 className="font-serif text-3xl text-foreground mb-1">
          {message.capsule.name}
        </h1>
        <p className="text-[13px] text-foreground/50 flex items-center gap-1.5 mt-1">
          <Calendar className="h-3.5 w-3.5" />
          {unlocked ? "Desbloqueado el" : "Se desbloquea el"} {formattedDate}
        </p>
      </div>

      {/* Content */}
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

        {message.type === "AUDIO" && message.fileUrl && (
          <audio src={message.fileUrl} controls className="w-full" />
        )}

        {message.type === "VIDEO" && message.fileUrl && (
          <video
            src={message.fileUrl}
            controls
            className="w-full rounded-2xl"
          />
        )}

        {message.type === "NOTE" && (
          <p className="font-sans italic text-[15px] text-foreground/70 leading-relaxed pl-3 border-l-2 border-foreground/10 py-1">
            &ldquo;{message.content || "Sin contenido"}&rdquo;
          </p>
        )}
      </div>

      {/* Status note */}
      <div className="flex items-start gap-3 rounded-2xl bg-surface/50 border border-border p-4 mt-4">
        <Lock className="h-4 w-4 shrink-0 text-foreground/40 mt-0.5" />
        <p className="text-[12px] text-foreground/50 leading-relaxed">
          {unlocked
            ? "Este mensaje ya está desbloqueado."
            : "Este mensaje permanece protegido y se abrirá en la fecha elegida."}
        </p>
      </div>
    </div>
  );
}
