import Link from "next/link";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { PrimaryButton } from "@/components/nuclea/PrimaryButton";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      {/* Logo */}
      <div className="flex items-center gap-2 font-sans font-bold tracking-[0.3em] uppercase text-2xl mb-12">
        NUCLEA <SparkIcon />
      </div>

      {/* Content */}
      <div className="max-w-[300px]">
        <h1 className="font-serif text-4xl text-foreground mb-6 leading-tight">
          Esta historia aún no ha sido escrita.
        </h1>
        <p className="font-sans text-foreground/40 mb-12 leading-relaxed">
          No pudimos encontrar la página que buscas. Tal vez el camino ha
          cambiado, pero tu historia continúa.
        </p>
      </div>

      {/* Action */}
      <Link href="/" className="w-full max-w-[280px]">
        <PrimaryButton>Volver al inicio</PrimaryButton>
      </Link>

      <div className="mt-12">
        <SparkIcon className="text-foreground/10 h-8 w-8" />
      </div>
    </div>
  );
}
