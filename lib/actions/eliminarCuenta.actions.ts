"use server";

import { headers } from "next/headers";

import { auth } from "@/auth";
import { CORREO_SOPORTE } from "@/lib/contacto";
import { resumirBorradoCuenta, type ResultadoSolicitud } from "@/lib/cuenta";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/resend";

/**
 * Solicitud de eliminación de cuenta por la vía web.
 *
 * Google exige poder PEDIR el borrado de la cuenta sin instalar la aplicación,
 * desde una página pública. La app ya lo hace contra
 * `DELETE /api/mobile/me/delete` de nuclea-servidor, pero esa ruta es de la API
 * móvil y se autentica con Bearer: desde un navegador no hay token que mandar,
 * y esta webapp no puede fabricar uno sin duplicar el secreto de firma del
 * servidor, que sería abrir un agujero para cerrar un trámite.
 *
 * Por eso esta vía REGISTRA la solicitud y la ejecuta una persona con la ruta
 * que ya existe. No se reimplementa aquí el borrado, y es a propósito: el
 * borrado de verdad destruye la clave de cifrado de cada cápsula y vacía su
 * prefijo en R2, y en este repo no hay ni KMS ni `borrarPrefijo`. Un borrado a
 * medias —filas fuera, ficheros y clave dentro— es peor que no borrar, porque
 * se puede decir que se hizo. Para que esta página ejecutara el borrado sola
 * haría falta, en nuclea-servidor, una ruta equivalente a la móvil que se
 * autentique con la cookie de sesión de la web en lugar de con Bearer.
 *
 * Dos caminos, y la diferencia entre ellos es quién acredita la identidad:
 *
 *   - Con sesión en el navegador: la sesión ya es la prueba. Se manda a soporte
 *     el identificador de la cuenta y lo que hay dentro, y una copia a la
 *     dirección registrada, que es verificada porque es la de la sesión.
 *   - Sin sesión: se manda a soporte la dirección que escriba la persona y NADA
 *     más. No se consulta la base con ese correo —responder distinto según
 *     exista o no convertiría este formulario en un comprobador de quién tiene
 *     cuenta en NÚCLEA— y no se le escribe a esa dirección, porque cualquiera
 *     podría escribir la de otra persona. Verifica soporte antes de borrar.
 */

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function solicitarBorradoCuenta(datos: {
  confirmacion: string;
  correo?: string;
}): Promise<ResultadoSolicitud> {
  // Escribir la palabra no es burocracia: es lo único que separa un clic por
  // error de perder los recuerdos de alguien. Es la misma comprobación que
  // hace la app, con la misma palabra, para que no haya dos reglas distintas.
  if (datos.confirmacion.trim().toUpperCase() !== "ELIMINAR") {
    return { estado: "error", mensaje: "Escribe ELIMINAR para confirmar." };
  }

  const sesion = await auth();
  const userId = sesion?.user?.id ?? null;

  if (userId) {
    if (!(await dentroDelLimite(`web:borrado:cuenta:${userId}`, 3, 60))) {
      return {
        estado: "error",
        mensaje:
          "Ya hemos recibido tu solicitud. Si no te llega respuesta, escríbenos a " +
          `${CORREO_SOPORTE}.`,
      };
    }

    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, name: true },
    });
    const resumen = await resumirBorradoCuenta(userId);

    const cuerpo = [
      "SOLICITUD DE ELIMINACIÓN DE CUENTA — vía web, identidad acreditada por sesión.",
      "",
      `Cuenta: ${userId}`,
      `Correo de la sesión: ${usuario?.email ?? "(sin correo en la cuenta)"}`,
      "",
      `Cápsulas que se borran: ${resumen.seBorran.length}`,
      ...resumen.seBorran.map(
        (c) =>
          `  - ${c.id} · ${c.recuerdos} recuerdos · ${c.mensajesFuturos} mensajes futuros`,
      ),
      `Cápsulas ya entregadas que se quedan con quien las recibió: ${resumen.seQuedan.length}`,
      ...resumen.seQuedan.map((c) => `  - ${c.id}`),
      "",
      resumen.quedaLapida
        ? "La cuenta NO desaparece: se vacía y queda como lápida de las cápsulas entregadas."
        : "La cuenta desaparece entera.",
      "",
      "Ejecutar con DELETE /api/mobile/me/delete de nuclea-servidor.",
    ].join("\n");

    // Los nombres de las cápsulas NO viajan en el correo: para ejecutar el
    // borrado basta el identificador, y un aviso de borrado que se lleva por
    // delante los títulos de lo que se borra deja copia de lo que se borraba.
    const avisado = await avisarASoporte({
      asunto: `Eliminación de cuenta (web) — ${userId}`,
      texto: cuerpo,
      responderA: usuario?.email ?? undefined,
    });

    if (!avisado) {
      return {
        estado: "error",
        mensaje:
          "No hemos podido registrar la solicitud. Escríbenos a " +
          `${CORREO_SOPORTE} y lo hacemos a mano.`,
      };
    }

    if (usuario?.email) {
      // A la dirección de la sesión sí se le escribe: está verificada por la
      // propia sesión, y quien pide un borrado necesita constancia por escrito
      // de haberlo pedido y de cuándo.
      await enviarCorreo({
        para: usuario.email,
        asunto: "Hemos recibido tu solicitud de eliminación de cuenta",
        texto: [
          `Hola${usuario.name ? ` ${usuario.name}` : ""},`,
          "",
          "Hemos recibido tu solicitud de eliminar tu cuenta de NÚCLEA.",
          "",
          resumen.seBorran.length > 0
            ? `Se borrarán ${resumen.seBorran.length} cápsula(s) tuya(s) con todo su contenido, sin posibilidad de recuperarlas.`
            : "No tienes cápsulas propias pendientes de borrar.",
          resumen.seQuedan.length > 0
            ? `Hay ${resumen.seQuedan.length} cápsula(s) que ya entregaste: su contenido es de quien las recibió y seguirá siéndolo. De tu cuenta no quedará ningún dato personal.`
            : "",
          "",
          "Si NO has sido tú, responde a este correo cuanto antes y no borraremos nada.",
          "",
          `NÚCLEA · ${CORREO_SOPORTE}`,
        ]
          .filter((linea) => linea !== "")
          .join("\n"),
      });
    }

    return { estado: "enviada", verificada: true };
  }

  const correo = (datos.correo ?? "").trim().toLowerCase();
  if (!FORMATO_CORREO.test(correo)) {
    return { estado: "error", mensaje: "Escribe una dirección de correo válida." };
  }

  // El límite va por origen de la petición, no por el correo escrito: si fuera
  // por correo, cambiar una letra bastaría para volver a mandar.
  if (!(await dentroDelLimite(`web:borrado:origen:${await huellaDelOrigen()}`, 5, 60))) {
    return {
      estado: "error",
      mensaje: `Demasiadas solicitudes seguidas. Escríbenos a ${CORREO_SOPORTE}.`,
    };
  }

  const avisado = await avisarASoporte({
    asunto: "Eliminación de cuenta (web) — sin sesión, por verificar",
    texto: [
      "SOLICITUD DE ELIMINACIÓN DE CUENTA — vía web, SIN sesión.",
      "",
      `Dirección indicada: ${correo}`,
      "",
      "IDENTIDAD NO ACREDITADA. Verificar antes de borrar nada: escribir a esa",
      "dirección y esperar respuesta, o pedir que lo haga desde la aplicación.",
      "",
      "Ejecutar con DELETE /api/mobile/me/delete de nuclea-servidor.",
    ].join("\n"),
    responderA: correo,
  });

  if (!avisado) {
    return {
      estado: "error",
      mensaje:
        "No hemos podido registrar la solicitud. Escríbenos a " +
        `${CORREO_SOPORTE} y lo hacemos a mano.`,
    };
  }

  return { estado: "enviada", verificada: false };
}

function remitente(): string {
  // El mismo remitente que el correo de entrega de cápsulas: es el dominio que
  // está verificado en Resend, y uno sin verificar no sale del servidor.
  const dominio = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
  return `Nuclea <${dominio}>`;
}

async function enviarCorreo(datos: {
  para: string;
  asunto: string;
  texto: string;
  responderA?: string;
}): Promise<boolean> {
  try {
    const { error } = await resend.emails.send({
      from: remitente(),
      to: datos.para,
      subject: datos.asunto,
      text: datos.texto,
      replyTo: datos.responderA,
    });
    return !error;
  } catch {
    return false;
  }
}

async function avisarASoporte(datos: {
  asunto: string;
  texto: string;
  responderA?: string;
}): Promise<boolean> {
  return enviarCorreo({ para: CORREO_SOPORTE, ...datos });
}

/**
 * Límite de peticiones sobre la tabla `rate_limits`, que ya existe en el
 * esquema. En memoria no serviría: en serverless cada petición puede caer en
 * una instancia distinta y un contador local no limitaría nada.
 */
async function dentroDelLimite(
  clave: string,
  maximo: number,
  ventanaMinutos: number,
): Promise<boolean> {
  const ahora = new Date();
  const expiresAt = new Date(ahora.getTime() + ventanaMinutos * 60_000);

  try {
    const ventana = await prisma.rateLimit.findUnique({ where: { key: clave } });

    if (!ventana || ventana.expiresAt <= ahora) {
      await prisma.rateLimit.upsert({
        where: { key: clave },
        create: { key: clave, count: 1, expiresAt },
        update: { count: 1, expiresAt },
      });
      return true;
    }

    if (ventana.count >= maximo) return false;

    await prisma.rateLimit.update({
      where: { key: clave },
      data: { count: { increment: 1 } },
    });
    return true;
  } catch {
    // Si la base no contesta, no se bloquea a nadie: el coste de no limitar es
    // un correo de más a soporte; el de bloquear es que alguien no pueda pedir
    // el borrado de sus datos, que es un derecho.
    return true;
  }
}

/**
 * Huella del origen de la petición, para el contador.
 *
 * Es un resumen recortado de la IP, no la IP. Y no es anonimización: el espacio
 * de IPv4 es pequeño y un resumen se puede recorrer por fuerza bruta. Lo que sí
 * hace es minimizar, que es lo que se busca: `rate_limits` es una tabla de una
 * base que comparten tres despliegues, y no tiene por qué haber en ella una
 * lista legible de direcciones de quien pide el borrado de sus datos.
 */
async function huellaDelOrigen(): Promise<string> {
  const cabeceras = await headers();
  const origen =
    cabeceras.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    cabeceras.get("x-real-ip") ||
    "desconocido";

  const resumen = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(origen),
  );
  return Array.from(new Uint8Array(resumen))
    .slice(0, 8)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
