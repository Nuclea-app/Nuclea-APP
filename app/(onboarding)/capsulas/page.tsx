import { auth } from "@/auth";
import { getUserCapsules } from "@/lib/actions/capsule.actions";
import { OnboardingHeader } from "@/components/nuclea/OnboardingHeader";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import Link from "next/link";
import { MoveRight, PawPrint, Sprout, Package } from "lucide-react";

const TogetherIcon = () => (
  <div className="relative flex items-center justify-center w-5 h-5">
    <div className="absolute left-0 w-3.5 h-3.5 rounded-full border-[1.5px] border-foreground" />
    <div className="absolute right-0 w-3.5 h-3.5 rounded-full border-[1.5px] border-foreground" />
  </div>
);

const capsuleOptions = [
  {
    id: "legacy",
    label: "LEGACY CAPSULE",
    title: "Lo que quieres preservar para siempre",
    icon: <SparkIcon className="text-lg leading-none" />,
  },
  {
    id: "together",
    label: "TOGETHER CAPSULE",
    title: "Historias que compartes y construyes con otros",
    icon: <TogetherIcon />,
  },
  {
    id: "pet",
    label: "PET CAPSULE",
    title: "La memoria de quienes también forman tu familia",
    icon: <PawPrint className="w-5 h-5" strokeWidth={1.5} />,
  },
  {
    id: "origin",
    label: "ORIGIN CAPSULE",
    title: "El comienzo de una historia que merece guardarse",
    icon: <Sprout className="w-5 h-5" strokeWidth={1.5} />,
  },
];

export default async function CapsuleSelectionPage() {
  const session = await auth();
  const existingCapsules =
    session?.user?.id ? await getUserCapsules(session.user.id) : [];
  const hasCapsules = existingCapsules.length > 0;

  return (
    <div className="flex flex-col items-center text-center pb-12">
      <OnboardingHeader showBackButton />

      <div className="py-4 flex items-center justify-center gap-4 text-foreground/40">
        <div className="h-px w-8 bg-current opacity-20" />
        <SparkIcon className="text-xl text-foreground" />
        <div className="h-px w-8 bg-current opacity-20" />
      </div>

      <h1 className="font-serif text-[36px] text-foreground mb-2">
        Elige tu cápsula
      </h1>
      <p className="font-sans text-[15px] text-foreground/60 mb-12 leading-relaxed">
        Cada historia merece ser contada.
      </p>

      <div className="w-full">
        <div className="space-y-4 px-2">
          {capsuleOptions.map((capsule) => (
            <Link
              key={capsule.id}
              href={`/capsulas/${capsule.id}`}
              className="group flex w-full items-center gap-5 rounded-3xl border-2 border-border bg-background p-4 text-left transition-all duration-200 hover:bg-accent-subtle active:bg-accent"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface text-foreground group-hover:bg-background">
                {capsule.icon}
              </div>
              <div className="flex-1 space-y-0.5">
                <span className="text-[10px] font-light tracking-widest uppercase text-foreground">
                  {capsule.label}
                </span>
                <h3 className="font-serif text-[18px] leading-tight text-foreground">
                  {capsule.title}
                </h3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border opacity-40 group-hover:opacity-100">
                <MoveRight className="h-4 w-4" />
              </div>
            </Link>
          ))}
        </div>

        {hasCapsules && (
          <div className="px-2 mt-6">
            <Link
              href="/dashboard"
              className="relative flex w-full items-center justify-center rounded-sm bg-foreground px-6 py-4 text-sm font-semibold tracking-wider text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            >
              <span className="absolute left-6">
                <Package className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span className="uppercase">Ir a mis cápsulas</span>
              <span className="absolute right-6">
                <MoveRight className="h-5 w-5" />
              </span>
            </Link>
          </div>
        )}
      </div>

      <div className="mt-16 flex flex-col items-center gap-6">
        <SparkIcon className="text-sm opacity-60" />
        <div className="rounded-full bg-surface border border-border px-8 py-3">
          <p className="font-sans text-[12px] text-foreground/80">
            Lo que hoy vives, mañana tendrá aún más significado.{" "}
            <SparkIcon className="inline-block ml-1 text-[10px]" />
          </p>
        </div>
      </div>
    </div>
  );
}
