"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import Image from "next/image";
import { X, Image as ImageIcon, Video, Mic, FileText, Pencil } from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";

interface Memory {
  id: string;
  type: "PHOTO" | "VIDEO" | "AUDIO" | "NOTE" | "DRAWING";
  fileUrl?: string | null;
  content?: string | null;
  createdAt: Date | string;
  isFavorite?: boolean;
}

const TYPE_LABELS: Record<Memory["type"], string> = {
  PHOTO: "Foto",
  VIDEO: "Vídeo",
  AUDIO: "Audio",
  NOTE: "Nota",
  DRAWING: "Dibujo",
};

const TYPE_ICONS: Record<Memory["type"], React.ReactNode> = {
  PHOTO: <ImageIcon className="h-4 w-4" />,
  VIDEO: <Video className="h-4 w-4" />,
  AUDIO: <Mic className="h-4 w-4" />,
  NOTE: <FileText className="h-4 w-4" />,
  DRAWING: <Pencil className="h-4 w-4" />,
};

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

interface MemoryViewerDrawerProps {
  memory: Memory | null;
  onClose: () => void;
}

export function MemoryViewerDrawer({ memory, onClose }: MemoryViewerDrawerProps) {
  const isOpen = !!memory;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-[430px] mx-auto rounded-t-[32px] px-6 pb-10">
        <DrawerHeader className="px-0 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-foreground/50">
              {memory && TYPE_ICONS[memory.type]}
              <DrawerTitle className="text-[13px] font-semibold tracking-widest uppercase text-foreground/50">
                {memory ? TYPE_LABELS[memory.type] : ""}
              </DrawerTitle>
            </div>
            <DrawerClose onClick={onClose} className="p-2 rounded-full hover:bg-surface">
              <X className="h-5 w-5 text-foreground/40" />
            </DrawerClose>
          </div>
        </DrawerHeader>

        {memory && (
          <div className="space-y-4">
            {/* Contenido principal */}
            {(memory.type === "PHOTO" || memory.type === "DRAWING") &&
              memory.fileUrl && (
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-surface">
                  <Image
                    src={memory.fileUrl}
                    alt="Recuerdo"
                    fill
                    className="object-contain"
                    sizes="(max-width: 430px) 100vw, 430px"
                  />
                </div>
              )}

            {memory.type === "VIDEO" && memory.fileUrl && (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black">
                <video
                  src={memory.fileUrl}
                  controls
                  autoPlay={false}
                  className="w-full h-full"
                />
              </div>
            )}

            {memory.type === "AUDIO" && memory.fileUrl && (
              <div className="flex flex-col items-center gap-6 py-8 px-4 bg-surface/50 rounded-2xl">
                <div className="flex gap-[4px] items-center h-10">
                  {[3, 7, 4, 8, 5, 3, 6, 9, 4, 7, 3, 5, 8, 4, 6].map((h, i) => (
                    <div
                      key={i}
                      className="w-[3px] bg-foreground/30 rounded-full"
                      style={{ height: `${h * 4}px` }}
                    />
                  ))}
                </div>
                <audio
                  src={memory.fileUrl}
                  controls
                  className="w-full"
                  style={{ colorScheme: "light" }}
                />
              </div>
            )}

            {memory.type === "NOTE" && (
              <div className="rounded-2xl border border-border bg-surface/30 p-5 min-h-[120px]">
                <p className="font-sans text-[15px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
                  {memory.content || "Sin contenido"}
                </p>
              </div>
            )}

            {/* Footer: fecha + favorito */}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <p className="text-[12px] text-foreground/40">
                {formatDate(memory.createdAt)}
              </p>
              <FavoriteButton
                memoryId={memory.id}
                initialIsFavorite={memory.isFavorite ?? false}
              />
            </div>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}
