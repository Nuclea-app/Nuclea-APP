"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mic,
  Video,
  FileText,
  Calendar as CalendarIcon,
  Lock,
  ChevronRight,
  X,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Square,
} from "lucide-react";
import Link from "next/link";
import ArrowBackButton from "@/components/arrow-back-button";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { es } from "date-fns/locale";
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

  const [selectedType, setSelectedType] = useState<MemoryType | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [unlocksAt, setUnlocksAt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio recorder
  type AudioMode = "choose" | "record" | "upload";
  const [audioMode, setAudioMode] = useState<AudioMode>("choose");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setFile(new File([blob], `grabacion-${Date.now()}.webm`, { type: "audio/webm" }));
        stream.getTracks().forEach((t) => t.stop());
      };
      mr.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch { alert("No se pudo acceder al micrófono."); }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    setIsRecording(false);
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };

  const resetAudio = () => {
    setAudioUrl(null); setFile(null); setAudioMode("choose"); setIsPlaying(false); setRecordingSeconds(0);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const canSubmit =
    selectedType !== null &&
    unlocksAt.length > 0 &&
    (selectedType === "NOTE" ? noteContent.trim().length > 0 : file !== null);

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
        if (e.lengthComputable)
          setUploadProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () =>
        xhr.status === 200 ? resolve() : reject(new Error("Upload failed"));
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
        <ArrowBackButton />
        <Link href="/" className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px] hover:opacity-70 transition-opacity">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </Link>
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
              <Icon
                className={`h-5 w-5 ${selectedType === id ? "text-foreground" : "text-foreground/50"}`}
                strokeWidth={1.5}
              />
              <div>
                <p className="text-[12px] font-semibold text-foreground">
                  {label}
                </p>
                <p className="text-[10px] text-foreground/50 leading-snug">
                  {description}
                </p>
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

        {selectedType === "VIDEO" && (
          <div className="mt-4">
            <input ref={fileInputRef} type="file" accept="video/*" className="hidden"
              onChange={(e) => { setFile(e.target.files?.[0] ?? null); setUploadProgress(0); }} />
            {!file ? (
              <button onClick={() => fileInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center py-12 gap-4 rounded-3xl border-2 border-dashed border-foreground/20 bg-surface hover:bg-surface/60 transition-all">
                <div className="h-14 w-14 rounded-full bg-background shadow-sm flex items-center justify-center">
                  <Video className="h-6 w-6 text-foreground/50" />
                </div>
                <div className="text-center">
                  <p className="text-[14px] font-semibold text-foreground/80">Toca para seleccionar</p>
                  <p className="text-[12px] text-foreground/40 mt-1">MP4, MOV — Máx. 100MB</p>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm">
                  <Video className="h-5 w-5 text-foreground/50" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-[11px] text-foreground/40">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={() => setFile(null)} className="shrink-0 p-1 hover:opacity-60">
                  <X className="h-4 w-4 text-foreground/40" />
                </button>
              </div>
            )}
          </div>
        )}

        {selectedType === "AUDIO" && (
          <div className="mt-4 space-y-3">
            <input ref={fileInputRef} type="file" accept="audio/*" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0] ?? null;
                setFile(f);
                setAudioUrl(f ? URL.createObjectURL(f) : null);
                setUploadProgress(0);
              }} />

            {/* Elegir modo */}
            {audioMode === "choose" && !audioUrl && (
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setAudioMode("record")}
                  className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-foreground/20 bg-surface py-8 transition-all hover:bg-surface/60">
                  <div className="h-12 w-12 rounded-full bg-background shadow-sm flex items-center justify-center">
                    <Mic className="h-5 w-5 text-foreground/50" />
                  </div>
                  <span className="text-[12px] font-semibold text-foreground/70">Grabar audio</span>
                </button>
                <button onClick={() => { setAudioMode("upload"); fileInputRef.current?.click(); }}
                  className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-foreground/20 bg-surface py-8 transition-all hover:bg-surface/60">
                  <div className="h-12 w-12 rounded-full bg-background shadow-sm flex items-center justify-center">
                    <Upload className="h-5 w-5 text-foreground/50" />
                  </div>
                  <span className="text-[12px] font-semibold text-foreground/70">Subir archivo</span>
                </button>
              </div>
            )}

            {/* Grabando */}
            {audioMode === "record" && !audioUrl && (
              <div className="flex flex-col items-center gap-5 py-4">
                <div className={`h-20 w-20 rounded-full flex items-center justify-center shadow-lg ${isRecording ? "bg-red-500 animate-pulse" : "bg-foreground"}`}>
                  <Mic className="h-8 w-8 text-white" />
                </div>
                {isRecording && <p className="font-mono text-xl text-foreground tabular-nums">{formatTime(recordingSeconds)}</p>}
                <div className="flex gap-3">
                  {!isRecording ? (
                    <button onClick={startRecording} className="flex items-center gap-2 rounded-2xl bg-foreground text-background px-5 py-3 text-[12px] font-semibold">
                      <Mic className="h-4 w-4" /> Iniciar
                    </button>
                  ) : (
                    <button onClick={stopRecording} className="flex items-center gap-2 rounded-2xl bg-red-500 text-white px-5 py-3 text-[12px] font-semibold">
                      <Square className="h-4 w-4" fill="white" /> Detener
                    </button>
                  )}
                  <button onClick={() => { setAudioMode("choose"); setRecordingSeconds(0); }} className="rounded-2xl border border-border px-4 py-3 text-[12px] text-foreground/50">
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Preview */}
            {audioUrl && (
              <>
                { }
                <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} className="hidden" />
                <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-4">
                  <button onClick={togglePlay} className="h-11 w-11 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center shadow-sm">
                    {isPlaying ? <Pause className="h-4 w-4" fill="currentColor" /> : <Play className="h-4 w-4" fill="currentColor" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-medium text-foreground truncate">{file?.name ?? "Grabación"}</p>
                    <p className="text-[11px] text-foreground/40">{file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : formatTime(recordingSeconds)}</p>
                  </div>
                  <button onClick={resetAudio} className="shrink-0 p-2 hover:opacity-60">
                    <RotateCcw className="h-4 w-4 text-foreground/40" />
                  </button>
                </div>
              </>
            )}

            {isLoading && uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-1">
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
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="w-full rounded-2xl border-2 border-border bg-background flex items-center gap-3 px-4 py-3"
            >
              <CalendarIcon className="h-5 w-5 text-foreground/40 shrink-0" />
              <div className="flex-1 text-left">
                <p className="text-[14px] font-medium">Elegir fecha</p>
                {unlocksAt && (
                  <p className="text-[12px] text-foreground/50">
                    {new Date(unlocksAt + "T12:00:00").toLocaleDateString(
                      "es-ES",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 text-foreground/30" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 bg-background" align="center">
            <Calendar
              mode="single"
              locale={es}
              selected={
                unlocksAt ? new Date(unlocksAt + "T12:00:00") : undefined
              }
              disabled={{ before: new Date() }}
              onSelect={(date) => {
                if (date) {
                  const y = date.getFullYear();
                  const m = String(date.getMonth() + 1).padStart(2, "0");
                  const d = String(date.getDate()).padStart(2, "0");
                  setUnlocksAt(`${y}-${m}-${d}`);
                }
              }}
            />
          </PopoverContent>
        </Popover>
        <div className="mt-3 flex items-start gap-3 px-1">
          <Lock className="h-4 w-4 text-foreground/30 shrink-0 mt-0.5" />
          <p className="text-[11px] text-foreground/40 leading-relaxed">
            Este mensaje permanecerá privado y solo se abrirá en la fecha
            elegida.
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
