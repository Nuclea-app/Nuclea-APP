import { useState } from "react";
import { MemoryType } from "@prisma/client";
import { createMemory } from "@/lib/actions/capsule.actions";

export const useUpload = (capsuleId: string) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File, tipo: MemoryType) => {
    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      // 1. Pedir presigned URL
      const res = await fetch("/api/upload/presigned", {
        method: "POST",
        body: JSON.stringify({
          capsuleId,
          tipo: tipo.toUpperCase(),
          filename: file.name,
          contentType: file.type,
        }),
      });

      const { uploadUrl, key, error: apiError } = await res.json();

      if (apiError) throw new Error(apiError);

      // 2. Subir directo a R2 con XHR para trackear progreso
      await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            setProgress(percentComplete);
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(true);
          } else {
            reject(new Error("Fallo en la subida a R2"));
          }
        };

        xhr.onerror = () => reject(new Error("Error de red al subir a R2"));
        xhr.send(file);
      });

      // 3. Guardar en DB
      const fileUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
      const dbResult = await createMemory({
        capsuleId,
        type: tipo,
        fileUrl,
      });

      if (dbResult.error) throw new Error(dbResult.error);

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al subir el archivo";
      console.error("Upload error:", err);
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const saveNote = async (content: string) => {
    setIsUploading(true);
    setError(null);

    try {
      const dbResult = await createMemory({
        capsuleId,
        type: MemoryType.NOTE,
        content,
      });

      if (dbResult.error) throw new Error(dbResult.error);

      return { success: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error al guardar la nota";
      setError(message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadFile,
    saveNote,
    isUploading,
    progress,
    error,
  };
};
