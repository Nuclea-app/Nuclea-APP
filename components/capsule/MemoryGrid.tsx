import { Play, Mic, FileText, Image as ImageIcon, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FavoriteButton } from "./FavoriteButton";

export interface Memory {
  id: string;
  type: 'PHOTO' | 'VIDEO' | 'AUDIO' | 'NOTE';
  fileUrl?: string | null;
  content?: string | null;
  duration?: string | null;
  createdAt: Date | string;
  isFavorite?: boolean;
}

export const MemoryGrid = ({ memories, capsuleId }: { memories: Memory[]; capsuleId?: string }) => {
  const allHref = capsuleId ? `/dashboard/memories?capsule=${capsuleId}` : "/dashboard/memories";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-sans text-[17px] font-semibold text-foreground">Últimos recuerdos</h3>
        <Link href={allHref} className="text-[12px] font-medium text-foreground/40 hover:text-foreground">
          Ver todos →
        </Link>
      </div>
      
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
        {memories.length === 0 ? (
          <div className="flex h-[100px] w-full items-center justify-center rounded-2xl border border-dashed border-border bg-surface/30">
            <p className="text-[12px] text-foreground/40 italic">Aún no hay recuerdos</p>
          </div>
        ) : (
          memories.map((memory) => (
            <div key={memory.id} className="relative shrink-0 w-[120px] h-[120px] rounded-2xl bg-surface overflow-hidden group transition-all hover:opacity-90">
              <FavoriteButton memoryId={memory.id} initialIsFavorite={memory.isFavorite || false} />
              
              {memory.type === 'PHOTO' && (
                memory.fileUrl ? (
                  <>
                    <Image src={memory.fileUrl} alt="Recuerdo" fill className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-[9px] text-white font-medium uppercase tracking-wider">
                      PHOTO ✦
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full"><ImageIcon className="h-6 w-6 opacity-10" /></div>
                )
              )}
              
              {memory.type === 'VIDEO' && (
                memory.fileUrl ? (
                  <div className="relative w-full h-full bg-slate-200">
                    <video src={memory.fileUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/70 via-black/20 to-transparent">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[9px] text-white font-medium uppercase tracking-wider">
                      <span>VIDEO ✦</span>
                      {memory.duration && <span>{memory.duration}</span>}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full"><Video className="h-6 w-6 opacity-10" /></div>
                )
              )}
              
              {memory.type === 'AUDIO' && (
                memory.fileUrl ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 p-4 bg-surface/50">
                    <div className="flex gap-[2px] items-center h-4">
                      <div className="w-[2px] h-2 bg-foreground/20 rounded-full animate-pulse" />
                      <div className="w-[2px] h-4 bg-foreground/40 rounded-full" />
                      <div className="w-[2px] h-3 bg-foreground/30 rounded-full" />
                      <div className="w-[2px] h-4 bg-foreground/50 rounded-full" />
                      <div className="w-[2px] h-2 bg-foreground/20 rounded-full" />
                    </div>
                    <Mic className="h-4 w-4 text-foreground/40" />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[9px] text-foreground/40 font-medium uppercase tracking-wider">
                      <span>AUDIO ✦</span>
                      {memory.duration && <span>{memory.duration}</span>}
                    </div>
                    <audio src={memory.fileUrl} className="hidden" />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full"><Mic className="h-6 w-6 opacity-10" /></div>
                )
              )}
              
              {memory.type === 'NOTE' && (
                <div className="flex flex-col h-full p-3 gap-2 bg-surface/50">
                  <div className="flex items-center justify-between">
                    <FileText className="h-4 w-4 text-foreground/40" />
                    <span className="text-[8px] font-medium tracking-widest uppercase text-foreground/30">NOTA ✦</span>
                  </div>
                  <p className="text-[10px] text-foreground/60 line-clamp-4 leading-tight">
                    {memory.content || "Sin contenido"}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
