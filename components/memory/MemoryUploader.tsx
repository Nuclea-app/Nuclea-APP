"use client";

import { useState, useRef, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import { useUpload } from "@/lib/hooks/useUpload";
import { MemoryType } from "@prisma/client";
import {
  Image as ImageIcon,
  Video,
  Mic,
  FileText,
  Pencil,
  X,
  CheckCircle2,
  Loader2,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Square,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MemoryUploaderProps {
  capsuleId: string;
  type: MemoryType | null;
  isOpen: boolean;
  onClose: () => void;
}

type AudioMode = "choose" | "record" | "upload";

export const MemoryUploader = ({
  capsuleId,
  type,
  isOpen,
  onClose,
}: MemoryUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Audio recorder state
  const [audioMode, setAudioMode] = useState<AudioMode>("choose");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mimeTypeRef = useRef<string>("");

  const { uploadFile, saveNote, isUploading, progress, error } = useUpload(capsuleId);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setNoteContent("");
    setSuccess(false);
    setAudioMode("choose");
    setIsRecording(false);
    setRecordingSeconds(0);
    setAudioUrl(null);
    setIsPlaying(false);
    stopRecording();
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (type === MemoryType.PHOTO || type === MemoryType.DRAWING) {
        setPreview(URL.createObjectURL(selectedFile));
      }
      if (type === MemoryType.AUDIO) {
        setAudioUrl(URL.createObjectURL(selectedFile));
      }
    }
  };

  // ─── Recorder ────────────────────────────────────────────────────────────
  const getSupportedMimeType = () => {
    const types = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"];
    return types.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
  };

  const getAudioExtension = (mimeType: string) => {
    if (mimeType.includes("mp4")) return "m4a";
    if (mimeType.includes("ogg")) return "ogg";
    return "webm";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      mimeTypeRef.current = mimeType;
      const mr = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      mr.onstop = () => {
        const actualMime = mimeTypeRef.current || "audio/webm";
        const ext = getAudioExtension(actualMime);
        const blob = new Blob(chunksRef.current, { type: actualMime });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        const f = new File([blob], `grabacion-${Date.now()}.${ext}`, { type: actualMime });
        setFile(f);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      alert("No se pudo acceder al micrófono.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  // ─── Upload ───────────────────────────────────────────────────────────────
  const handleUpload = async () => {
    try {
      if (type === MemoryType.NOTE) {
        await saveNote(noteContent);
      } else if (file && type) {
        await uploadFile(file, type);
      }
      setSuccess(true);
      setTimeout(() => {
        onClose();
        reset();
        router.refresh();
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!type) return null;

  const isAudio = type === MemoryType.AUDIO;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-[430px] mx-auto rounded-t-[32px] px-6 pb-12">
        <DrawerHeader className="px-0 pt-8">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-serif text-2xl">
              {type === MemoryType.PHOTO && "Subir foto"}
              {type === MemoryType.VIDEO && "Subir vídeo"}
              {type === MemoryType.AUDIO && "Añadir audio"}
              {type === MemoryType.NOTE && "Escribir nota"}
              {type === MemoryType.DRAWING && "Subir dibujo"}
            </DrawerTitle>
            <DrawerClose onClick={onClose} className="p-2 rounded-full hover:bg-surface">
              <X className="h-6 w-6 opacity-40" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="space-y-6 py-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-300" />
              <p className="font-serif text-xl tracking-wide">✦ Recuerdo guardado</p>
            </div>
          ) : (
            <>
              {/* NOTE */}
              {type === MemoryType.NOTE && (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Escribe lo que sientes..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    maxLength={1000}
                    className="min-h-[200px] rounded-2xl bg-surface/30 border-border p-4 text-[15px] focus:ring-0 focus:border-foreground"
                  />
                  <div className="flex justify-end">
                    <span className="text-[12px] text-foreground/40">{noteContent.length}/1000</span>
                  </div>
                </div>
              )}

              {/* AUDIO — modo elección */}
              {isAudio && audioMode === "choose" && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setAudioMode("record")}
                    className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-foreground/20 bg-surface py-10 transition-all hover:bg-surface/60 active:scale-[0.99]"
                  >
                    <div className="h-12 w-12 rounded-full bg-background shadow-sm flex items-center justify-center">
                      <Mic className="h-5 w-5 text-foreground/50" />
                    </div>
                    <span className="text-[13px] font-semibold text-foreground/70">Grabar audio</span>
                  </button>
                  <button
                    onClick={() => { setAudioMode("upload"); fileInputRef.current?.click(); }}
                    className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-foreground/20 bg-surface py-10 transition-all hover:bg-surface/60 active:scale-[0.99]"
                  >
                    <div className="h-12 w-12 rounded-full bg-background shadow-sm flex items-center justify-center">
                      <Upload className="h-5 w-5 text-foreground/50" />
                    </div>
                    <span className="text-[13px] font-semibold text-foreground/70">Subir archivo</span>
                  </button>
                </div>
              )}

              {/* AUDIO — grabando */}
              {isAudio && audioMode === "record" && !audioUrl && (
                <div className="flex flex-col items-center gap-6 py-6">
                  <div className={`h-24 w-24 rounded-full flex items-center justify-center shadow-lg transition-all ${isRecording ? "bg-red-500 animate-pulse" : "bg-foreground"}`}>
                    <Mic className="h-10 w-10 text-white" />
                  </div>
                  {isRecording && (
                    <p className="font-mono text-2xl text-foreground tabular-nums">{formatTime(recordingSeconds)}</p>
                  )}
                  <div className="flex gap-3">
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        className="flex items-center gap-2 rounded-2xl bg-foreground text-background px-6 py-3 text-[13px] font-semibold"
                      >
                        <Mic className="h-4 w-4" />
                        Iniciar grabación
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        className="flex items-center gap-2 rounded-2xl bg-red-500 text-white px-6 py-3 text-[13px] font-semibold"
                      >
                        <Square className="h-4 w-4" fill="white" />
                        Detener
                      </button>
                    )}
                    <button onClick={() => { setAudioMode("choose"); setRecordingSeconds(0); }} className="rounded-2xl border border-border px-4 py-3 text-[13px] text-foreground/50">
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {/* AUDIO — preview listo (grabado o subido) */}
              {isAudio && audioUrl && (
                <div className="space-y-4">
                  { }
                  <audio
                    ref={audioRef}
                    src={audioUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                  <div className="flex items-center gap-4 rounded-2xl border border-border bg-surface px-4 py-4">
                    <button
                      onClick={togglePlay}
                      className="h-12 w-12 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center shadow-sm"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" fill="currentColor" /> : <Play className="h-5 w-5" fill="currentColor" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-foreground truncate">
                        {file?.name ?? "Grabación de audio"}
                      </p>
                      <p className="text-[11px] text-foreground/40 mt-0.5">
                        {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : formatTime(recordingSeconds)}
                      </p>
                    </div>
                    <button
                      onClick={() => { setAudioUrl(null); setFile(null); setAudioMode("choose"); setIsPlaying(false); }}
                      className="shrink-0 p-2 hover:opacity-60 transition-opacity"
                    >
                      <RotateCcw className="h-4 w-4 text-foreground/40" />
                    </button>
                  </div>
                </div>
              )}

              {/* PHOTO / VIDEO */}
              {!isAudio && type !== MemoryType.NOTE && (
                <div className="space-y-6">
                  {!file ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center py-12 gap-4 rounded-3xl border-2 border-dashed border-foreground/20 bg-surface hover:bg-surface/60 active:scale-[0.99] transition-all"
                    >
                      <div className="h-14 w-14 rounded-full bg-background shadow-sm flex items-center justify-center">
                        {type === MemoryType.PHOTO && <ImageIcon className="h-6 w-6 text-foreground/50" />}
                        {type === MemoryType.VIDEO && <Video className="h-6 w-6 text-foreground/50" />}
                        {type === MemoryType.DRAWING && <Pencil className="h-6 w-6 text-foreground/50" />}
                      </div>
                      <div className="text-center">
                        <p className="text-[14px] font-semibold text-foreground/80">Toca para seleccionar</p>
                        <p className="text-[12px] text-foreground/40 mt-1">
                          {type === MemoryType.PHOTO && "JPG, PNG, HEIC"}
                          {type === MemoryType.VIDEO && "MP4, MOV — Máximo 100MB"}
                          {type === MemoryType.DRAWING && "JPG, PNG, HEIC"}
                        </p>
                      </div>
                    </button>
                  ) : (
                    <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-surface group">
                      {preview ? (
                        <Image src={preview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full gap-2">
                          <FileText className="h-10 w-10 opacity-20" />
                          <p className="text-[12px] text-foreground/60 px-4 text-center truncate w-full">
                            {file.name}
                          </p>
                        </div>
                      )}
                      <button
                        onClick={() => setFile(null)}
                        className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-all"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={
                  type === MemoryType.PHOTO || type === MemoryType.DRAWING
                    ? "image/*"
                    : type === MemoryType.VIDEO
                    ? "video/*"
                    : "audio/*"
                }
                className="hidden"
              />

              {error && (
                <div className="p-4 rounded-2xl bg-destructive/10 text-destructive text-[13px] text-center">
                  {error}
                </div>
              )}

              {isUploading && type !== MemoryType.NOTE && (
                <div className="space-y-3">
                  <div className="flex justify-between text-[12px] text-foreground/60">
                    <span>Subiendo...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>
              )}

              <PrimaryButton
                onClick={handleUpload}
                disabled={
                  isUploading ||
                  (isAudio && !file) ||
                  (!isAudio && !file && type !== MemoryType.NOTE) ||
                  (type === MemoryType.NOTE && !noteContent)
                }
              >
                {isUploading ? (
                  <div className="flex items-center gap-2 mx-auto">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Subiendo...</span>
                  </div>
                ) : type === MemoryType.NOTE ? (
                  "Guardar nota"
                ) : type === MemoryType.PHOTO ? (
                  "Subir foto"
                ) : type === MemoryType.VIDEO ? (
                  "Subir vídeo"
                ) : type === MemoryType.DRAWING ? (
                  "Subir dibujo"
                ) : (
                  "Guardar audio"
                )}
              </PrimaryButton>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
