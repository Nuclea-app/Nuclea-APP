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
  _req: Request,
  {
    params,
  }: { params: Promise<{ token: string; key: string[] }> }
) {
  try {
    const { token, key: keySegments } = await params;
    const key = keySegments.join("/");

    // Validate delivery token exists and get capsule owner's userId
    const delivery = await prisma.capsuleDelivery.findUnique({
      where: { token },
      select: { capsule: { select: { userId: true } } },
    });
    if (!delivery) {
      return new NextResponse("Not Found", { status: 404 });
    }

    // R2 key starts with ownerId — verify it belongs to this capsule
    if (keySegments[0] !== delivery.capsule.userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: key,
    });

    const object = await r2Client.send(command);
    if (!object.Body) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const headers = new Headers({
      "Content-Type": object.ContentType ?? "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600",
    });
    if (object.ContentLength) {
      headers.set("Content-Length", String(object.ContentLength));
    }

    return new NextResponse(object.Body.transformToWebStream(), { headers });
  } catch (error) {
    console.error("[delivery-media-proxy] Error:", error);
    return new NextResponse("Error", { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
