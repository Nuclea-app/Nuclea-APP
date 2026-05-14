"use server";

import prisma from "@/lib/prisma";
import { MemoryType } from "@prisma/client";

export async function createFutureMessage(data: {
  capsuleId: string;
  type: MemoryType;
  content?: string;
  fileUrl?: string;
  unlocksAt: Date;
}) {
  try {
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
    return await prisma.futureMessage.findMany({
      where: { capsuleId },
      orderBy: { unlocksAt: "asc" },
    });
  } catch (error) {
    console.error("Error fetching future messages:", error);
    return [];
  }
}
