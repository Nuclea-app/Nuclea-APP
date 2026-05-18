import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserCapsule } from "@/lib/actions/capsule.actions";
import { toProxiedMediaUrl } from "@/lib/utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Mic,
  FileText,
  Image as ImageIcon,
  Video,
  Lock,
  LockOpen,
  ChevronRight,
} from "lucide-react";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { FavoriteButton } from "@/components/capsule/FavoriteButton";
import { isFutureMessageUnlocked } from "@/lib/futureMessages";

interface PageProps {
  params: Promise<{ id: string; fecha: string }>;
}

export default async function DiaPage({ params }: PageProps) {
  const { id: capsuleId, fecha } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const capsule = await getUserCapsule(session.user.id, capsuleId);

  if (!capsule) {
    redirect("/capsulas");
  }

  const dayStart = new Date(`${fecha}T00:00:00.000Z`);
  const dayEnd = new Date(`${fecha}T23:59:59.999Z`);

  // Buscar todos los recuerdos de ese día exacto (usando createdAt para alinearse con el calendario)
  const memoriesDelDia = await prisma.memory.findMany({
    where: {
      capsuleId: capsule.id,
      createdAt: { gte: dayStart, lte: dayEnd },
    },
    orderBy: { createdAt: "asc" },
  });

  // Mensajes futuros programados para ese día
  const futureMessagesDelDia = await prisma.futureMessage.findMany({
    where: {
      capsuleId: capsule.id,
      unlocksAt: { gte: dayStart, lte: dayEnd },
    },
    orderBy: { unlocksAt: "asc" },
  });

  // Formatear la fecha en español de forma elegante
  const formatFechaElegante = (dateStr: string) => {
    try {
      const date = new Date(dateStr + "T12:00:00");
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const fechaFormateada = formatFechaElegante(fecha);

  return (
    <div className="min-h-screen text-foreground px-6 pb-8 flex flex-col">
      {/* Hero Editorial */}
      <div className="text-center space-y-3 mb-10">
        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40">
          TUS RECUERDOS ✦
        </span>
        <h1 className="font-serif text-3xl font-normal leading-tight text-foreground">
          {fechaFormateada}
        </h1>
        <p className="font-sans italic text-[14px] text-foreground/50 leading-relaxed px-4">
          &quot;Cada fragmento de tu historia que decides atesorar.&quot;
        </p>
      </div>

      {/* Lista de Recuerdos */}
      <main className="flex-1">
        {memoriesDelDia.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-3xl border border-dashed border-border bg-surface/30 gap-3 text-center">
            <SparkIcon className="text-[14px] opacity-20" />
            <p className="font-sans italic text-[14px] text-foreground/40">
              No se encontraron recuerdos guardados en esta fecha.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {memoriesDelDia.map((memory) => (
              <div
                key={memory.id}
                className="relative overflow-hidden rounded-3xl border border-border bg-surface/30 p-5 flex flex-col gap-2 shadow-xs"
              >
                <FavoriteButton
                  memoryId={memory.id}
                  initialIsFavorite={memory.isFavorite}
                  className="absolute bottom-0 right-3 z-10"
                />

                {/* Badge de tipo */}
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-surface flex items-center justify-center text-foreground/60">
                      {(memory.type === "PHOTO" ||
                        memory.type === "DRAWING") && (
                        <ImageIcon className="h-4 w-4" />
                      )}
                      {memory.type === "VIDEO" && <Video className="h-4 w-4" />}
                      {memory.type === "AUDIO" && <Mic className="h-4 w-4" />}
                      {memory.type === "NOTE" && (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/60">
                      {memory.type === "DRAWING" ? "DIBUJO" : memory.type} ✦
                    </span>
                  </div>
                  <span className="text-[10px] text-foreground/40 font-medium">
                    {new Date(memory.createdAt).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {/* Contenido según tipo */}
                <div className="flex-1">
                  {(memory.type === "PHOTO" || memory.type === "DRAWING") &&
                    memory.fileUrl && (
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface mb-2">
                        <Image
                          src={memory.fileUrl}
                          alt="Recuerdo guardado"
                          fill
                          className="object-cover"
                          sizes="(max-width: 430px) 100vw, 400px"
                        />
                      </div>
                    )}

                  {memory.type === "VIDEO" && memory.fileUrl && (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-surface mb-2">
                      <video
                        src={
                          toProxiedMediaUrl(memory.fileUrl) ?? memory.fileUrl
                        }
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {memory.type === "AUDIO" && memory.fileUrl && (
                    <div className="flex flex-col gap-3 p-4 rounded-2xl bg-surface/60 border border-border">
                      <div className="flex gap-[2px] items-center h-4 justify-center">
                        <div className="w-[3px] h-3 bg-foreground/20 rounded-full animate-pulse" />
                        <div className="w-[3px] h-6 bg-foreground/40 rounded-full" />
                        <div className="w-[3px] h-4 bg-foreground/30 rounded-full" />
                        <div className="w-[3px] h-7 bg-foreground/50 rounded-full" />
                        <div className="w-[3px] h-5 bg-foreground/35 rounded-full" />
                        <div className="w-[3px] h-2 bg-foreground/20 rounded-full animate-pulse" />
                      </div>
                      <audio
                        src={
                          toProxiedMediaUrl(memory.fileUrl) ?? memory.fileUrl
                        }
                        controls
                        className="w-full h-8 mt-1"
                      />
                    </div>
                  )}

                  {memory.type === "NOTE" && memory.content && (
                    <p className="font-sans italic text-[15px] text-foreground/70 leading-relaxed pl-2 border-l-2 border-foreground/10 py-1">
                      &quot;{memory.content}&quot;
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensajes futuros del día */}
        {futureMessagesDelDia.length > 0 && (
          <div className="mt-10">
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-4">
              MENSAJE FUTURO ✦
            </p>
            <div className="space-y-3">
              {futureMessagesDelDia.map((fm) => {
                const unlocked = isFutureMessageUnlocked(fm.unlocksAt);
                return (
                  <Link
                    key={fm.id}
                    href={`/dashboard/mensajes-futuros/${fm.id}`}
                    className="group flex items-center gap-4 rounded-3xl border border-border bg-surface/30 p-4 transition-all hover:bg-surface active:scale-[0.99]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-background border border-border">
                      {unlocked ? (
                        <LockOpen className="h-5 w-5 text-foreground/60" />
                      ) : (
                        <Lock className="h-5 w-5 text-foreground/60" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold tracking-widest uppercase text-foreground/40">
                        {unlocked ? "Desbloqueado" : "Programado"}
                      </span>
                      <p className="text-[14px] text-foreground/70">
                        Revisar mensaje futuro
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-foreground/30 group-hover:text-foreground transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
