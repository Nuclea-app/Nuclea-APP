"use client";

import { Logo } from "./Logo";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingHeaderProps {
  showBackButton?: boolean;
}

export const OnboardingHeader = ({
  showBackButton = false,
}: OnboardingHeaderProps) => {
  const router = useRouter();

  return (
    <header className="grid grid-cols-3 w-full items-center py-6">
      {/* Izquierda — botón volver o vacío */}
      <div className="flex justify-start">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="text-foreground hover:text-foreground/80 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Centro — logo siempre centrado */}
      <div className="flex justify-center">
        <Logo className="text-sm" />
      </div>

      {/* Derecha — siempre vacío */}
      <div />
    </header>
  );
};
