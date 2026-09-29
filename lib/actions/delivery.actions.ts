"use server";

import { randomBytes } from "node:crypto";

import { Prisma } from "@prisma/client";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { codigoParaMostrar, generarCodigoDeAcceso } from "@/lib/codigoDeAcceso";
import { resend, buildCapsuleEmailHtml, buildCapsuleEmailText } from "@/lib/resend";

export async function createDelivery(data: {
  capsuleId: string;
  recipientName: string;
  relation: string;
  relationCustom?: string;
  emails: string[];
  phone?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    // Verify the capsule belongs to the current user — one check for all emails
    const capsule = await prisma.capsule.findUnique({
      where: { id: data.capsuleId, userId: session.user.id },
      select: { id: true },
    });
    if (!capsule) return { error: "Cápsula no encontrada" };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nuclea.app";

    // 1. Create all delivery records in the DB first
    //
    // El token y las tres fechas se escriben AQUÍ, a mano. Antes el token lo
    // ponía la base (@default(cuid())) y deliveredAt no se escribía nunca: la
    // fila que esta función crea es una entrega de verdad —el correo con el
    // enlace sale en el mismo paso— pero en la base parecía un borrador, y un
    // borrador es justo lo que ya no abre nada.
    //
    // El token es aleatorio de 32 bytes, no un cuid: un cuid lleva dentro la
    // marca de tiempo y un contador, así que dos seguidos se parecen, y eso
    // es lo único que separa a un desconocido del contenido de la cápsula.
    const ahora = new Date();
    const caduca = new Date(ahora.getTime() + 30 * 24 * 60 * 60 * 1000);

    const deliveries = await Promise.all(
      data.emails
        .map((e) => e.trim())
        .filter(Boolean)
        .map((email) =>
          crearConCodigoUnico({
            capsuleId: data.capsuleId,
            recipientName: data.recipientName,
            relation: data.relation,
            relationCustom: data.relationCustom,
            email,
            phone: data.phone,
            token: randomBytes(32).toString("base64url"),
            deliveredAt: ahora,
            tokenIssuedAt: ahora,
            tokenExpiresAt: caduca,
          })
        )
    );

    // 2. Send all emails in a single Resend batch request
    const envio = await sendBatchCapsuleEmails(
      deliveries.map((d) => ({
        to: d.email!,
        capsuleUrl: `${baseUrl}/capsula/${d.token}`,
        accessCode: codigoParaMostrar(d.accessCode!),
        openUrl: `${baseUrl}/abrir`,
      }))
    );

    // Las entregas YA están guardadas y sus enlaces sirven; lo que falló es el
    // correo. Se devuelve como error igualmente, porque la pantalla de éxito
    // dice «la hemos enviado» y eso sería mentira: quien entrega tiene que
    // saber que la otra persona no va a recibir nada.
    if (!envio.ok) {
      return {
        error:
          "La entrega se ha guardado, pero el correo no ha podido salir. " +
          "Vuelve a intentarlo en unos minutos o escríbenos.",
      };
    }

    return {
      success: true,
      results: deliveries.map((d) => ({
        token: d.token,
        capsuleUrl: `${baseUrl}/capsula/${d.token}`,
        email: d.email!,
      })),
    };
  } catch (error) {
    console.error("Error creating delivery:", error);
    return { error: "No se pudo guardar la entrega" };
  }
}

/**
 * Crea la fila de la entrega con su código de «Abrir una cápsula».
 *
 * El código es único en la base. Con 59 bits de azar dos iguales no van a
 * salir, pero si salieran el índice único rechaza el segundo y aquí se
 * reintenta con otro, en vez de fallar la entrega entera por mala suerte.
 */
async function crearConCodigoUnico(datos: Omit<Prisma.CapsuleDeliveryUncheckedCreateInput, "accessCode">) {
  for (let intento = 0; ; intento++) {
    try {
      return await prisma.capsuleDelivery.create({
        data: { ...datos, accessCode: generarCodigoDeAcceso() },
      });
    } catch (e) {
      const choque =
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002" &&
        String(e.meta?.target ?? "").includes("access_code");
      if (!choque || intento >= 3) throw e;
    }
  }
}

async function sendBatchCapsuleEmails(
  emails: { to: string; capsuleUrl: string; accessCode: string; openUrl: string }[]
): Promise<{ ok: boolean }> {
  if (emails.length === 0) return { ok: true };

  const fromDomain = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    // EL SDK DE RESEND NO LANZA CUANDO FALLA: devuelve `{ data: null, error }`.
    // Antes esto solo miraba el catch, así que un envío rechazado (remitente
    // sin verificar, clave caducada) pasaba por enviado y la pantalla decía
    // «enviada» a una cápsula cuyo correo no había salido.
    const { error } = await resend.batch.send(
      emails.map((params) => ({
        from: `Nuclea <${fromDomain}>`,
        to: params.to,
        replyTo: fromDomain,
        // No dice quién la manda ni qué hay dentro (Andrea, 01:03:31).
        subject: "Alguien te envió una cápsula de recuerdos",
        text: buildCapsuleEmailText(params),
        html: buildCapsuleEmailHtml(params),
        headers: {
          "List-Unsubscribe": `<mailto:${fromDomain}?subject=unsubscribe>`,
          "X-Entity-Ref-ID": `nuclea-delivery-${Date.now()}`,
        },
      }))
    );
    if (error) {
      console.error("Resend rechazó el lote de entrega:", error.name, error.message);
      return { ok: false };
    }
    return { ok: true };
  } catch (error) {
    console.error("Error sending capsule email batch:", error);
    return { ok: false };
  }
}

/*
 * AQUÍ ESTABA `getDeliveryByToken`, y se quitó a propósito.
 *
 * Devolvía la cápsula entera —recuerdos, mensajes futuros con su contenido,
 * el correo y el teléfono de quien recibe— a cualquiera que tuviera el enlace,
 * sin pedir nombre ni código. Y al estar en un fichero "use server" era una
 * acción de servidor: se podía llamar desde fuera con un POST, sin pasar por
 * ninguna página. Tampoco podía enseñar nada de la Fase 2, porque los ficheros
 * van cifrados y quien los descifra es nuclea-servidor.
 *
 * Quien recibe una cápsula la lee ahora del servidor, después del nombre y el
 * código del correo: ver lib/entrega/cliente.ts y
 * components/entrega/EntregaProvider.tsx.
 */
