import { SparkIcon } from "@/components/nuclea/SparkIcon";

export default function CapsuleTokenLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
      <SparkIcon className="text-2xl text-foreground/20 animate-pulse" />
      <p className="font-sans text-[12px] font-bold tracking-[0.3em] uppercase text-foreground/20 animate-pulse">
        Preparando tu cápsula…
      </p>
    </div>
  );
}
