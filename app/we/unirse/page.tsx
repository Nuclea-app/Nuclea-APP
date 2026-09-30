import Image from "next/image";
import Link from "next/link";

import { SparkIcon } from "@/components/nuclea/SparkIcon";

/**
 * A DONDE LLEVA LA INVITACIÓN A UNA CÁPSULA WE.
 *
 * El correo de invitación (y el enlace que comparte quien organiza) apunta
 * aquí: `https://www.nuclea.app/we/unirse?c=<cápsula>&t=<token>`. Se acepta
 * dentro de la app, con la cuenta de quien se une —la invitación no abre sesión
 * ni da acceso por sí sola—, así que esta página solo explica y abre la app con
 * su esquema propio, `nuclea://we/unirse?…`, que no necesita App Links.
 *
 * No lee nada de la base ni comprueba el token: eso lo hace el servidor al
 * aceptar. Aquí el token solo se pasa de un sitio a otro.
 */
export default async function UnirseAWePage({
  searchParams,
}: {
  searchParams: Promise<{ c?: string; t?: string }>;
}) {
  const { c, t } = await searchParams;
  const completo = !!c && !!t;
  const enLaApp = completo
    ? `nuclea://we/unirse?c=${encodeURIComponent(c!)}&t=${encodeURIComponent(t!)}`
    : null;

  return (
    <main className="flex min-h-screen w-full justify-center bg-background px-6">
      <div className="flex w-full max-w-[430px] flex-col items-center py-12 text-center">
        <div className="relative mb-8 flex h-36 w-full items-center justify-center">
          <div className="absolute h-36 w-60 rounded-full border border-border/60" />
          <Image
            src="/capsula-nuclea.png"
            alt=""
            width={200}
            height={67}
            className="relative h-[67px] w-[200px] object-contain"
            priority
          />
        </div>

        <SparkIcon className="mb-5 text-sm opacity-60" />

        <h1 className="mb-3 max-w-[300px] font-serif text-3xl leading-tight text-foreground">
          Te han invitado a una cápsula We
        </h1>
        <p className="mb-8 max-w-[320px] text-[15px] leading-6 text-foreground/70">
          Un regalo común: cada persona añade sus recuerdos sin ver los de las demás, y todo se
          descubre a la vez cuando se abre.
        </p>

        {enLaApp ? (
          <>
            <a
              href={enLaApp}
              className="flex w-full items-center justify-center gap-3 rounded-sm bg-foreground px-6 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <SparkIcon className="text-sm" />
              Unirme en la app
            </a>
            <p className="mt-6 max-w-[320px] text-[13px] leading-6 text-foreground/55">
              Abre esta página desde el móvil donde tengas instalada la app NÚCLEA. Si todavía no
              la tienes, instálala, entra con tu cuenta y vuelve a pulsar el botón del correo.
            </p>
          </>
        ) : (
          <p className="max-w-[320px] text-[14px] leading-6 text-foreground/60">
            Este enlace de invitación está incompleto. Pide a quien organiza la cápsula que te lo
            mande otra vez.
          </p>
        )}

        <Link href="/" className="mt-10 flex items-center gap-2 text-[10px] tracking-[0.3em] opacity-30">
          <SparkIcon />
          <span>NUCLEA</span>
        </Link>
      </div>
    </main>
  );
}
