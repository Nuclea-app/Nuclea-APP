"use client";

import { SparkIcon } from "@/components/nuclea/SparkIcon";
import {
  Bell,
  Heart,
  Pencil,
  BookOpen,
  Send,
  Clock,
  Loader2,
  Mail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ActionGrid } from "./ActionGrid";
import { MemoryCalendar, FutureMessageMarker } from "./MemoryCalendar";
import { Memory, MemoryGrid } from "./MemoryGrid";
import { useUploadCover } from "@/lib/hooks/useUploadCover";
import { useRef, useState } from "react";
import {
  updateCapsuleName,
  updateCapsuleDescription,
} from "@/lib/actions/capsuleActions";
import ArrowBackButton from "../arrow-back-button";

const DEFAULT_DESCRIPTION =
  "Elegimos seguir escribiendo nuestra historia, cada día, juntos.";

interface CapsuleProfileProps {
  capsule: {
    id: string;
    name: string;
    type: string;
    coverUrl?: string | null;
    description?: string | null;
    _count: { memories: number };
    favoritesCount?: number;
    memories: Memory[];
    futureMessages?: FutureMessageMarker[];
  };
}

export const CapsuleProfile = ({ capsule }: CapsuleProfileProps) => {
  const { uploadCover, isUploading } = useUploadCover(capsule.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [coverUrl, setCoverUrl] = useState(capsule.coverUrl);
  const [capsuleName, setCapsuleName] = useState(capsule.name);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(capsule.name);

  const initialDescription = capsule.description || DEFAULT_DESCRIPTION;
  const [description, setDescription] = useState(initialDescription);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [tempDescription, setTempDescription] = useState(initialDescription);

  const futureMessages = capsule.futureMessages ?? [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const result = await uploadCover(file);
        if (result.success) {
          setCoverUrl(result.url);
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
      setTempName(capsuleName);
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

  const handleDescriptionSave = async () => {
    const trimmed = tempDescription.trim();
    if (!trimmed || trimmed === description) {
      setTempDescription(description);
      setIsEditingDescription(false);
      return;
    }

    const result = await updateCapsuleDescription(capsule.id, trimmed);
    if (result.success) {
      setDescription(trimmed);
      setIsEditingDescription(false);
    } else {
      setTempDescription(description);
      setIsEditingDescription(false);
      alert(result.error);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleDescriptionSave();
    }
    if (e.key === "Escape") {
      setTempDescription(description);
      setIsEditingDescription(false);
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
        <ArrowBackButton />
        <Link href="/" className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px] hover:opacity-70 transition-opacity">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </Link>
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
            <Image
              src={coverUrl}
              alt={capsuleName}
              fill
              className="object-cover"
            />
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

      {/* Name */}
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
          <div
            className="flex items-center justify-center gap-2 cursor-pointer"
            onClick={() => setIsEditingName(true)}
          >
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              {capsuleName}
            </h1>
            <Pencil className="h-4 w-4 text-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <div className="flex gap-2 items-center justify-center w-full mb-4">
        <div className="w-[35%] h-px bg-gray-300" />
        <Heart className="h-4 w-4 text-foreground/20" />
        <div className="w-[35%] h-px bg-gray-300" />
      </div>

      {/* Description (editable) */}
      <div className="group relative mb-4 w-full max-w-[300px]">
        {isEditingDescription ? (
          <textarea
            autoFocus
            value={tempDescription}
            onChange={(e) => setTempDescription(e.target.value)}
            onBlur={handleDescriptionSave}
            onKeyDown={handleDescriptionKeyDown}
            rows={3}
            maxLength={200}
            className="w-full resize-none font-sans italic text-[15px] text-foreground/70 text-center leading-relaxed bg-transparent border-none outline-none focus:ring-0"
          />
        ) : (
          <div
            className="flex items-start justify-center gap-1.5 cursor-pointer"
            onClick={() => setIsEditingDescription(true)}
          >
            <p className="font-sans italic text-[15px] text-foreground/60 text-center leading-relaxed">
              {description}
            </p>
            <Pencil className="h-3.5 w-3.5 shrink-0 mt-1 text-foreground/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>

      <Heart className="h-4 w-4 text-foreground/20 mb-10" />

      {/* Actions */}
      <div className="w-full mb-6">
        <ActionGrid capsuleId={capsule.id} />
      </div>

      {/* Stats */}
      <div className="w-full rounded-3xl p-6 mb-6 border-border border bg-background shadow-sm">
        <div className="flex w-full items-center justify-between mb-4">
          <div className="flex flex-col items-center gap-1 flex-1 border-r border-border">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen
                className="h-5 w-5 text-foreground/40"
                strokeWidth={1.5}
              />
              <span className="text-xl font-serif">
                {capsule._count.memories}
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">
              Recuerdos
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Heart className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
              <span className="text-xl font-serif">
                {capsule.favoritesCount || 0}
              </span>
            </div>
            <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40">
              Momentos clave
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 my-1">
          <div className="h-px flex-1 bg-border" />
          <SparkIcon className="text-[12px] opacity-30" />
          <div className="h-px flex-1 bg-border" />
        </div>
        <Link
          href={`/dashboard/mensajes-futuros?capsule=${capsule.id}`}
          className="group flex flex-col items-center gap-1 mt-4"
        >
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-5 w-5 text-foreground/40" strokeWidth={1.5} />
            <span className="text-xl font-serif">{futureMessages.length}</span>
          </div>
          <span className="text-[10px] font-medium tracking-wide uppercase text-foreground/40 group-hover:text-foreground/70 transition-colors">
            Mensajes futuros
          </span>
        </Link>
      </div>

      {/* Calendar */}
      <div className="w-full mb-6">
        <MemoryCalendar
          memories={capsule.memories}
          futureMessages={futureMessages}
          capsuleId={capsule.id}
        />
      </div>

      {/* Memories */}
      <div className="w-full mb-8">
        <MemoryGrid memories={capsule.memories} capsuleId={capsule.id} />
      </div>

      {/* Bottom Actions */}
      <div className="w-full flex flex-col gap-3 mb-8">
        <Link
          href={`/dashboard/entregar?capsule=${capsule.id}`}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:opacity-90"
        >
          <Send className="h-4 w-4" />
          <span>ENTREGAR CÁPSULA</span>
        </Link>
        <Link
          href={`/dashboard/mensaje-futuro?capsule=${capsule.id}`}
          className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-foreground text-foreground py-4 text-[12px] font-semibold tracking-wider transition-all active:scale-[0.98] hover:bg-surface"
        >
          <Clock className="h-4 w-4" />
          <span>MENSAJE FUTURO</span>
        </Link>
      </div>
    </div>
  );
};
