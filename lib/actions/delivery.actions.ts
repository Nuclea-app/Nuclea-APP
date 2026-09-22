"use server";

import { randomBytes } from "node:crypto";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
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
      include: { user: { select: { name: true } } },
    });
    if (!capsule) return { error: "Cápsula no encontrada" };

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nuclea.app";
    const senderName = capsule.user?.name ?? undefined;

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
          prisma.capsuleDelivery.create({
            data: {
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
            },
          })
        )
    );

    // 2. Send all emails in a single Resend batch request
    //    Resend queues and retries each one independently — no email gets lost
    await sendBatchCapsuleEmails(
      deliveries.map((d) => ({
        to: d.email!,
        recipientName: data.recipientName,
        senderName,
        capsuleUrl: `${baseUrl}/capsula/${d.token}`,
      }))
    );

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

async function sendBatchCapsuleEmails(
  emails: { to: string; recipientName: string; senderName?: string; capsuleUrl: string }[]
): Promise<void> {
  if (emails.length === 0) return;

  const fromDomain = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    await resend.batch.send(
      emails.map((params) => ({
        from: `Nuclea <${fromDomain}>`,
        to: params.to,
        replyTo: fromDomain,
        subject: "Alguien te envió una cápsula de recuerdos",
        text: buildCapsuleEmailText(params),
        html: buildCapsuleEmailHtml({
          recipientName: params.recipientName,
          senderName: params.senderName,
          capsuleUrl: params.capsuleUrl,
        }),
        headers: {
          "List-Unsubscribe": `<mailto:${fromDomain}?subject=unsubscribe>`,
          "X-Entity-Ref-ID": `nuclea-delivery-${Date.now()}`,
        },
      }))
    );
  } catch (error) {
    // Don't block delivery creation if email batch fails — deliveries are already saved
    console.error("Error sending capsule email batch:", error);
  }
}

/**
 * La cápsula que abre quien recibe el enlace.
 *
 * Las tres condiciones del where NO son de adorno:
 *
 *  - deliveredAt no nulo: hasta la Fase 2, el token nacía con el BORRADOR de
 *    destinatario (`token String @unique @default(cuid())`), así que cualquiera
 *    con ese enlace abría una cápsula que su dueña todavía no había enviado.
 *  - tokenExpiresAt no nulo Y EN EL FUTURO, las dos cosas. «No nulo» a secas
 *    deja pasar al borrador, que lo tiene nulo; y sin la segunda, el enlace no
 *    caduca nunca.
 *
 * Esta webapp está congelada, pero es una SEGUNDA PUERTA a la misma base y al
 * mismo bucket: arreglarlo solo en nuclea-servidor deja el agujero abierto.
 */
export async function getDeliveryByToken(token: string) {
  try {
    const ahora = new Date();
    const delivery = await prisma.capsuleDelivery.findFirst({
      where: {
        token,
        deliveredAt: { not: null },
        tokenExpiresAt: { not: null, gt: ahora },
      },
      include: {
        capsule: {
          include: {
            memories: { orderBy: { createdAt: "desc" } },
            user: { select: { name: true, image: true } },
            futureMessages: {
              select: { id: true, unlocksAt: true, type: true, content: true, fileUrl: true },
              orderBy: { unlocksAt: "asc" },
            },
          },
        },
      },
    });
    return delivery;
  } catch (error) {
    console.error("Error fetching delivery:", error);
    return null;
  }
}
