import { auth } from "@/auth";
import { getUserCapsule, getFavoriteMemories } from "@/lib/actions/capsule.actions";
import { redirect } from "next/navigation";
import { MomentosClaveClient } from "@/components/capsule/MomentosClaveClient";

interface MomentosClavePageProps {
  searchParams: Promise<{ capsule?: string }>;
}

export default async function MomentosClaveePage({
  searchParams,
}: MomentosClavePageProps) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { capsule: capsuleId } = await searchParams;
  const capsule = await getUserCapsule(session.user.id, capsuleId);
  if (!capsule) redirect("/capsulas");

  const memories = await getFavoriteMemories(capsule.id);

  return (
    <div className="flex flex-col pb-12 px-6">
      {/* Hero */}
      <div className="mb-8 text-center">
        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-foreground/40 mb-2">
          MOMENTOS CLAVE ✦
        </p>
        <h1 className="font-serif text-3xl text-foreground mb-1">
          {capsule.name}
        </h1>
        <p className="text-[13px] text-foreground/50 italic mb-1">
          Lo que decides guardar para siempre.
        </p>
        <p className="text-[12px] text-foreground/40">
          {memories.length} favorito{memories.length !== 1 ? "s" : ""}
        </p>
      </div>

      <MomentosClaveClient memories={memories} />
    </div>
  );
}
