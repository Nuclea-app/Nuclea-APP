"use client";

import Link from "next/link";
import { useState, useTransition } from "react";

import { PrimaryButton } from "@/components/nuclea/PrimaryButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { solicitarBorradoCuenta } from "@/lib/actions/eliminarCuenta.actions";
import { CORREO_SOPORTE } from "@/lib/contacto";
import type { ResumenBorrado } from "@/lib/cuenta";

/**
 * El formulario de la vía web.
 *
 * El orden de la pantalla es el mensaje, igual que en la app: primero lo que se
 * pierde —con los nombres de las cápsulas cuando se pueden saber—, y solo
 * después la casilla para escribir la palabra. Nadie debería poder borrar los
 * recuerdos de su vida en dos clics y un «sí».
 */
export function FormularioBorrado({
  correoSesion,
  resumen,
}: {
  /** Dirección de la sesión abierta en este navegador, si hay alguna. */
  correoSesion: string | null;
  /** Solo se puede calcular cuando hay sesión: es la cuenta de quien mira. */
  resumen: ResumenBorrado | null;
}) {
  const [palabra, setPalabra] = useState("");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [enviada, setEnviada] = useState<"verificada" | "por-verificar" | null>(
    null,
  );
  const [enviando, iniciarEnvio] = useTransition();

  const haySesion = correoSesion !== null;
  const puede =
    palabra.trim().toUpperCase() === "ELIMINAR" &&
    (haySesion || correo.trim() !== "") &&
    !enviando;

  const enviar = () => {
    setError(null);
    iniciarEnvio(async () => {
      const resultado = await solicitarBorradoCuenta({
        confirmacion: palabra,
        correo: haySesion ? undefined : correo,
      });
      if (resultado.estado === "error") {
        setError(resultado.mensaje);
        return;
      }
      setEnviada(resultado.verificada ? "verificada" : "por-verificar");
    });
  };

  if (enviada) {
    return (
      <div
        role="status"
        className="rounded-xl border border-border bg-surface/50 p-5"
      >
        <p className="mb-3 font-sans text-[11px] font-bold tracking-[0.25em] text-foreground uppercase">
          Solicitud recibida
        </p>
        <div className="space-y-3 font-sans text-[15px] leading-relaxed text-foreground/80">
          {enviada === "verificada" ? (
            <>
              <p>
                Hemos registrado tu solicitud y te hemos escrito a{" "}
                {/* Puede venir vacío: una cuenta creada con Google y luego
                    vaciada no tiene correo, y ahí no hay dirección que citar. */}
                {correoSesion ? (
                  <strong>{correoSesion}</strong>
                ) : (
                  "tu dirección registrada"
                )}{" "}
                para que te quede constancia.
              </p>
              <p>
                El borrado lo ejecutamos nosotros y te confirmamos por correo
                cuando esté hecho. Si cambias de opinión antes, responde a ese
                correo y no borramos nada.
              </p>
            </>
          ) : (
            <>
              <p>
                Hemos registrado tu solicitud. Te escribiremos a la dirección que
                nos has dado para comprobar que eres tú: sin esa comprobación no
                borramos nada, porque cualquiera podría escribir el correo de
                otra persona.
              </p>
              <p>
                Si no te llega nada, escríbenos a{" "}
                <a
                  href={`mailto:${CORREO_SOPORTE}`}
                  className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
                >
                  {CORREO_SOPORTE}
                </a>
                .
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {resumen ? (
        <>
          {resumen.seBorran.length > 0 ? (
            <div>
              <p className="mb-2 font-sans text-[10px] font-semibold tracking-[0.3em] text-foreground/60 uppercase">
                Se borra para siempre
              </p>
              <ul className="space-y-3 rounded-xl border border-border bg-surface/50 p-5">
                {resumen.seBorran.map((capsula) => (
                  <li key={capsula.id}>
                    <p className="font-serif text-[17px] text-foreground">
                      {capsula.name}
                    </p>
                    <p className="font-sans text-[13px] text-foreground/60">
                      {capsula.recuerdos} recuerdos · {capsula.mensajesFuturos}{" "}
                      mensajes futuros
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="font-sans text-[15px] leading-relaxed text-foreground/80">
              No tienes cápsulas propias que borrar.
            </p>
          )}

          {resumen.seQuedan.length > 0 && (
            <div>
              <p className="mb-2 font-sans text-[10px] font-semibold tracking-[0.3em] text-foreground/60 uppercase">
                Se queda con quien la recibió
              </p>
              <ul className="space-y-2 rounded-xl border border-border bg-surface/50 p-5">
                {resumen.seQuedan.map((capsula) => (
                  <li
                    key={capsula.id}
                    className="font-serif text-[17px] text-foreground"
                  >
                    {capsula.name}
                  </li>
                ))}
                <li className="pt-1 font-sans text-[13px] leading-relaxed text-foreground/60">
                  Ya la entregaste: su contenido es de quien la recibió y no
                  podemos quitárselo. Tu cuenta se vacía —no queda ningún dato
                  personal— pero no desaparece, porque es lo que sostiene esa
                  cápsula.
                </li>
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3 font-sans text-[15px] leading-relaxed text-foreground/80">
          <p>
            No has entrado con tu cuenta, así que no podemos enseñarte aquí qué
            cápsulas tienes ni cuáles ya entregaste.{" "}
            <Link
              href="/login"
              className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:decoration-foreground"
            >
              Inicia sesión
            </Link>{" "}
            y vuelve a esta página si quieres verlo antes de decidir.
          </p>
          <p>
            No hace falta para pedir el borrado: puedes pedirlo aquí mismo con tu
            dirección de correo y lo comprobamos nosotros.
          </p>
        </div>
      )}

      <div className="space-y-4">
        {!haySesion && (
          <div className="space-y-2">
            <Label
              htmlFor="correo"
              className="font-sans text-[10px] font-semibold tracking-[0.3em] text-foreground/60 uppercase"
            >
              Tu correo de NÚCLEA
            </Label>
            <Input
              id="correo"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={enviando}
              placeholder="el correo con el que te registraste"
              className="h-14 rounded-xl border-border bg-surface/30 px-4 text-[15px]"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="confirmacion"
            className="font-sans text-[10px] font-semibold tracking-[0.3em] text-foreground/60 uppercase"
          >
            Escribe ELIMINAR para confirmar
          </Label>
          <Input
            id="confirmacion"
            // La palabra se escribe en mayúsculas sola: el móvil no la corrige
            // ni la autocompleta, para que no la teclee el teclado por nadie.
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            value={palabra}
            onChange={(e) => setPalabra(e.target.value)}
            disabled={enviando}
            placeholder="ELIMINAR"
            className="h-14 rounded-xl border-border bg-surface/30 px-4 text-[15px] tracking-[0.2em]"
          />
        </div>

        {error && (
          <p role="alert" className="font-sans text-[14px] text-destructive">
            {error}
          </p>
        )}

        <PrimaryButton type="button" onClick={enviar} disabled={!puede}>
          {enviando ? "Enviando…" : "Pedir la eliminación"}
        </PrimaryButton>
      </div>
    </div>
  );
}
