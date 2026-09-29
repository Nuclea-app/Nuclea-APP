import type { Metadata } from "next";
import Link from "next/link";

import { Logo } from "@/components/nuclea/Logo";
import { SparkIcon } from "@/components/nuclea/SparkIcon";
import { auth } from "@/auth";
import { resumirBorradoCuenta, type ResumenBorrado } from "@/lib/cuenta";
import {
  CorreoSoporte,
  Destacado,
  Lista,
  MarcaPendiente,
  Seccion,
} from "../(legal)/_componentes/piezas";
import { FormularioBorrado } from "./_componentes/FormularioBorrado";

export const metadata: Metadata = {
  title: "Eliminar tu cuenta — NÚCLEA",
  description:
    "Pide la eliminación de tu cuenta de NÚCLEA y de todo su contenido desde el navegador, sin instalar la aplicación. Qué se borra, qué no y cuánto tarda.",
};

/**
 * /eliminar-cuenta — la vía web para eliminar la cuenta.
 *
 * Existe porque Google la exige: tiene que poder pedirse el borrado de la
 * cuenta SIN instalar la aplicación, desde una página pública y accesible, y
 * esa URL se declara en la ficha de Play. De ahí las tres condiciones que
 * ordenan este fichero:
 *
 *   1. Pública. No está bajo /dashboard, así que `auth.config.ts` no la
 *      protege: se lee y se puede usar sin sesión. Quien ya no tiene la app
 *      instalada tampoco tiene por qué poder entrar en su cuenta.
 *   2. Se explica ANTES de pedir nada, incluida la parte incómoda: una cápsula
 *      ya entregada no se borra, y la cuenta entonces no desaparece, se vacía.
 *      Decirlo después sería una trampa.
 *   3. No hereda el layout de (legal): ese inyecta el aviso de «borrador
 *      pendiente de revisión jurídica», que aquí sería falso —esto no es un
 *      texto legal, es un trámite que funciona— y restaría credibilidad justo
 *      donde hace falta. El marco se repite a mano, que son ocho líneas.
 */
export default async function EliminarCuentaPage() {
  const sesion = await auth();
  const userId = sesion?.user?.id ?? null;

  // El resumen solo se puede dar con sesión, porque es la cuenta de quien mira.
  // Sin sesión no se consulta nada con el correo escrito: contestar distinto
  // según exista o no la cuenta convertiría la página en un comprobador de
  // quién está registrado en NÚCLEA.
  let resumen: ResumenBorrado | null = null;
  if (userId) {
    try {
      resumen = await resumirBorradoCuenta(userId);
    } catch {
      // Si la base no contesta, la página sigue sirviendo para pedirlo: el
      // requisito es poder pedir el borrado, no ver el inventario.
      resumen = null;
    }
  }

  return (
    <main className="flex min-h-screen w-full justify-center bg-background px-6">
      <div className="w-full max-w-[680px] py-12">
        <header className="mb-10 flex flex-col items-center">
          <Link href="/" aria-label="Ir al inicio de NÚCLEA">
            <Logo className="text-xl" />
          </Link>
        </header>

        <article className="space-y-12">
          <header>
            <h1 className="mb-3 font-serif text-4xl leading-tight text-foreground">
              Eliminar tu cuenta
            </h1>
            <p className="font-sans text-[15px] leading-relaxed text-foreground/70">
              Puedes pedirlo desde aquí, con el navegador y sin instalar nada. Si
              tienes la aplicación, también puedes hacerlo dentro, al final de tu
              perfil.
            </p>
          </header>

          <Destacado titulo="Léelo antes de pedirlo">
            <p>
              <strong>Esto no se puede deshacer.</strong> Los recuerdos, los
              mensajes futuros y los ficheros de las cápsulas que no hayas
              entregado se borran, y destruimos la clave con la que estaban
              cifrados. Ni nosotros podemos recuperarlos después.
            </p>
            <p>
              <strong>
                Una cápsula que ya entregaste no se borra con tu cuenta.
              </strong>{" "}
              Su contenido pertenece a quien la recibió: alguien puede tener la
              cápsula de su madre y no va a perderla porque ella cierre su
              cuenta. Cuando queda alguna entregada, tu cuenta{" "}
              <strong>no desaparece: se vacía</strong>. Tu correo, tu nombre, tu
              foto, tu contraseña y tu fecha de nacimiento se borran y no queda
              ni un dato personal tuyo, pero la cuenta sigue existiendo vacía,
              porque es lo que sostiene la cápsula de la otra persona.
            </p>
            <p>
              Si no queda ninguna entregada, la cuenta desaparece entera.
            </p>
          </Destacado>

          <Seccion id="que-se-borra" titulo="Qué se borra">
            <Lista>
              <li>
                Tus cápsulas no entregadas, con todos sus recuerdos —fotos,
                vídeos, audios y notas—, sus mensajes futuros y sus ficheros en
                nuestro almacenamiento.
              </li>
              <li>
                La clave de cifrado de cada una de esas cápsulas, que se destruye
                primero: lo que quedara en el almacenamiento después de eso ya no
                se puede leer.
              </li>
              <li>
                Tu perfil, tus sesiones abiertas, los identificadores de tus
                dispositivos, tus avisos y tus participaciones en cápsulas de
                otras personas.
              </li>
            </Lista>
          </Seccion>

          <Seccion id="que-no-se-borra" titulo="Qué no se borra">
            <Lista>
              <li>
                <strong>Las cápsulas que ya entregaste.</strong> Siguen siendo de
                quien las recibió y podrá seguir abriéndolas.
              </li>
              <li>
                <strong>Las cápsulas que te entregaron a ti.</strong> Se
                desvinculan de tu cuenta, pero no se borran: son de quien las
                mandó, no tuyas.
              </li>
              <li>
                <strong>Un registro mínimo del borrado:</strong> qué se borró,
                cuándo y cuánto ocupaba. No contiene ningún nombre de fichero,
                ningún título y ningún texto tuyo. Lo conservamos para poder
                demostrar que el borrado se hizo.
              </li>
              <li>
                Lo que una obligación legal nos exija conservar, durante el plazo
                que esa obligación marque.{" "}
                <MarcaPendiente>
                  pendiente: la lista concreta de plazos, con la asesoría
                </MarcaPendiente>
              </li>
            </Lista>
            <p>
              El detalle está en la{" "}
              <Link
                href="/privacidad#conservacion"
                className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
              >
                Política de privacidad
              </Link>
              , apartado 7.
            </p>
          </Seccion>

          <Seccion id="pedirlo" titulo="Pedir la eliminación">
            {/*
              La ejecución no se dispara desde el navegador. El borrado vive en
              la API móvil del servidor, que se autentica con Bearer, y esta
              webapp no puede fabricar ese token sin duplicar el secreto de
              firma: sería abrir un agujero para cerrar un trámite. Así que aquí
              se registra la solicitud y la ejecuta una persona con la ruta que
              ya existe, y se dice claramente en lugar de fingir un botón que
              borra al instante.
            */}
            <FormularioBorrado
              correoSesion={userId ? (sesion?.user?.email ?? "") : null}
              resumen={resumen}
            />
            <p className="font-sans text-[13px] leading-relaxed text-foreground/60">
              El borrado lo ejecutamos nosotros al recibir la solicitud y te lo
              confirmamos por correo. Plazo máximo:{" "}
              <MarcaPendiente>
                pendiente de fijar; el RGPD da un mes desde la solicitud
              </MarcaPendiente>
            </p>
          </Seccion>

          <Seccion id="otra-via" titulo="Si prefieres escribirnos">
            <p>
              También puedes pedirlo por correo a <CorreoSoporte /> desde la
              dirección con la que te registraste. Es el mismo trámite y lo
              atiende la misma persona.
            </p>
          </Seccion>
        </article>

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
          <div className="mt-8 flex items-center gap-2 font-sans text-[10px] tracking-[0.3em] text-foreground/30">
            <SparkIcon />
            <span>NUCLEA</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
