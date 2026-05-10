"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateCapsuleCover(capsuleId: string, url: string) {
  try {
    await prisma.capsule.update({
      where: { id: capsuleId },
      data: { coverUrl: url },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating capsule cover:", error);
    return { success: false, error: "Failed to update cover" };
  }
}

export async function updateCapsuleName(capsuleId: string, name: string) {
  if (!name || name.trim().length < 2) {
    return { success: false, error: "El nombre debe tener al menos 2 caracteres" };
  }

  try {
    await prisma.capsule.update({
      where: { id: capsuleId },
      data: { name: name.trim() },
    });
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error updating capsule name:", error);
    return { success: false, error: "No se pudo actualizar el nombre" };
  }
}
