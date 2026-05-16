import { GetObjectCommand } from "@aws-sdk/client-s3";
import r2Client from "@/lib/r2";
import { NextResponse } from "next/server";

/**
 * Proxy for R2 media files (audio, video).
 * Serves the file from the server with CORS headers so Safari/iOS can
 * load <audio> and <video> elements without a CORS error.
 *
 * Usage: /api/media/<key>  where key = R2 object key (e.g. userId/capsuleId/audio/file.m4a)
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key: keySegments } = await params;
    const key = keySegments.join("/");

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
      "Cache-Control": "public, max-age=31536000, immutable",
    });

    if (object.ContentLength) {
      headers.set("Content-Length", String(object.ContentLength));
    }

    // AWS SDK v3 Body supports transformToWebStream() in Node.js 18+
    const stream = object.Body.transformToWebStream();

    return new NextResponse(stream, { headers });
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
