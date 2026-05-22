import Link from "next/link";
import Image from "next/image";
import { Heart, Calendar, Clock } from "lucide-react";
import { SparkIcon } from "@/components/nuclea/SparkIcon";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; emails?: string }>;
}

export default async function EntregarSuccessPage({
  params,
  searchParams,
}: PageProps) {
  const { id: capsuleId } = await params;
  const { name } = await searchParams;

  const now = new Date();
  const formattedDate = now.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = now.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col items-center pb-16 px-6 min-h-screen">
      {/* Título */}
      <h1 className="font-serif text-4xl font-semibold leading-tight text-foreground text-center mb-3">
        Cápsula enviada <SparkIcon className="inline text-2xl" />
      </h1>
      <p className="font-sans text-[14px] text-foreground/50 text-center mb-8 leading-relaxed">
        Tu mensaje ya está en camino.
        <br />
        Lo que envías hoy, puede quedarse para siempre.
      </p>

      {/* Ilustración: sello + cápsula + corazón */}
      <div className="flex flex-col items-center mb-8">
        {/* Sello postal */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-dashed border-foreground/20">
            <SparkIcon className="text-base text-foreground" />
          </div>
          {/* Líneas de correo postal */}
          <div className="flex flex-col gap-1.5">
            {[40, 56, 32].map((w, i) => (
              <div
                key={i}
                className="h-[3px] rounded-full bg-foreground/10"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>

        {/* Cápsula */}
        <div className="relative h-[180px] w-[280px] my-2">
          <Image
            src="/nuclea-logo.png"
            alt="Cápsula Nuclea"
            fill
            className="object-contain drop-shadow-xl"
          />
        </div>

        {/* Corazón */}
        <Heart className="h-6 w-6 text-foreground mt-1" strokeWidth={1.5} />
      </div>

      {/* Card resumen */}
      <div className="w-full rounded-3xl border border-border bg-background shadow-sm overflow-hidden mb-6">
        {/* Enviado a */}
        {name && (
          <div className="flex items-center gap-4 px-5 py-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface">
              {/* Avión de papel */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-foreground/50"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] text-foreground/40 mb-0.5">
                Enviado a:
              </p>
              <p className="text-[17px] font-semibold text-foreground">
                {name}
              </p>
            </div>
          </div>
        )}

        <div className="h-px bg-border mx-5" />

        {/* Fecha y hora */}
        <div className="flex items-center gap-6 px-5 py-4">
          <div className="flex items-center gap-2">
            <Calendar
              className="h-4 w-4 text-foreground/30"
              strokeWidth={1.5}
            />
            <span className="text-[13px] text-foreground/60">
              {formattedDate}
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-foreground/30" strokeWidth={1.5} />
            <span className="text-[13px] text-foreground/60">
              {formattedTime}
            </span>
          </div>
        </div>

        <div className="h-px bg-border mx-5" />

        {/* Frase */}
        <div className="flex items-center gap-3 px-5 py-4">
          <SparkIcon className="text-base text-foreground/30 shrink-0" />
          <p className="font-sans text-sm text-foreground/50 leading-relaxed ">
            Lo que hoy envías,
            <br />
            mañana puede significar el mundo.
          </p>
        </div>
      </div>

      {/* Botones */}
      <Link
        href="/dashboard"
        className="w-full flex items-center justify-center gap-2 rounded-sm bg-foreground text-background py-4 text-sm font-semibold tracking-wider uppercase transition-all active:scale-[0.98] hover:opacity-90 mb-3"
      >
        <span>Ver mis cápsulas</span>
        <SparkIcon className="text-sm" />
      </Link>

      <Link
        href="/dashboard"
        className="w-full flex items-center justify-center rounded-sm border-2 border-foreground/20 text-foreground py-4 text-sm font-semibold tracking-wider uppercase transition-all active:scale-[0.98] hover:bg-foreground hover:text-background"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
