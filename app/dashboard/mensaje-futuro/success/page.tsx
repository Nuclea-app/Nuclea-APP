import Link from "next/link";
import { Calendar, Lock, Mic, Video, FileText } from "lucide-react";
import { SparkIcon } from "@/components/nuclea/SparkIcon";

interface SuccessPageProps {
  searchParams: Promise<{
    capsule?: string;
    type?: string;
    date?: string;
  }>;
}

const TYPE_LABELS: Record<string, { label: string; Icon: React.ElementType }> =
  {
    AUDIO: { label: "Audio", Icon: Mic },
    VIDEO: { label: "Vídeo", Icon: Video },
    NOTE: { label: "Nota", Icon: FileText },
  };

export default async function MensajeFuturoSuccessPage({
  searchParams,
}: SuccessPageProps) {
  const { capsule: capsuleId, type, date } = await searchParams;

  const backHref = capsuleId
    ? `/dashboard/perfil?capsule=${capsuleId}`
    : "/dashboard/perfil";

  const typeInfo = type ? TYPE_LABELS[type] : TYPE_LABELS["NOTE"];
  const { label: typeLabel, Icon: TypeIcon } = typeInfo;

  const formattedDate = date
    ? new Date(date + "T12:00:00").toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="flex flex-col items-center pb-16 px-6 min-h-screen">
      {/* Ilustración */}
      <div className="relative flex items-center justify-center mb-6">
        <SparkIcon className="absolute -left-8 top-2 text-2xl opacity-30" />
        <div className="flex h-28 w-28 items-center justify-center rounded-3xl border-2 border-border bg-surface/50">
          <div className="relative flex items-center justify-center">
            <Calendar className="h-14 w-14 text-foreground" strokeWidth={1.5} />

            <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
              <Lock className="h-5 w-5 text-foreground" strokeWidth={3} />
            </div>
          </div>
        </div>

        <SparkIcon className="absolute bottom-0 -right-8 text-2xl opacity-30" />
      </div>

      {/* Título */}
      <h1 className="font-serif text-3xl leading-tight text-foreground text-center mb-3 max-w-[260px]">
        Tu mensaje futuro se ha guardado.
      </h1>
      <p className="font-sans text-[13px] text-foreground/50 text-center mb-8 leading-relaxed max-w-[280px]">
        Hemos guardado tu mensaje en el calendario y no podrá abrirse hasta la
        fecha elegida. Estará protegido y esperando su momento.
      </p>

      {/* Card resumen */}
      <div className="w-full rounded-3xl border border-border bg-surface/30 p-5 mb-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border">
            <TypeIcon
              className="h-4 w-4 text-foreground/50"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
              Formato
            </p>
            <p className="text-[14px] font-semibold text-foreground">
              {typeLabel}
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border">
            <Calendar
              className="h-4 w-4 text-foreground/50"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
              Fecha de apertura
            </p>
            <p className="text-[14px] font-semibold text-foreground">
              {formattedDate}
            </p>
          </div>
        </div>

        <div className="h-px bg-border" />

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-background border border-border">
            <Lock className="h-4 w-4 text-foreground/50" strokeWidth={1.5} />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-foreground/40">
              Estado
            </p>
            <p className="text-[14px] font-semibold text-foreground">
              Protegido hasta la fecha elegida
            </p>
          </div>
        </div>
      </div>

      {/* Card informativa */}
      <div className="w-full rounded-2xl border border-border bg-surface/20 px-5 py-4 mb-10">
        <p className="text-[12px] text-foreground/50 leading-relaxed text-center">
          Lo encontrarás en tu calendario. Ese día aparecerá marcado con un
          símbolo especial. Hasta entonces, seguirá guardado.
        </p>
      </div>

      {/* Botón volver */}
      <Link
        href={backHref}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:opacity-90"
      >
        <span>VOLVER A MI PERFIL</span>
      </Link>
    </div>
  );
}
