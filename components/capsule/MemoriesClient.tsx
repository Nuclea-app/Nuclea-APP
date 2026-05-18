"use client";

import { useState } from "react";
import { MemoryCard, Memory } from "./MomentosClaveClient";
import { MemoryViewerDrawer } from "./MemoryViewerDrawer";
import { SparkIcon } from "@/components/nuclea/SparkIcon";

interface MemoriesClientProps {
  memories: Memory[];
}

export function MemoriesClient({ memories }: MemoriesClientProps) {
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  if (memories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-surface/30 py-16 text-center">
        <SparkIcon className="text-2xl opacity-20" />
        <p className="text-[13px] text-foreground/40 italic">
          Aún no hay recuerdos en esta cápsula.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar -mx-6 px-6">
        {memories.map((memory) => (
          <div
            key={memory.id}
            className="shrink-0 w-[120px] min-[320px]:w-[140px]"
          >
            <MemoryCard
              memory={memory}
              onClick={() => setSelectedMemory(memory)}
            />
          </div>
        ))}
      </div>

      <MemoryViewerDrawer
        memory={selectedMemory}
        onClose={() => setSelectedMemory(null)}
      />
    </>
  );
}
