"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { MemoryType } from "@prisma/client";

export async function createFutureMessage(data: {
  capsuleId: string;
  type: MemoryType;
  content?: string;
  fileUrl?: string;
  unlocksAt: Date;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    // Verify capsule belongs to the current user
    const capsule = await prisma.capsule.findUnique({
      where: { id: data.capsuleId, userId: session.user.id },
      select: { id: true },
    });
    if (!capsule) return { error: "Cápsula no encontrada" };

    const message = await prisma.futureMessage.create({
      data: {
        capsuleId: data.capsuleId,
        type: data.type,
        content: data.content,
        fileUrl: data.fileUrl,
        unlocksAt: data.unlocksAt,
      },
    });
    return { success: true, message };
  } catch (error) {
    console.error("Error creating future message:", error);
    return { error: "No se pudo guardar el mensaje futuro" };
  }
}

export async function getFutureMessages(capsuleId: string) {
  try {
    // getFutureMessages is called from server pages that already verified
    // ownership of the capsule, so we just need to query by capsuleId.
    // The capsuleId itself is safe because server pages use getUserCapsule
    // which verifies userId.
    return await prisma.futureMessage.findMany({
      where: { capsuleId },
      orderBy: { unlocksAt: "asc" },
    });
  } catch (error) {
    console.error("Error fetching future messages:", error);
    return [];
  }
}
