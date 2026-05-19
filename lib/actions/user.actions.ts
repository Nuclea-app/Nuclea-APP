"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

async function requireSelf(userId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "No autorizado" as const };
  if (session.user.id !== userId) return { error: "No autorizado" as const };
  return { session };
}

export async function updateUserName(userId: string, name: string) {
  const check = await requireSelf(userId);
  if ("error" in check) return check;

  const trimmed = name.trim();
  if (!trimmed) return { error: "El nombre no puede estar vacío" };

  try {
    await prisma.user.update({ where: { id: userId }, data: { name: trimmed } });
    return { success: true, name: trimmed };
  } catch {
    return { error: "No se pudo actualizar el nombre" };
  }
}

export async function updateUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string
) {
  const check = await requireSelf(userId);
  if ("error" in check) return check;

  if (newPassword.length < 8)
    return { error: "La contraseña debe tener al menos 8 caracteres" };

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "Usuario no encontrado" };

    if (!user.password) {
      // OAuth-only account: don't allow setting a password without explicit flow
      return { error: "Esta cuenta usa acceso con Google. No tiene contraseña asociada." };
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return { error: "La contraseña actual es incorrecta" };

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar la contraseña" };
  }
}

export async function updateUserBirthdate(userId: string, birthdate: string) {
  const check = await requireSelf(userId);
  if ("error" in check) return check;

  try {
    const date = new Date(birthdate + "T12:00:00");
    if (isNaN(date.getTime())) return { error: "Fecha inválida" };

    await prisma.user.update({ where: { id: userId }, data: { birthdate: date } });
    return { success: true };
  } catch {
    return { error: "No se pudo actualizar la fecha" };
  }
}

export async function getUserStats(userId: string) {
  const check = await requireSelf(userId);
  if ("error" in check) return { capsulesCreated: 0, capsulesDelivered: 0 };

  try {
    const [capsulesCreated, capsulesDelivered] = await Promise.all([
      prisma.capsule.count({ where: { userId } }),
      prisma.capsuleDelivery.count({ where: { capsule: { userId } } }),
    ]);
    return { capsulesCreated, capsulesDelivered };
  } catch {
    return { capsulesCreated: 0, capsulesDelivered: 0 };
  }
}

export async function deleteCapsule(capsuleId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) return { error: "No autorizado" };

    const capsule = await prisma.capsule.findUnique({ where: { id: capsuleId } });
    if (!capsule || capsule.userId !== session.user.id)
      return { error: "Cápsula no encontrada" };

    await prisma.capsule.delete({ where: { id: capsuleId } });
    return { success: true };
  } catch {
    return { error: "No se pudo eliminar la cápsula" };
  }
}
