"use client";

import { useState } from "react";
import { Image as ImageIcon, Video, Mic, FileText } from "lucide-react";
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
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-4 w-full">
        {actions.map((action) => (
          <button
            key={action.name}
            onClick={() => setActiveType(action.type)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-background shadow-sm transition-all duration-200 group-hover:bg-surface group-active:scale-[0.95]">
              <action.icon className="h-6 w-6 text-foreground/60" />
            </div>
            <span className="text-[12px] font-medium text-foreground/60">{action.name}</span>
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
