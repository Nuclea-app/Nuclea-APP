"use server";

import { auth } from "@/auth";
import { createCapsule } from "./capsule.actions";
import { CapsuleType } from "@/lib/capsule-data";
import { redirect } from "next/navigation";

export async function createCapsuleAction(tipo: CapsuleType) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/register?callbackUrl=/dashboard`);
  }

  const name = session.user.name || "Mi Cápsula";

  try {
    await createCapsule({
      type: tipo,
      name: name,
      userId: session.user.id,
    });
  } catch (error) {
    console.error("Action error:", error);
    return { error: "No se pudo crear la cápsula" };
  }

  redirect("/dashboard/perfil");
}
