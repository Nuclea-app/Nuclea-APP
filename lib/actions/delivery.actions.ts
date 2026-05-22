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
    const results: { token: string; capsuleUrl: string; email: string; emailSent: boolean }[] = [];

    // Create one delivery per email and send each — sequentially to avoid race conditions
    for (const email of data.emails) {
      const trimmed = email.trim();
      if (!trimmed) continue;

      const delivery = await prisma.capsuleDelivery.create({
        data: {
          capsuleId: data.capsuleId,
          recipientName: data.recipientName,
          relation: data.relation,
          relationCustom: data.relationCustom,
          email: trimmed,
          phone: data.phone,
        },
      });

      const capsuleUrl = `${baseUrl}/capsula/${delivery.token}`;

      const emailSent = await sendCapsuleEmail({
        to: trimmed,
        recipientName: data.recipientName,
        senderName: capsule.user?.name ?? undefined,
        capsuleUrl,
      });

      results.push({ token: delivery.token, capsuleUrl, email: trimmed, emailSent });
    }

    return { success: true, results };
  } catch (error) {
    console.error("Error creating delivery:", error);
    return { error: "No se pudo guardar la entrega" };
  }
}

async function sendCapsuleEmail(params: {
  to: string;
  recipientName: string;
  senderName?: string;
  capsuleUrl: string;
}): Promise<boolean> {
  const fromDomain = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    await resend.emails.send({
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
    });
    return true;
  } catch (error) {
    // Don't block delivery if email fails — log and report back
    console.error("Error sending capsule email:", error);
    return false;
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
