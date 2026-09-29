/**
 * Lo que ve quien abre un enlace de cápsula que ya no sirve.
 *
 * Hoy solo sale cuando se pide un mensaje futuro que no es de esta cápsula
 * (la dirección de un mensaje escrita a mano). Los enlaces que no sirven —sin
 * entregar, caducados o inventados— los contesta la puerta de la entrega
 * (components/entrega/PuertaDeEntrega.tsx), con el mismo mensaje para los
 * tres: a quien está probando enlaces no se le cuenta cuál era de verdad.
 */
export default function EnlaceNoDisponible() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 text-2xl opacity-20">✦</span>
      <p className="mb-2 font-serif text-2xl text-foreground">Esta cápsula no está disponible.</p>
      <p className="text-[13px] text-foreground/50">
        El enlace puede haber caducado o ser incorrecto.
      </p>
    </div>
  );
}
