"use client";

import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { Bell, Heart, Pencil, BookOpen, Send, Share2, Loader2 } from "lucide-react";
import Image from "next/image";
import { ActionGrid } from "./ActionGrid";
import { MemoryCalendar } from "./MemoryCalendar";
import { Memory, MemoryGrid } from "./MemoryGrid";
import { useUploadCover } from "@/lib/hooks/useUploadCover";
import { useRef, useState } from "react";
import { updateCapsuleName } from "@/lib/actions/capsuleActions";

interface CapsuleProfileProps {
  capsule: {
    id: string;
    name: string;
    type: string;
    coverUrl?: string | null;
    _count: { memories: number };
    favoritesCount?: number;
    memories: Memory[];
  };
}

export const CapsuleProfile = ({ capsule }: CapsuleProfileProps) => {
  const { uploadCover, isUploading } = useUploadCover(capsule.id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // States for immediate feedback (Fix 3 & 5)
  const [coverUrl, setCoverUrl] = useState(capsule.coverUrl);
  const [capsuleName, setCapsuleName] = useState(capsule.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(capsule.name);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadCover(file);
        if (result.success) {
          setCoverUrl(result.url); // Update local state immediately (Fix 3)
        }
      } catch (err) {
        console.error("Cover upload failed:", err);
      }
    }
  };

  const handleNameSave = async () => {
    if (tempName === capsuleName) {
      setIsEditingName(false);
      return;
    }

    const result = await updateCapsuleName(capsule.id, tempName);
    if (result.success) {
      setCapsuleName(tempName);
      setIsEditingName(false);
    } else {
      setTempName(capsuleName); // Revert on error
      setIsEditingName(false);
      alert(result.error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleNameSave();
    if (e.key === "Escape") {
      setTempName(capsuleName);
      setIsEditingName(false);
    }
  };

  return (
    <div className="flex flex-col items-center pt-8 pb-12 px-6">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*" 
        onChange={handleFileChange}
      />
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8">
        <div className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px]">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
        <div className="relative">
          <Bell className="h-6 w-6 text-foreground/40" />
          <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-background" />
        </div>
      </div>

      {/* Badge */}
      <div className="mb-8">
        <span className="rounded-full border border-foreground/10 px-6 py-1 text-[10px] font-bold tracking-[0.3em] uppercase bg-surface/50">
          {capsule.type} ✦
        </span>
      </div>

      {/* Profile Image */}
      <div className="relative mb-6">
        <div className="h-[120px] w-[120px] rounded-full bg-surface overflow-hidden border-4 border-background shadow-sm relative">
          {isUploading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
              <Loader2 className="h-8 w-8 text-white animate-spin" />
            </div>
          )}
          {coverUrl ? (
            <Image src={coverUrl} alt={capsuleName} fill className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-serif text-foreground/20 uppercase">
              {capsuleName.charAt(0)}
            </div>
          )}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center border-2 border-background hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
        >
          <Pencil className="h-4 w-4" />
        </button>
      </div>

      {/* Name (Fix 5) */}
      <div className="group relative mb-4">
        {isEditingName ? (
          <input
            autoFocus
            type="text"
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleKeyDown}
            className="font-serif text-3xl font-semibold text-foreground text-center bg-transparent border-none outline-none focus:ring-0 w-full max-w-[320px]"
          />
        ) : (
          <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => setIsEditingName(true)}>
            <h1 className="font-serif text-3xl font-semibold text-foreground">{capsuleName}</h1>
            <Pencil className="h-4 w-4 text-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <Heart className="h-4 w-4 text-foreground/20 mb-4" />

      {/* Description */}
      <p className="font-sans italic text-[15px] text-foreground/60 text-center leading-relaxed max-w-[280px] mb-4">
        Elegimos seguir escribiendo nuestra historia, cada día, juntos.
      </p>

      <Heart className="h-4 w-4 text-foreground/20 mb-10" />

      {/* Actions */}
      <div className="w-full mb-12">
        <ActionGrid capsuleId={capsule.id} />
      </div>

      {/* Stats (Fix 2) */}
      <div className="w-full border border-border rounded-3xl p-6 mb-12 bg-surface/30">
        <div className="flex w-full items-center justify-between mb-4">
          <div className="flex flex-col items-center gap-1 flex-1 border-r border-border">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
              <span className="text-xl font-serif">{capsule._count.memories}</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">Recuerdos</span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
              <span className="text-xl font-serif">{capsule.favoritesCount || 0}</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">Momentos clave</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-3 mt-4">
          <SparkIcon className="text-[12px] opacity-20" />
          <p className="text-center text-[11px] text-foreground/40 font-sans italic">
            Contigo, cada momento tiene sentido.
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="w-full mb-12">
        <MemoryCalendar 
          memories={capsule.memories} 
        />
      </div>

      {/* Memories */}
      <div className="w-full mb-12">
        <MemoryGrid memories={capsule.memories} />
      </div>

      {/* Final Actions (Fix 1) */}
      <div className="w-full flex gap-3 mb-8">
        <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:opacity-90">
          <Send className="h-4 w-4" />
          <span>Entregar cápsula</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:opacity-90">
          <Share2 className="h-4 w-4" />
          <span>Compartir con</span>
        </button>
      </div>
    </div>
  );
};
