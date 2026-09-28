import Link from "next/link";
import { Logo } from "@/components/nuclea/Logo";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { AvisoBorrador, CorreoSoporte } from "./_componentes/piezas";

/**
 * Envoltorio de los dos documentos legales.
 *
 * El aviso de borrador se renderiza AQUÍ y no dentro de cada página para que
 * no se pueda publicar uno de los dos textos sin él: cualquier página nueva
 * que caiga en este grupo de rutas lo hereda.
 *
 * El ancho es mayor que el de (auth) y (onboarding), que emulan un móvil con
 * max-w-[430px]. Un documento legal con renglones de 430 px son cuarenta
 * pantallas de scroll y nadie lo lee; 680 px sigue siendo cómodo en un móvil
 * porque el limitador real ahí es el padding lateral.
 */
export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen w-full justify-center bg-background px-6">
      <div className="w-full max-w-[680px] py-12">
        <header className="mb-10 flex flex-col items-center">
          <Link href="/" aria-label="Ir al inicio de NÚCLEA">
            <Logo className="text-xl" />
          </Link>
        </header>

        <AvisoBorrador />

        {children}

        <footer className="mt-16 border-t border-border pt-8">
          <nav className="mb-6 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[14px]">
            <Link
              href="/condiciones"
              className="text-foreground/70 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              Condiciones de uso
            </Link>
            <Link
              href="/privacidad"
              className="text-foreground/70 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              Política de privacidad
            </Link>
            <Link
              href="/"
              className="text-foreground/70 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-foreground"
            >
              Inicio
            </Link>
          </nav>
          <p className="font-sans text-[13px] leading-relaxed text-foreground/50">
            ¿Alguna duda sobre estos textos? Escríbenos a <CorreoSoporte />.
          </p>
          <div className="mt-8 flex items-center gap-2 font-sans text-[10px] tracking-[0.3em] text-foreground/30">
            <SparkIcon />
            <span>NUCLEA</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
