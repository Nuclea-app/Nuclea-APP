import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/lib/r2";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Authenticated proxy for R2 media files (audio, video).
 * Serves the file from the server with CORS headers so Safari/iOS can
 * load <audio> and <video> elements without a CORS error.
 *
 * Usage: /api/media/<key>  where key = R2 object key (userId/capsuleId/type/filename)
 * The first segment of the key must match the authenticated user's ID.
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { key: keySegments } = await params;
    const key = keySegments.join("/");

    // The R2 key structure is: userId/capsuleId/type/filename
    // Verify the userId segment matches the authenticated user
    const keyUserId = keySegments[0];
    if (keyUserId !== session.user.id) {
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

    const headers = new Headers({
      "Content-Type": object.ContentType ?? "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "private, max-age=3600",
      "Accept-Ranges": "bytes",
    });

    if (object.ContentLength) {
      headers.set("Content-Length", String(object.ContentLength));
    }
    if (isPartial) {
      headers.set("Content-Range", object.ContentRange!);
    }

    const stream = object.Body.transformToWebStream();
    return new NextResponse(stream, { status, headers });
  } catch (error) {
    console.error("[media-proxy] Error:", error);
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
