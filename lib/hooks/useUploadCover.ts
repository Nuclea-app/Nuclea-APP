"use client";

import { useState } from "react";
import { updateCapsuleCover } from "@/lib/actions/capsuleActions";
import { toProxiedMediaUrl } from "@/lib/utils";

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
      // Se guarda la CLAVE relativa, no la URL del dominio publico del bucket.
      // Ese dominio sirve cualquier objeto a quien tenga el enlace, sin
      // autenticarse (comprobado: devuelve 200 y el contenido en claro), asi
      // que esta a punto de apagarse; lo que se guardara con la URL puesta
      // naceria roto. La clave se resuelve al pintar con toProxiedMediaUrl, que
      // ya admite las dos formas.
      const result = await updateCapsuleCover(capsuleId, key);
      if (!result.success) throw new Error(result.error);

      // Hacia fuera se devuelve ya resuelta: quien llama la pinta al momento
      // como vista previa y una clave relativa a secas daria un 404.
      return { success: true, url: toProxiedMediaUrl(key) ?? key };
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
