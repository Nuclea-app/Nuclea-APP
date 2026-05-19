"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { CapsuleType } from "@/lib/capsule-data";
import { MemoryType, CapsuleType as PrismaCapsuleType } from "@prisma/client";

const ALLOWED_CAPSULE_TYPES = ["LEGACY", "TOGETHER", "PET", "ORIGIN"] as const;

export async function getUserCapsule(userId: string, capsuleId?: string) {
  if (!userId) return null;
  try {
    const capsule = capsuleId
      ? await prisma.capsule.findUnique({
          where: { id: capsuleId, userId },
          include: {
            _count: { select: { memories: true } },
            memories: { take: 4, orderBy: { createdAt: "desc" } },
          },
        })
      : await prisma.capsule.findFirst({
          where: { userId },
          orderBy: { createdAt: "desc" },
          include: {
            _count: { select: { memories: true } },
            memories: { take: 4, orderBy: { createdAt: "desc" } },
          },
        });

    if (!capsule) return null;

    const favoritesCount = await prisma.memory.count({
      where: { capsuleId: capsule.id, isFavorite: true },
    });

    return { ...capsule, favoritesCount };
  } catch (error) {
    console.error("Error fetching capsule:", error);
    return null;
  }
}

export async function getUserCapsules(userId: string) {
  if (!userId) return [];
  try {
    return await prisma.capsule.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { memories: true } } },
    });
  } catch (error) {
    console.error("Error fetching capsules:", error);
    return [];
  }
}

export async function getFavoriteMemories(capsuleId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.memory.findMany({
      where: {
        capsuleId,
        isFavorite: true,
        capsule: { userId: session.user.id },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching favorite memories:", error);
    return [];
  }
}

export async function getAllMemories(capsuleId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.memory.findMany({
      where: {
        capsuleId,
        capsule: { userId: session.user.id },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching memories:", error);
    return [];
  }
}

export async function createCapsule(data: { type: CapsuleType; name: string; userId: string }) {
  try {
    const typeUpper = data.type.toUpperCase();
    if (!ALLOWED_CAPSULE_TYPES.includes(typeUpper as typeof ALLOWED_CAPSULE_TYPES[number])) {
      throw new Error(`Tipo de cápsula inválido: ${data.type}`);
    }

    const capsule = await prisma.capsule.create({
      data: {
        type: typeUpper as PrismaCapsuleType,
        name: data.name,
        userId: data.userId,
      }
    });

    return capsule;
  } catch (error) {
    console.error("Error creating capsule:", error);
    throw new Error("No se pudo crear la cápsula");
  }
}

export async function createMemory(data: {
  capsuleId: string;
  type: MemoryType;
  fileUrl?: string;
  content?: string;
  title?: string;
  description?: string;
  location?: string;
}) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    // Verify ownership
    const capsule = await prisma.capsule.findUnique({
      where: { id: data.capsuleId, userId: session.user.id },
      select: { id: true },
    });

    if (!capsule) {
      return { error: "Cápsula no encontrada" };
    }

    const memory = await prisma.memory.create({
      data: {
        capsuleId: data.capsuleId,
        type: data.type,
        fileUrl: data.fileUrl,
        content: data.content,
        title: data.title || null,
        description: data.description || null,
        location: data.location || null,
      },
    });

    return { success: true, memory };
  } catch (error) {
    console.error("Error creating memory:", error);
    return { error: "No se pudo guardar el recuerdo" };
  }
}

export async function toggleFavorite(memoryId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const memory = await prisma.memory.findUnique({
      where: { id: memoryId },
      include: { capsule: { select: { userId: true } } },
    });

    if (!memory) return { error: "Recuerdo no encontrado" };
    if (memory.capsule.userId !== session.user.id) return { error: "No autorizado" };

    const updated = await prisma.memory.update({
      where: { id: memoryId },
      data: { isFavorite: !memory.isFavorite }
    });
    return { success: true, isFavorite: updated.isFavorite };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { error: "No se pudo actualizar el recuerdo" };
  }
}
