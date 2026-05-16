"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Mic, FileText, Image as ImageIcon } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { SparkIcon } from "@/components/nuclea/SparkIcon";

interface Memory {
  id: string;
  type: "PHOTO" | "VIDEO" | "AUDIO" | "NOTE" | "DRAWING";
  fileUrl?: string | null;
  content?: string | null;
  createdAt: Date | string;
  isFavorite?: boolean;
}

type FilterType = "TODOS" | "PHOTO" | "VIDEO" | "AUDIO" | "NOTE" | "DRAWING";

const TYPE_LABELS: Record<string, string> = {
  PHOTO: "Foto",
  VIDEO: "Vídeo",
  AUDIO: "Audio",
  NOTE: "Nota",
  DRAWING: "Dibujo",
};

const FILTERS: { id: FilterType; label: string }[] = [
  { id: "TODOS", label: "Todos" },
  { id: "PHOTO", label: "Fotos" },
  { id: "VIDEO", label: "Vídeos" },
  { id: "AUDIO", label: "Audios" },
  { id: "NOTE", label: "Notas" },
  { id: "DRAWING", label: "Dibujos" },
];

const formatDate = (date: Date | string) => {
  return new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

function MemoryCard({ memory }: { memory: Memory }) {
  return (
    <div className="flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-surface">
        {(memory.type === "PHOTO" || memory.type === "DRAWING") &&
          (memory.fileUrl ? (
            <Image
              src={memory.fileUrl}
              alt="Recuerdo"
              fill
              className="object-cover"
              sizes="(max-width: 430px) 50vw, 200px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageIcon className="h-8 w-8 text-foreground/20" />
            </div>
          ))}

        {memory.type === "VIDEO" &&
          (memory.fileUrl ? (
            <>
              <video src={memory.fileUrl} className="w-full h-full object-cover" />
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-8 w-8 text-white fill-white" />
              </div>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Play className="h-8 w-8 text-foreground/20" />
            </div>
          ))}

        {memory.type === "AUDIO" && (
          <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
            <div className="flex gap-[3px] items-center h-8">
              <div className="w-[3px] h-3 bg-foreground/20 rounded-full" />
              <div className="w-[3px] h-7 bg-foreground/40 rounded-full" />
              <div className="w-[3px] h-4 bg-foreground/30 rounded-full" />
              <div className="w-[3px] h-8 bg-foreground/50 rounded-full" />
              <div className="w-[3px] h-5 bg-foreground/35 rounded-full" />
              <div className="w-[3px] h-3 bg-foreground/20 rounded-full" />
              <div className="w-[3px] h-6 bg-foreground/40 rounded-full" />
            </div>
            <Mic className="h-5 w-5 text-foreground/40" />
          </div>
        )}

        {memory.type === "NOTE" && (
          <div className="flex flex-col h-full p-4 gap-2">
            <FileText className="h-4 w-4 text-foreground/30 shrink-0" />
            <p className="text-[11px] text-foreground/60 line-clamp-6 leading-tight">
              {memory.content || "Sin contenido"}
            </p>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="px-1 pt-2 pb-1 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[9px] font-bold tracking-widest uppercase text-foreground/40">
            {TYPE_LABELS[memory.type] || memory.type} ✦
          </p>
          <p className="text-[11px] text-foreground/50 mt-0.5 truncate">
            {formatDate(memory.createdAt)}
          </p>
        </div>
        <FavoriteButton
          memoryId={memory.id}
          initialIsFavorite={memory.isFavorite ?? false}
        />
      </div>
    </div>
  );
}

interface MomentosClaveClientProps {
  memories: Memory[];
}

export function MomentosClaveClient({ memories }: MomentosClaveClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("TODOS");

  // Solo mostrar filtros que tienen contenido
  const availableTypes = new Set(memories.map((m) => m.type));
  const visibleFilters = FILTERS.filter(
    (f) => f.id === "TODOS" || availableTypes.has(f.id as Memory["type"])
  );

  const filtered =
    activeFilter === "TODOS"
      ? memories
      : memories.filter((m) => m.type === activeFilter);

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 rounded-3xl border border-dashed border-border bg-surface/30 text-center">
        <SparkIcon className="text-2xl opacity-20" />
        <p className="text-[13px] text-foreground/40 italic max-w-[220px]">
          Aún no has marcado ningún recuerdo como favorito.
        </p>
        <p className="text-[11px] text-foreground/30">
          Dale al ❤ en cualquier recuerdo para guardarlo aquí.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filter chips */}
      {visibleFilters.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar mb-6 -mx-1 px-1">
          {visibleFilters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`shrink-0 flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium transition-all ${
                activeFilter === f.id
                  ? "bg-foreground text-background"
                  : "bg-surface border border-border text-foreground/60 hover:text-foreground"
              }`}
            >
              {f.id === "TODOS" && <SparkIcon className="text-[10px]" />}
              {f.label}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <SparkIcon className="text-xl opacity-20" />
          <p className="text-[13px] text-foreground/40 italic">
            No hay favoritos de este tipo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 min-[340px]:grid-cols-2 min-[728px]:grid-cols-3 gap-3">
          {filtered.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>
      )}
    </>
  );
}
