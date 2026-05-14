"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Mic, Video, FileText, Calendar, Lock, ChevronRight, X } from "lucide-react";
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
  const [file, setFile] = useState<File | null>(null);
  const [unlocksAt, setUnlocksAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date().toISOString().split("T")[0];

  const canSubmit =
    selectedType !== null &&
    unlocksAt.length > 0 &&
    (selectedType === "NOTE"
      ? noteContent.trim().length > 0
      : file !== null);

  const uploadToR2 = async (f: File, tipo: MemoryType): Promise<string> => {
    const res = await fetch("/api/upload/presigned", {
      method: "POST",
      body: JSON.stringify({
        capsuleId,
        tipo: tipo.toUpperCase(),
        filename: f.name,
        contentType: f.type,
      }),
    });
    const { uploadUrl, key, error: apiError } = await res.json();
    if (apiError) throw new Error(apiError);

    await new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", uploadUrl);
      xhr.setRequestHeader("Content-Type", f.type);
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => (xhr.status === 200 ? resolve() : reject(new Error("Upload failed")));
      xhr.onerror = () => reject(new Error("Error de red"));
      xhr.send(f);
    });

    return `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
  };

  const handleSubmit = async () => {
    if (!canSubmit || !capsuleId) return;
    setIsLoading(true);
    setError("");

    let fileUrl: string | undefined;

    if ((selectedType === "AUDIO" || selectedType === "VIDEO") && file) {
      try {
        fileUrl = await uploadToR2(file, selectedType);
      } catch {
        setError("Error al subir el archivo. Intentá de nuevo.");
        setIsLoading(false);
        return;
      }
    }

    const result = await createFutureMessage({
      capsuleId,
      type: selectedType!,
      content: selectedType === "NOTE" ? noteContent.trim() : undefined,
      fileUrl,
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
          className="flex items-center justify-center hover:opacity-60 transition-opacity"
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
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-3">
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
          <div className="mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept={selectedType === "AUDIO" ? "audio/*" : "video/*"}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setUploadProgress(0);
              }}
            />
            {!file ? (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center py-12 gap-4 rounded-3xl border-2 border-dashed border-foreground/20 bg-surface hover:bg-surface/60 transition-all"
              >
                <div className="h-14 w-14 rounded-full bg-background shadow-sm flex items-center justify-center">
                  {selectedType === "AUDIO" ? <Mic className="h-6 w-6 text-foreground/50" /> : <Video className="h-6 w-6 text-foreground/50" />}
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-foreground/80">Toca para seleccionar</p>
                  <p className="text-[12px] text-foreground/40 mt-1">
                    {selectedType === "AUDIO" ? "MP3, M4A, WAV" : "MP4, MOV — Máx. 100MB"}
                  </p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm">
                  {selectedType === "AUDIO" ? <Mic className="h-5 w-5 text-foreground/50" /> : <Video className="h-5 w-5 text-foreground/50" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-[11px] text-foreground/40">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="shrink-0 p-1 hover:opacity-60 transition-opacity">
                  <X className="h-4 w-4 text-foreground/40" />
                </button>
              </div>
            )}
            {isLoading && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[11px] text-foreground/40">
                  <span>Subiendo...</span><span>{uploadProgress}%</span>
                </div>
                <div className="h-1 w-full rounded-full bg-surface overflow-hidden">
                  <div className="h-full bg-foreground transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sección: Cuándo */}
      <div className="mb-8">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground mb-3">
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
