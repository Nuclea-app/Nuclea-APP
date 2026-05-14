"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mic, Video, FileText, Calendar, Lock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { createFutureMessage } from "@/lib/actions/futureMessage.actions";
import { MemoryType } from "@prisma/client";

const CONTENT_TYPES = [
  {
    id: "AUDIO" as MemoryType,
    icon: Mic,
    label: "Audio",
    description: "Tu voz, tal y como eres hoy.",
  },
  {
    id: "VIDEO" as MemoryType,
    icon: Video,
    label: "Vídeo",
    description: "Un mensaje con tu imagen.",
  },
  {
    id: "NOTE" as MemoryType,
    icon: FileText,
    label: "Nota",
    description: "Escribe lo que quieres que lean.",
  },
];

export default function MensajeFuturoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const capsuleId = searchParams.get("capsule") ?? "";
  const backHref = capsuleId ? `/dashboard/perfil?capsule=${capsuleId}` : "/dashboard/perfil";

  const [selectedType, setSelectedType] = useState<MemoryType | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [unlocksAt, setUnlocksAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  const canSubmit =
    selectedType !== null &&
    unlocksAt.length > 0 &&
    (selectedType !== "NOTE" || noteContent.trim().length > 0);

  const handleSubmit = async () => {
    if (!canSubmit || !capsuleId) return;
    setIsLoading(true);
    setError("");

    const result = await createFutureMessage({
      capsuleId,
      type: selectedType!,
      content: selectedType === "NOTE" ? noteContent.trim() : undefined,
      fileUrl: fileUrl || undefined,
      unlocksAt: new Date(unlocksAt),
    });

    setIsLoading(false);

    if ("error" in result) {
      setError(result.error ?? "Error al guardar");
      return;
    }

    const params = new URLSearchParams({
      ...(capsuleId ? { capsule: capsuleId } : {}),
      type: selectedType!,
      date: unlocksAt,
    });
    router.push(`/dashboard/mensaje-futuro/success?${params.toString()}`);
  };

  return (
    <div className="flex flex-col pb-16 px-6 pt-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link
          href={backHref}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px]">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
        <div className="w-9" />
      </div>

      {/* Separador ✦ */}
      <div className="flex items-center justify-center gap-4 mb-8 text-foreground/30">
        <div className="h-px w-8 bg-current" />
        <SparkIcon className="text-base" />
        <div className="h-px w-8 bg-current" />
      </div>

      {/* Título */}
      <h1 className="font-serif text-3xl leading-tight text-foreground text-center mb-3 max-w-[280px] mx-auto">
        Un día, este mensaje llegará justo cuando más se necesite.
      </h1>
      <p className="font-sans text-[13px] text-foreground/50 text-center mb-10 leading-relaxed">
        Elige cómo quieres dejarlo y cuándo quieres que pueda abrirse.
      </p>

      {/* Sección: Qué dejar */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-3">
          ¿QUÉ QUIERES DEJAR?
        </p>
        <div className="grid grid-cols-3 gap-2">
          {CONTENT_TYPES.map(({ id, icon: Icon, label, description }) => (
            <button
              key={id}
              onClick={() => setSelectedType(id)}
              className={`flex flex-col items-center gap-2 rounded-2xl border-2 p-3 text-center transition-all duration-200 ${
                selectedType === id
                  ? "border-foreground bg-foreground/5"
                  : "border-border bg-background hover:bg-surface"
              }`}
            >
              <Icon className={`h-5 w-5 ${selectedType === id ? "text-foreground" : "text-foreground/50"}`} strokeWidth={1.5} />
              <div>
                <p className="text-[12px] font-semibold text-foreground">{label}</p>
                <p className="text-[10px] text-foreground/50 leading-snug">{description}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Área de contenido según tipo */}
        {selectedType === "NOTE" && (
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Escribe tu mensaje aquí..."
            rows={5}
            className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors resize-none"
          />
        )}

        {(selectedType === "AUDIO" || selectedType === "VIDEO") && (
          <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/30 p-6 text-center">
            <p className="text-[13px] text-foreground/40 italic mb-2">
              {selectedType === "AUDIO" ? "Adjunta tu nota de audio" : "Adjunta tu vídeo"}
            </p>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="URL del archivo (sube a R2 y pega el enlace)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-[13px] text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground/40 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Sección: Cuándo */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-3">
          ¿CUÁNDO QUIERES QUE LO RECIBA?
        </p>
        <div className="rounded-2xl border-2 border-border bg-background overflow-hidden">
          <label className="flex items-center gap-3 px-4 py-3 cursor-pointer">
            <Calendar className="h-5 w-5 text-foreground/40 shrink-0" />
            <div className="flex-1">
              <p className="text-[14px] font-medium">Elegir fecha</p>
              {unlocksAt && (
                <p className="text-[12px] text-foreground/50">
                  {new Date(unlocksAt + "T12:00:00").toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            <ChevronRight className="h-4 w-4 text-foreground/30" />
            <input
              type="date"
              min={today}
              value={unlocksAt}
              onChange={(e) => setUnlocksAt(e.target.value)}
              className="absolute opacity-0 w-0 h-0"
            />
          </label>
        </div>
        <div className="mt-3 flex items-start gap-3 px-1">
          <Lock className="h-4 w-4 text-foreground/30 shrink-0 mt-0.5" />
          <p className="text-[11px] text-foreground/40 leading-relaxed">
            Este mensaje permanecerá privado y solo se abrirá en la fecha elegida.
          </p>
        </div>
      </div>

      {/* Frase motivacional */}
      <div className="text-center mb-8">
        <p className="font-sans text-[12px] text-foreground/40 italic">
          ✦ Lo que hoy guardas, algún día significará todo para alguien. ✦
        </p>
      </div>

      {error && (
        <p className="text-red-500 text-[13px] text-center mb-4">{error}</p>
      )}

      {/* Botón continuar */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit || isLoading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span>{isLoading ? "GUARDANDO..." : "CONTINUAR"}</span>
      </button>
    </div>
  );
}
