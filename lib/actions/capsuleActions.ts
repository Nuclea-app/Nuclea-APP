"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function getAuthUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function updateCapsuleCover(capsuleId: string, url: string) {
  const userId = await getAuthUserId();
  if (!userId) return { success: false as const, error: "No autorizado" };

  try {
    const updated = await prisma.capsule.updateMany({
      where: { id: capsuleId, userId },
      data: { coverUrl: url },
    });
    if (updated.count === 0) return { success: false as const, error: "Cápsula no encontrada" };
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (error) {
    console.error("Error updating capsule cover:", error);
    return { success: false as const, error: "No se pudo actualizar la portada" };
  }
}

export async function updateCapsuleName(capsuleId: string, name: string) {
  if (!name || name.trim().length < 2) {
    return { success: false as const, error: "El nombre debe tener al menos 2 caracteres" };
  }

  const userId = await getAuthUserId();
  if (!userId) return { success: false as const, error: "No autorizado" };

  try {
    const updated = await prisma.capsule.updateMany({
      where: { id: capsuleId, userId },
      data: { name: name.trim() },
    });
    if (updated.count === 0) return { success: false as const, error: "Cápsula no encontrada" };
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (error) {
    console.error("Error updating capsule name:", error);
    return { success: false as const, error: "No se pudo actualizar el nombre" };
  }
}

export async function updateCapsuleDescription(
  capsuleId: string,
  description: string,
) {
  const trimmed = description.trim();
  if (trimmed.length > 200) {
    return { success: false as const, error: "La frase no puede superar los 200 caracteres" };
  }

  const userId = await getAuthUserId();
  if (!userId) return { success: false as const, error: "No autorizado" };

  try {
    const updated = await prisma.capsule.updateMany({
      where: { id: capsuleId, userId },
      data: { description: trimmed || null },
    });
    if (updated.count === 0) return { success: false as const, error: "Cápsula no encontrada" };
    revalidatePath("/dashboard");
    return { success: true as const };
  } catch (error) {
    console.error("Error updating capsule description:", error);
    return { success: false as const, error: "No se pudo actualizar la frase" };
  }
}
