import { cn } from "@/lib/utils";

/**
 * Piezas compartidas por /condiciones y /privacidad.
 *
 * Están en una carpeta con guion bajo a propósito: Next excluye del
 * enrutado las carpetas que empiezan por `_`, así que estos ficheros no
 * pueden acabar convertidos en una ruta pública por descuido.
 */

/**
 * El aviso que encabeza los dos documentos.
 *
 * No es decorativo y no se quita hasta que un abogado firme el texto: los
 * dos documentos los ha redactado el equipo de desarrollo leyendo el
 * producto, no un despacho. Un texto legal escrito con aplomo y sin revisar
 * es peor que no tener ninguno, porque la gente lo lee como si fuera cierto
 * y nosotros quedamos obligados por lo que diga.
 */
export function AvisoBorrador() {
  return (
    <aside
      role="note"
      aria-label="Aviso sobre el estado de este documento"
      className="mb-10 rounded-xl border-2 border-foreground/20 bg-surface/60 p-5"
    >
      <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-foreground">
        Borrador pendiente de revisión jurídica
      </p>
      <p className="font-sans text-[14px] leading-relaxed text-foreground/70">
        Este documento lo ha redactado el equipo que construye NÚCLEA
        describiendo lo que el producto hace hoy. No lo ha revisado ningún
        abogado todavía. Puede tener errores, faltarle apartados obligatorios
        y contener puntos aún sin decidir, que van marcados como{" "}
        <MarcaPendiente inline>pendiente</MarcaPendiente>. Si algo de lo que
        lees aquí te importa para decidir si usar NÚCLEA, escríbenos antes a{" "}
        <CorreoSoporte /> y te contestamos con lo que sabemos de verdad.
      </p>
    </aside>
  );
}

/**
 * Marca lo que todavía no está decidido.
 *
 * Existe porque la alternativa es peor: rellenar un hueco con la frase de
 * plantilla que suena bien («conservamos los datos el tiempo estrictamente
 * necesario») es afirmar algo que nadie ha comprobado. Un hueco marcado se
 * ve, se discute y se cierra; una frase inventada se publica y se olvida.
 */
export function MarcaPendiente({
  children,
  inline = false,
}: {
  children: React.ReactNode;
  inline?: boolean;
}) {
  return (
    <span
      className={cn(
        "rounded-sm bg-foreground/10 px-1.5 py-0.5 font-sans font-semibold text-foreground",
        inline ? "text-[13px]" : "text-[13px]",
      )}
    >
      [{children}]
    </span>
  );
}

/**
 * El único correo de contacto del producto. Está centralizado aquí para que
 * no vuelva a pasar lo de `soporte@nuclea.com`: una dirección que no existe,
 * escrita a mano en una pantalla, enseñada durante meses a quien había
 * perdido la contraseña y no tenía otra forma de pedir ayuda.
 */
export const CORREO_SOPORTE = "hola@nuclea.app";

export function CorreoSoporte({ className }: { className?: string }) {
  return (
    <a
      href={`mailto:${CORREO_SOPORTE}`}
      className={cn(
        "font-semibold text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground",
        className,
      )}
    >
      {CORREO_SOPORTE}
    </a>
  );
}

export function Seccion({
  id,
  titulo,
  children,
}: {
  id: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8">
      <h2 className="mb-4 font-serif text-2xl leading-snug text-foreground">
        {titulo}
      </h2>
      <div className="space-y-4 font-sans text-[15px] leading-relaxed text-foreground/80">
        {children}
      </div>
    </section>
  );
}

/** Caja para lo que no se puede leer por encima. */
export function Destacado({
  titulo,
  children,
}: {
  titulo?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface/50 p-5">
      {titulo && (
        <p className="mb-3 font-sans text-[11px] font-bold uppercase tracking-[0.25em] text-foreground">
          {titulo}
        </p>
      )}
      <div className="space-y-3 font-sans text-[15px] leading-relaxed text-foreground/80">
        {children}
      </div>
    </div>
  );
}

export function Lista({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-foreground/30">
      {children}
    </ul>
  );
}

/** Fecha de la última revisión del texto, compartida por los dos documentos. */
export const ULTIMA_ACTUALIZACION = "28 de septiembre de 2026";
