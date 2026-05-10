import { Loader2 } from "lucide-react";

export default function OnboardingLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-foreground/20" />
      <span className="font-sans text-[12px] font-bold tracking-[0.2em] uppercase text-foreground/20">
        Nuclea
      </span>
    </div>
  );
}
