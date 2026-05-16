"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Play,
  Mic,
  FileText,
  Image as ImageIcon,
  Video,
  MoreHorizontal,
  Pencil,
} from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { MemoryViewerDrawer } from "./MemoryViewerDrawer";

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

const TYPE_ICONS: Record<string, React.ReactNode> = {
  PHOTO: <ImageIcon className="h-3.5 w-3.5 text-foreground/60" />,
  VIDEO: <Video className="h-3.5 w-3.5 text-foreground/60" />,
  AUDIO: <Mic className="h-3.5 w-3.5 text-foreground/60" />,
  NOTE: <FileText className="h-3.5 w-3.5 text-foreground/60" />,
  DRAWING: <Pencil className="h-3.5 w-3.5 text-foreground/60" />,
};

const FILTERS: { id: FilterType; label: string; icon: React.ReactNode }[] = [
  { id: "TODOS", label: "Todos", icon: <SparkIcon className="text-[10px]" /> },
  { id: "PHOTO", label: "Fotos", icon: <ImageIcon className="h-3.5 w-3.5" /> },
  { id: "VIDEO", label: "Vídeos", icon: <Video className="h-3.5 w-3.5" /> },
  { id: "AUDIO", label: "Audios", icon: <Mic className="h-3.5 w-3.5" /> },
  { id: "NOTE", label: "Notas", icon: <FileText className="h-3.5 w-3.5" /> },
  { id: "DRAWING", label: "Dibujos", icon: <Pencil className="h-3.5 w-3.5" /> },
];

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

function MemoryCard({
  memory,
  onClick,
}: {
  memory: Memory;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-border/60 bg-background">
      {/* Thumbnail — clicable para abrir en grande */}
      <button
        onClick={onClick}
        className="relative aspect-square w-full bg-surface focus:outline-none"
      >
        {/* Icono tipo — arriba izquierda */}
        <div className="absolute top-2 left-2 z-10 h-7 w-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
          {TYPE_ICONS[memory.type]}
        </div>

        {/* Menú "..." — arriba derecha (placeholder) */}
        <div className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/90 shadow-sm flex items-center justify-center">
          <MoreHorizontal className="h-3.5 w-3.5 text-foreground/60" />
        </div>

        {/* Contenido del thumbnail */}
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
              <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                <div className="h-10 w-10 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
                  <Play className="h-4 w-4 text-foreground fill-foreground ml-0.5" />
                </div>
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
              {[3, 7, 4, 8, 5, 3, 6].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] bg-foreground/30 rounded-full"
                  style={{ height: `${h * 4}px` }}
                />
              ))}
            </div>
            <Mic className="h-5 w-5 text-foreground/30" />
          </div>
        )}

        {memory.type === "NOTE" && (
          <div className="flex flex-col h-full p-4 pt-10 gap-1">
            <p className="text-[11px] text-foreground/60 line-clamp-6 leading-tight text-left">
              {memory.content || "Sin contenido"}
            </p>
          </div>
        )}
      </button>

      {/* Info debajo del thumbnail */}
      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1">
        {/* Título — placeholder hasta que Andrea confirme el campo */}
        <p className="text-[13px] font-semibold text-foreground truncate leading-tight">
          {TYPE_LABELS[memory.type]}
        </p>

        {/* Descripción / ubicación — placeholder vacío */}
        <p className="text-[11px] text-foreground/40 truncate h-4">
          {/* se llenará cuando exista el campo en DB */}
        </p>

        {/* Fecha + favorito */}
        <div className="flex items-center justify-between mt-1">
          <p className="text-[11px] text-foreground/50">{formatDate(memory.createdAt)}</p>
          <FavoriteButton
            memoryId={memory.id}
            initialIsFavorite={memory.isFavorite ?? false}
          />
        </div>
      </div>
    </div>
  );
}

interface MomentosClaveClientProps {
  memories: Memory[];
}

export function MomentosClaveClient({ memories }: MomentosClaveClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("TODOS");
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

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
                  : "bg-background border border-border text-foreground/60 hover:text-foreground"
              }`}
            >
              {f.icon}
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
            <MemoryCard
              key={memory.id}
              memory={memory}
              onClick={() => setSelectedMemory(memory)}
            />
          ))}
        </div>
      )}

      {/* Viewer drawer */}
      <MemoryViewerDrawer
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </>
  );
}
