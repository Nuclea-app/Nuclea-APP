import { auth } from "@/auth";
import { getUserCapsule, getAllMemories } from "@/lib/actions/capsule.actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, FileText, Image as ImageIcon, Mic, Play } from "lucide-react";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { FavoriteButton } from "@/components/capsule/FavoriteButton";

interface MemoriesPageProps {
  searchParams: Promise<{ capsule?: string }>;
}

export default async function MemoriesPage({ searchParams }: MemoriesPageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { capsule: capsuleId } = await searchParams;
  const capsule = await getUserCapsule(session.user.id, capsuleId);
  if (!capsule) redirect("/capsulas");

  const memories = await getAllMemories(capsule.id);

  const backHref = capsuleId
    ? `/dashboard/perfil?capsule=${capsuleId}`
    : "/dashboard/perfil";

  return (
    <div className="flex flex-col pb-12 px-6 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href={backHref} className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-surface transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-1 font-sans font-semibold tracking-[0.2em] text-[12px]">
          <span>NUCLEA</span>
          <SparkIcon className="text-[10px]" />
        </div>
        <div className="w-9" />
      </div>

      {/* Hero */}
      <div className="mb-8 text-center">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-2">
          TUS RECUERDOS ✦
        </p>
        <h1 className="font-serif text-3xl text-foreground mb-1">{capsule.name}</h1>
        <p className="text-[13px] text-foreground/50">
          {memories.length} recuerdo{memories.length !== 1 ? "s" : ""} guardado{memories.length !== 1 ? "s" : ""}
        </p>
      </div>

      {memories.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-surface/30 py-16 text-center">
          <SparkIcon className="text-2xl opacity-20" />
          <p className="text-[13px] text-foreground/40 italic">Aún no hay recuerdos en esta cápsula.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {memories.map((memory) => (
            <div
              key={memory.id}
              className="relative aspect-square rounded-2xl bg-surface overflow-hidden group"
            >
              <FavoriteButton memoryId={memory.id} initialIsFavorite={memory.isFavorite} />

              {memory.type === "PHOTO" && (
                memory.fileUrl ? (
                  <>
                    <Image src={memory.fileUrl} alt="Recuerdo" fill className="object-cover" />
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-2 left-2 text-[9px] text-white font-medium uppercase tracking-wider">
                      PHOTO ✦
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <ImageIcon className="h-8 w-8 opacity-10" />
                  </div>
                )
              )}

              {memory.type === "VIDEO" && (
                memory.fileUrl ? (
                  <div className="relative w-full h-full bg-slate-100">
                    <video src={memory.fileUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-t from-black/70 via-black/20 to-transparent">
                      <Play className="h-8 w-8 text-white fill-white" />
                    </div>
                    <div className="absolute bottom-2 left-2 text-[9px] text-white font-medium uppercase tracking-wider">
                      VIDEO ✦
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Play className="h-8 w-8 opacity-10" />
                  </div>
                )
              )}

              {memory.type === "AUDIO" && (
                <div className="flex flex-col items-center justify-center h-full gap-2 p-4 bg-surface/50">
                  <div className="flex gap-[2px] items-center h-6">
                    <div className="w-[3px] h-3 bg-foreground/20 rounded-full" />
                    <div className="w-[3px] h-6 bg-foreground/40 rounded-full" />
                    <div className="w-[3px] h-4 bg-foreground/30 rounded-full" />
                    <div className="w-[3px] h-6 bg-foreground/50 rounded-full" />
                    <div className="w-[3px] h-3 bg-foreground/20 rounded-full" />
                  </div>
                  <Mic className="h-5 w-5 text-foreground/40" />
                  <span className="text-[9px] text-foreground/40 font-medium uppercase tracking-wider">AUDIO ✦</span>
                </div>
              )}

              {memory.type === "NOTE" && (
                <div className="flex flex-col h-full p-4 gap-2 bg-surface/50">
                  <div className="flex items-center justify-between">
                    <FileText className="h-4 w-4 text-foreground/40" />
                    <span className="text-[8px] font-medium tracking-widest uppercase text-foreground/30">NOTA ✦</span>
                  </div>
                  <p className="text-[11px] text-foreground/60 line-clamp-6 leading-tight">
                    {memory.content || "Sin contenido"}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
