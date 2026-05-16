import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a direct R2 public URL to the internal /api/media proxy URL.
 * Use this for <audio> and <video> elements to avoid CORS issues on Safari/iOS.
 */
export function toProxiedMediaUrl(fileUrl: string | null | undefined): string | null {
  if (!fileUrl) return null;
  const base = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (!base || !fileUrl.startsWith(base)) return fileUrl;
  const key = fileUrl.slice(base.length).replace(/^\//, "");
  return `/api/media/${key}`;
}
