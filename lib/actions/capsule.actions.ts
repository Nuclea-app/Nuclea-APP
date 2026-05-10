"use server";

import prisma from "@/lib/prisma";
import { CapsuleType } from "@/lib/capsule-data";
import { MemoryType, CapsuleType as PrismaCapsuleType } from "@prisma/client";

export async function getUserCapsule(userId: string) {
  try {
    const capsule = await prisma.capsule.findFirst({
      where: { userId },
      include: {
        _count: {
          select: { memories: true }
        },
        memories: {
          take: 4,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!capsule) return null;

    const favoritesCount = await prisma.memory.count({
      where: { capsuleId: capsule.id, isFavorite: true }
    });

    return {
      ...capsule,
      favoritesCount
    };
  } catch (error) {
    console.error("Error fetching capsule:", error);
    return null;
  }
}

import { cookies } from "next/headers";

export async function createCapsule(data: { type: CapsuleType; name: string; userId: string }) {
  try {
    const capsule = await prisma.capsule.create({
      data: {
        type: data.type.toUpperCase() as PrismaCapsuleType,
        name: data.name,
        userId: data.userId,
      }
    });

    try {
      const cookieStore = await cookies();
      cookieStore.delete("capsule_type");
    } catch (e) {
      // Ignorar si falla al borrar en algunos contextos
    }

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
}) {
  try {
    const capsule = await prisma.capsule.findUnique({
      where: { id: data.capsuleId },
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
    const memory = await prisma.memory.findUnique({
      where: { id: memoryId }
    });
    if (!memory) return { error: "Recuerdo no encontrado" };
    
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
