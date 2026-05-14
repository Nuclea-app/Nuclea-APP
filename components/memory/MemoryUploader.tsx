"use client";

import { useState, useRef } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose
} from "@/components/ui/drawer";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import { useUpload } from "@/lib/hooks/useUpload";
import { MemoryType } from "@prisma/client";
import { Image as ImageIcon, Video, Mic, FileText, X, CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface MemoryUploaderProps {
  capsuleId: string;
  type: MemoryType | null;
  isOpen: boolean;
  onClose: () => void;
}

export const MemoryUploader = ({ capsuleId, type, isOpen, onClose }: MemoryUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  const { uploadFile, saveNote, isUploading, progress, error } = useUpload(capsuleId);

  const reset = () => {
    setFile(null);
    setPreview(null);
    setNoteContent("");
    setSuccess(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (type === MemoryType.PHOTO) {
        setPreview(URL.createObjectURL(selectedFile));
      }
    }
  };

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

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-[430px] mx-auto rounded-t-[32px] px-6 pb-12">
        <DrawerHeader className="px-0 pt-8">
          <div className="flex items-center justify-between">
            <DrawerTitle className="font-serif text-2xl">
              {type === MemoryType.PHOTO && "Subir foto"}
              {type === MemoryType.VIDEO && "Subir vídeo"}
              {type === MemoryType.AUDIO && "Subir audio"}
              {type === MemoryType.NOTE && "Escribir nota"}
            </DrawerTitle>
            <DrawerClose onClick={onClose} className="p-2 rounded-full hover:bg-surface">
              <X className="h-6 w-6 opacity-40" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="space-y-8 py-4">
          {success ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-in zoom-in duration-300" />
              <p className="font-serif text-xl tracking-wide">✦ Recuerdo guardado</p>
            </div>
          ) : (
            <>
              {type === MemoryType.NOTE ? (
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
              ) : (
                <div className="space-y-6">
                  {!file ? (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex flex-col items-center justify-center py-12 gap-4 rounded-3xl border-2 border-dashed border-foreground/20 bg-surface hover:bg-surface/60 active:scale-[0.99] transition-all"
                    >
                      <div className="h-14 w-14 rounded-full bg-background shadow-sm flex items-center justify-center">
                        {type === MemoryType.PHOTO && <ImageIcon className="h-6 w-6 text-foreground/50" />}
                        {type === MemoryType.VIDEO && <Video className="h-6 w-6 text-foreground/50" />}
                        {type === MemoryType.AUDIO && <Mic className="h-6 w-6 text-foreground/50" />}
                      </div>
                      <div className="text-center">
                        <p className="text-[14px] font-semibold text-foreground/80">
                          Toca para seleccionar
                        </p>
                        <p className="text-[12px] text-foreground/40 mt-1">
                          {type === MemoryType.PHOTO && "JPG, PNG, HEIC"}
                          {type === MemoryType.VIDEO && "MP4, MOV — Máximo 100MB"}
                          {type === MemoryType.AUDIO && "MP3, M4A, WAV"}
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
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={
                      type === MemoryType.PHOTO ? "image/*" :
                      type === MemoryType.VIDEO ? "video/*" :
                      "audio/*"
                    }
                    className="hidden"
                  />
                </div>
              )}

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
                disabled={isUploading || (!file && type !== MemoryType.NOTE) || (type === MemoryType.NOTE && !noteContent)}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2 mx-auto">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Subiendo...</span>
                  </div>
                ) : (
                  type === MemoryType.NOTE ? "Guardar nota" : 
                  type === MemoryType.PHOTO ? "Subir foto" :
                  type === MemoryType.VIDEO ? "Subir video" :
                  "Subir audio"
                )}
              </PrimaryButton>
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
