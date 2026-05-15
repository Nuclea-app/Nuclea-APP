"use client";

import { useState } from "react";
import { Image as ImageIcon, Video, Mic, FileText, Pencil } from "lucide-react";
import { MemoryUploader } from "@/components/memory/MemoryUploader";
import { MemoryType } from "@prisma/client";

interface ActionGridProps {
  capsuleId: string;
}

export const ActionGrid = ({ capsuleId }: ActionGridProps) => {
  const [activeType, setActiveType] = useState<MemoryType | null>(null);

  const actions = [
    { name: "Foto", icon: ImageIcon, type: MemoryType.PHOTO },
    { name: "Vídeo", icon: Video, type: MemoryType.VIDEO },
    { name: "Audio", icon: Mic, type: MemoryType.AUDIO },
    { name: "Notas", icon: FileText, type: MemoryType.NOTE },
    { name: "Dibujos", icon: Pencil, type: MemoryType.DRAWING },
  ];

  return (
    <>
      <div className="grid grid-cols-5 gap-2 w-full">
        {actions.map((action) => (
          <button
            key={action.name}
            onClick={() => setActiveType(action.type)}
            className="cursor-pointer border border-border flex flex-col items-center group rounded-2xl bg-background shadow-sm py-2 hover:bg-surface"
          >
            <div className="flex h-11 w-full items-center justify-center group-active:scale-[0.95]">
              <action.icon className="h-5 w-5 text-foreground/60" />
            </div>
            <span className="text-[11px] font-medium text-foreground/60">
              {action.name}
            </span>
          </button>
        ))}
      </div>

      <MemoryUploader
        capsuleId={capsuleId}
        type={activeType}
        isOpen={activeType !== null}
        onClose={() => setActiveType(null)}
      />
    </>
  );
};
