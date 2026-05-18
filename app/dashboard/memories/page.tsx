import { auth } from "@/auth";
import { getUserCapsule, getAllMemories } from "@/lib/actions/capsule.actions";
import { redirect } from "next/navigation";
import { MemoriesClient } from "@/components/capsule/MemoriesClient";

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

  return (
    <div className="flex flex-col pb-12 px-6">
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

      <MemoriesClient memories={memories} />
    </div>
  );
}
