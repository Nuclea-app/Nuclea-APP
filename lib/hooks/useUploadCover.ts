"use client";

import { useState } from "react";
import { updateCapsuleCover } from "@/lib/actions/capsuleActions";

export const useUploadCover = (capsuleId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadCover = async (file: File) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Pedir presigned URL
      const res = await fetch("/api/upload/presigned", {
        method: "POST",
        body: JSON.stringify({
          capsuleId,
          tipo: "COVER",
          filename: `cover-${Date.now()}.jpg`, // Evitar cache con nombre dinámico
          contentType: file.type,
        }),
      });

      const { uploadUrl, key, error: apiError } = await res.json();
      if (apiError) throw new Error(apiError);

      // 2. Subir directo a R2
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            setProgress(Math.round((event.loaded / event.total) * 100));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) resolve(true);
          else reject(new Error("Fallo en la subida a R2"));
        };

        xhr.onerror = () => reject(new Error("Error de red"));
        xhr.send(file);
      });

      // 3. Actualizar en DB
      const fileUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
      const result = await updateCapsuleCover(capsuleId, fileUrl);
      if (!result.success) throw new Error(result.error);

      return { success: true, url: fileUrl };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al subir la imagen";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadCover, isUploading, progress, error };
};
