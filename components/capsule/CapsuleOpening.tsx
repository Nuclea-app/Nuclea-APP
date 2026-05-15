"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface CapsuleOpeningProps {
  onComplete: () => void;
}

/**
 * Animación de apertura de la cápsula del destinatario.
 * Fase 1 "preparando": la cápsula cerrada. Fase 2 "abriendo": las dos
 * mitades se separan. Al terminar se llama onComplete().
 */
export function CapsuleOpening({ onComplete }: CapsuleOpeningProps) {
  const [phase, setPhase] = useState<"preparando" | "abriendo">("preparando");
  const [splitX, setSplitX] = useState(120);

  useEffect(() => {
    const calculateSplit = () => {
      const vw = window.innerWidth;
      const capsuleHalfWidth = vw * 0.43;
      const maxSplit = vw / 2 - capsuleHalfWidth / 2 - 10;
      return Math.min(Math.max(maxSplit, 60), 200);
    };
    requestAnimationFrame(() => setSplitX(calculateSplit()));

    const toAbriendo = setTimeout(() => setPhase("abriendo"), 1600);
    const finish = setTimeout(() => onComplete(), 3300);

    return () => {
      clearTimeout(toAbriendo);
      clearTimeout(finish);
    };
  }, [onComplete]);

  const opening = phase === "abriendo";
  const text = opening ? "Abriendo recuerdos…" : "Preparando tu cápsula…";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      <div className="relative flex items-center justify-center mb-14">
        {/* Brillo al abrir */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          animate={{ opacity: opening ? 1 : 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="h-28 w-28 rounded-full bg-foreground/10 blur-2xl" />
        </motion.div>

        <motion.div
          initial={{ x: 0 }}
          style={{ width: "37.3vw", maxWidth: 160 }}
          animate={{ x: opening ? -splitX : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 30, mass: 1.1 }}
        >
          <Image
            src="/capsula-izquierda.png"
            alt=""
            width={658}
            height={1024}
            priority
            quality={100}
            sizes="37vw"
            style={{ width: "100%", height: "auto" }}
          />
        </motion.div>
        <motion.div
          initial={{ x: 0 }}
          style={{ width: "49vw", maxWidth: 210, marginLeft: -2 }}
          animate={{ x: opening ? splitX * 1.4 : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 30, mass: 1.1 }}
        >
          <Image
            src="/capsula-derecha.png"
            alt=""
            width={877}
            height={1024}
            priority
            quality={100}
            sizes="49vw"
            style={{ width: "100%", height: "auto" }}
          />
        </motion.div>
      </div>

      <motion.p
        key={phase}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="font-sans text-[14px] text-foreground/50 tracking-wide"
      >
        {text}
      </motion.p>
    </div>
  );
}
