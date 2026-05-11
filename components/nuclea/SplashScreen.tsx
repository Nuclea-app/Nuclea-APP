"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<"visible" | "exit">("visible");

  const handleClick = () => {
    if (phase === "exit") return;
    setPhase("exit");

    // Esperamos a que termine la animación de salida (fade-out)
    // para notificar al padre y que se desmonte este componente
    setTimeout(() => {
      onComplete();
    }, 600);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background cursor-pointer"
      initial="visible"
      animate={phase}
      variants={{
        visible: { opacity: 1 },
        exit: { opacity: 0 },
      }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
      onClick={handleClick}
    >
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.77, 0, 0.175, 1] }}
        whileHover={{
          scale: 1.05,
          transition: { duration: 0.4, ease: [0.77, 0, 0.175, 1] },
        }}
        whileTap={{
          scale: 0.98,
          transition: { duration: 0.2, ease: [0.77, 0, 0.175, 1] },
        }}
      >
        <Image
          src="/nuclea-logo.png"
          alt="Nuclea Logo"
          width={440}
          height={146}
          priority
          className="w-[260px] sm:w-[440px] h-auto object-contain"
        />
        <p className="mt-8 text-[10px] font-sans tracking-[0.3em] uppercase text-foreground/40 animate-pulse">
          Click para entrar
        </p>
      </motion.div>
    </motion.div>
  );
}
