"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [phase, setPhase] = useState<
    "visible" | "split" | "polaroids" | "exit"
  >("visible");
  const [splitX, setSplitX] = useState(120); // Valor inicial robusto para el renderizado del servidor

  useEffect(() => {
    // Calcular splitX dinámico del lado del cliente
    const calculateSplit = () => {
      const vw = window.innerWidth;
      // cada mitad ocupa ~43% del ancho
      // queremos que se separen pero queden al menos 10px dentro del viewport
      const capsuleHalfWidth = vw * 0.43;
      const maxSplit = vw / 2 - capsuleHalfWidth / 2 - 10;
      return Math.min(maxSplit, 260);
    };

    requestAnimationFrame(() => {
      setSplitX(calculateSplit());
    });

    // Timings de la animación basados en estados declarativos
    const timerSplit = setTimeout(() => setPhase("split"), 400);
    const timerPolaroids = setTimeout(() => setPhase("polaroids"), 1000); // 600ms después del split
    const timerExit = setTimeout(() => setPhase("exit"), 2000); // Hold de ~800ms tras terminar de entrar
    const timerComplete = setTimeout(() => onComplete(), 3000); // 800ms para que termine la animación de salida

    return () => {
      clearTimeout(timerSplit);
      clearTimeout(timerPolaroids);
      clearTimeout(timerExit);
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      <motion.div
        initial="visible"
        variants={{
          visible: { y: 0, opacity: 1 },
          split: { y: 0, opacity: 1 },
          polaroids: { y: 0, opacity: 1 },
          exit: { y: -80, opacity: 0 },
        }}
        animate={phase}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative flex flex-col items-center"
      >
        {/* Cápsula */}
        <div className="relative flex items-center justify-center">
          <motion.div
            initial="visible"
            style={{ width: "37.3vw", maxWidth: 186 }}
            variants={{
              visible: { x: 0, opacity: 1 },
              split: { x: -splitX, opacity: 1 },
              polaroids: { x: -splitX, opacity: 1 },
              exit: { x: -splitX, opacity: 1 }, // Solo el contenedor sube
            }}
            animate={phase}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 32,
              mass: 1.2,
            }}
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
            initial="visible"
            style={{
              width: "49vw",
              maxWidth: 260,
              marginTop: 0,
              marginLeft: -2,
            }}
            variants={{
              visible: { x: 0, opacity: 1 },
              split: { x: splitX * 1.4, opacity: 1 },
              polaroids: { x: splitX * 1.4, opacity: 1 },
              exit: { x: splitX * 1.4, opacity: 1 }, // Solo el contenedor sube
            }}
            animate={phase}
            transition={{
              type: "spring",
              stiffness: 180,
              damping: 32,
              mass: 1.2,
            }}
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

        {/* Polaroids — aparecen desde el centro */}
        <div
          className="absolute flex gap-2 items-end justify-center pointer-events-none"
          style={{ top: "50%", transform: "translateY(-50%)" }}
        >
          {/* Polaroid Izquierdo */}
          <motion.div
            initial="visible"
            variants={{
              visible: { opacity: 0, x: -80, rotate: 0, scale: 0.8 },
              split: { opacity: 0, x: -80, rotate: 0, scale: 0.8 },
              polaroids: { opacity: 1, x: 0, rotate: -8, scale: 1 },
              exit: { opacity: 1, x: 0, rotate: -8, scale: 1 }, // Solo el contenedor sube
            }}
            animate={phase}
            transition={{ type: "spring", stiffness: 280, damping: 22 }}
            className="polaroid opacity-0"
          >
            <div
              style={{
                width: 75,
                height: 95,
                background: "#1a1a1a",
                border: "3px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 16,
              }}
            >
              ✦
            </div>
          </motion.div>

          {/* Polaroid Central */}
          <motion.div
            initial="visible"
            variants={{
              visible: { opacity: 0, y: 20, rotate: 0, scale: 0.8 },
              split: { opacity: 0, y: 20, rotate: 0, scale: 0.8 },
              polaroids: { opacity: 1, y: 0, rotate: 2, scale: 1 },
              exit: { opacity: 1, y: 0, rotate: 2, scale: 1 }, // Solo el contenedor sube
            }}
            animate={phase}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
              delay: 0.1,
            }}
            className="polaroid opacity-0"
          >
            <div
              style={{
                width: 75,
                height: 95,
                background: "#1a1a1a",
                border: "3px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 16,
              }}
            >
              ✦
            </div>
          </motion.div>

          {/* Polaroid Derecho */}
          <motion.div
            initial="visible"
            variants={{
              visible: { opacity: 0, x: 80, rotate: 0, scale: 0.8 },
              split: { opacity: 0, x: 80, rotate: 0, scale: 0.8 },
              polaroids: { opacity: 1, x: 0, rotate: 6, scale: 1 },
              exit: { opacity: 1, x: 0, rotate: 6, scale: 1 }, // Solo el contenedor sube
            }}
            animate={phase}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 22,
              delay: 0.2,
            }}
            className="polaroid opacity-0"
          >
            <div
              style={{
                width: 75,
                height: 95,
                background: "#1a1a1a",
                border: "3px solid white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 16,
              }}
            >
              ✦
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
