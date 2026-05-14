"use server";

import prisma from "@/lib/prisma";
import { resend, buildCapsuleEmailHtml } from "@/lib/resend";
import { auth } from "@/auth";

export async function createDelivery(data: {
  capsuleId: string;
  recipientName: string;
  relation: string;
  relationCustom?: string;
  email?: string;
  phone?: string;
}) {
  try {
    const delivery = await prisma.capsuleDelivery.create({
      data: {
        capsuleId: data.capsuleId,
        recipientName: data.recipientName,
        relation: data.relation,
        relationCustom: data.relationCustom,
        email: data.email,
        phone: data.phone,
      },
      include: {
        capsule: {
          include: { user: { select: { name: true } } },
        },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://nuclea.app";
    const capsuleUrl = `${baseUrl}/capsula/${delivery.token}`;

    // Enviar email si se proporcionó uno
    if (data.email) {
      await sendCapsuleEmail({
        to: data.email,
        recipientName: data.recipientName,
        senderName: delivery.capsule.user?.name ?? undefined,
        capsuleUrl,
      });
    }

    return { success: true, token: delivery.token, capsuleUrl };
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
}) {
  const fromDomain = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

  try {
    await resend.emails.send({
      from: `NUCLEA <${fromDomain}>`,
      to: params.to,
      subject: "✦ Alguien te envió una cápsula",
      html: buildCapsuleEmailHtml({
        recipientName: params.recipientName,
        senderName: params.senderName,
        capsuleUrl: params.capsuleUrl,
      }),
    });
  } catch (error) {
    // No bloquear la entrega si el email falla
    console.error("Error sending capsule email:", error);
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

export async function getDeliveriesForCapsule(capsuleId: string) {
  try {
    return await prisma.capsuleDelivery.findMany({
      where: { capsuleId },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching deliveries:", error);
    return [];
  }
}
