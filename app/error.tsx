"use client";

import { useEffect } from "react";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import { useRouter } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleBack = () => {
    router.refresh();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center gap-2 font-sans font-bold tracking-[0.3em] uppercase text-2xl mb-8">
        NUCLEA <SparkIcon />
      </div>
      
      <h1 className="font-serif text-3xl text-foreground mb-4">Algo salió mal</h1>
      <p className="font-sans text-foreground/40 mb-12">
        Hubo un error inesperado al procesar tu solicitud.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-[280px]">
        <PrimaryButton onClick={() => reset()}>
          ✦ Intentar de nuevo
        </PrimaryButton>
        <button 
          onClick={handleBack}
          className="text-xs font-bold tracking-widest uppercase text-foreground/40 hover:text-foreground transition-colors py-2"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
