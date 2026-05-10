import { auth } from "@/auth";
import { generatePresignedUploadUrl, buildR2Key } from "@/lib/r2";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { capsuleId, tipo, filename, contentType } = await req.json();

    if (!capsuleId || !tipo || !filename || !contentType) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    // Verificar que la cápsula pertenezca al usuario
    const capsule = await prisma.capsule.findUnique({
      where: {
        id: capsuleId,
        userId: session.user.id,
      },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Cápsula no encontrada o no pertenece al usuario" }, { status: 404 });
    }

    // Mapear el tipo de memoria al tipo de R2 (directorio)
    const r2Type = tipo.toLowerCase() === 'photo' ? 'image' : tipo.toLowerCase();
    
    const key = buildR2Key(session.user.id, capsuleId, r2Type, filename);
    const uploadUrl = await generatePresignedUploadUrl(key, contentType);

    return NextResponse.json({ uploadUrl, key });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return NextResponse.json({ error: "Error generando la URL de subida" }, { status: 500 });
  }
}
