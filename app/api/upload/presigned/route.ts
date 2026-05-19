import { auth } from "@/auth";
import { generatePresignedUploadUrl, buildR2Key } from "@/lib/r2";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// Allowed memory types mapped to R2 directory names
const TIPO_TO_R2: Record<string, string> = {
  photo: "image",
  video: "video",
  audio: "audio",
  note: "note",
  drawing: "image",
  cover: "cover",
};

// Sanitize filename: keep only safe characters, strip path separators
function sanitizeFilename(name: string): string {
  return name
    .replace(/[^\w\s.\-]/g, "") // keep word chars, spaces, dots, dashes
    .replace(/\s+/g, "_")        // spaces → underscores
    .replace(/\.{2,}/g, ".")     // collapse multiple dots (path traversal)
    .slice(0, 200);              // max length
}

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

    // Validate tipo against whitelist
    const r2Type = TIPO_TO_R2[tipo.toLowerCase()];
    if (!r2Type) {
      return NextResponse.json({ error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    // Sanitize filename to prevent path traversal
    const safeFilename = sanitizeFilename(filename);
    if (!safeFilename) {
      return NextResponse.json({ error: "Nombre de archivo inválido" }, { status: 400 });
    }

    // Verify that the capsule belongs to the authenticated user
    const capsule = await prisma.capsule.findUnique({
      where: { id: capsuleId, userId: session.user.id },
      select: { id: true },
    });

    if (!capsule) {
      return NextResponse.json({ error: "Cápsula no encontrada" }, { status: 404 });
    }

    const key = buildR2Key(
      session.user.id,
      capsuleId,
      r2Type as "image" | "video" | "audio" | "note",
      safeFilename,
    );
    const uploadUrl = await generatePresignedUploadUrl(key, contentType);

    return NextResponse.json({ uploadUrl, key });
  } catch (error) {
    console.error("Presigned URL error:", error);
    return NextResponse.json({ error: "Error generando la URL de subida" }, { status: 500 });
  }
}
