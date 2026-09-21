import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/lib/r2";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Public media proxy for capsule delivery recipients.
 * Validates the delivery token and serves R2 media without requiring auth.
 * Usage: /api/media/delivery/<token>/<key>
 */
export async function GET(
  req: Request,
  {
    params,
  }: { params: Promise<{ token: string; key: string[] }> }
) {
  try {
    const { token, key: keySegments } = await params;
    const key = keySegments.join("/");

    // Entregada de verdad y con el enlace vivo. Sin esto, el token que nacía
    // con el BORRADOR de destinatario servía los recuerdos de una cápsula que
    // todavía no se había enviado, y sin caducar nunca.
    const delivery = await prisma.capsuleDelivery.findFirst({
      where: {
        token,
        deliveredAt: { not: null },
        tokenExpiresAt: { not: null, gt: new Date() },
      },
      select: { capsuleId: true, capsule: { select: { userId: true } } },
    });
    if (!delivery) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // La clave es userId/capsuleId/tipo/archivo. Comprobar solo el userId
    // dejaba que quien recibía una cápsula leyera los archivos de CUALQUIER
    // otra cápsula de la misma persona cambiando el segundo segmento.
    if (
      keySegments[0] !== delivery.capsule.userId ||
      keySegments[1] !== delivery.capsuleId
    ) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const rangeHeader = req.headers.get("Range");

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
      ...(rangeHeader ? { Range: rangeHeader } : {}),
    });

    const object = await r2Client.send(command);
    if (!object.Body) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const isPartial = !!(rangeHeader && object.ContentRange);
    const status = isPartial ? 206 : 200;

    // Nada de comodín y nada de caché pública: con `public, max-age=3600` un
    // recuerdo seguía sirviéndose desde cualquier caché intermedia una hora
    // después de retirarle el acceso, y con `*` lo leía cualquier web.
    const headers = new Headers({
      "Content-Type": object.ContentType ?? "application/octet-stream",
      "Access-Control-Allow-Origin": origenDeEntrega(),
      Vary: "Origin",
      "Cache-Control": "private, no-store",
      "Accept-Ranges": "bytes",
    });
    if (object.ContentLength) {
      headers.set("Content-Length", String(object.ContentLength));
    }
    if (isPartial) {
      headers.set("Content-Range", object.ContentRange!);
    }

    return new NextResponse(object.Body.transformToWebStream(), { status, headers });
  } catch (error) {
    console.error("[delivery-media-proxy] Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": origenDeEntrega(),
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    },
  });
}

/**
 * El único sitio que puede leer estos medios desde el navegador.
 *
 * Se lee de NEXT_PUBLIC_APP_URL y, si no está, del sitio público: un comodín
 * aquí significa «cualquier web puede pedir los recuerdos de alguien con el
 * enlace», que es justo lo que había.
 */
function origenDeEntrega(): string {
  const origen = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.nuclea.app";
  return origen.replace(/\/+$/, "");
}
