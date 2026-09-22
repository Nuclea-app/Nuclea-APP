/**
 * Lo que ve quien abre un enlace de cápsula que ya no sirve.
 *
 * Las cinco páginas de dentro llaman a notFound() cuando getDeliveryByToken
 * devuelve null, y eso pasa ahora en tres casos que antes abrían igual: la
 * cápsula no se ha entregado todavía, el enlace ha caducado, o el token no
 * existe. Sin este fichero, las tres caían en el 404 genérico de Next, en
 * inglés y sin explicar nada a alguien que acaba de recibir un regalo.
 *
 * El texto es el mismo que la portada (app/capsula/[token]/page.tsx) para que
 * las dos puertas digan lo mismo, y NO distingue entre los tres casos: a quien
 * está probando enlaces no se le cuenta cuál de ellos era de verdad.
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
