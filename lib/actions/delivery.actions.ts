"use server";

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

export async function getDeliveryByToken(token: string) {
  try {
    const delivery = await prisma.capsuleDelivery.findUnique({
      where: { token },
      include: {
        capsule: {
          include: {
            memories: { orderBy: { createdAt: "desc" } },
            user: { select: { name: true, image: true } },
            futureMessages: { select: { id: true, unlocksAt: true } },
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
