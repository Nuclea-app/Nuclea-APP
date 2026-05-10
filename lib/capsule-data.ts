import { Heart, Users, Calendar, Gift, PawPrint, Baby, Camera, MessageCircle } from "lucide-react";
import React from "react";

export type CapsuleType = 'legacy' | 'together' | 'pet' | 'origin';

export interface CapsuleFeature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface CapsuleData {
  id: CapsuleType;
  badge: string;
  title: string;
  description: string;
  features: CapsuleFeature[];
  ctaText: string;
  footerText: string;
}

export const CAPSULE_DATA: Record<CapsuleType, CapsuleData> = {
  legacy: {
    id: 'legacy',
    badge: 'LEGACY ✦',
    title: 'No es para ahora.\nEs para cuando más importe.',
    description: 'Guarda recuerdos, tu voz y mensajes futuros para las personas que más quieres. De esta manera, los tuyos siempre podrán tenerte cerca.',
    features: [
      {
        title: 'Lo que quieres decir',
        description: 'Mensajes, recuerdos, consejos o tu voz.',
        icon: MessageCircle,
      },
      {
        title: 'Para quien más quieres',
        description: 'Elige a las personas que recibirán tus mensajes.',
        icon: Users,
      },
      {
        title: 'Cuando tú decidas',
        description: 'Programa mensajes futuros para el momento adecuado.',
        icon: Calendar,
      },
    ],
    ctaText: '✦ EMPEZAR MI HISTORIA →',
    footerText: 'Tu presencia, incluso cuando no estés.',
  },
  together: {
    id: 'together',
    badge: 'TOGETHER ✦',
    title: 'Hay historias que empiezan siendo un regalo.',
    description: 'Crea algo especial para alguien importante. Un lugar donde guardar lo que sientes, lo que habéis vivido... y lo que significa para ti.\n\nY si quieres, también podéis construirlo juntos.',
    features: [
      {
        title: 'Para alguien especial',
        description: 'Crea un regalo único para esa persona que significa tanto.',
        icon: Heart,
      },
      {
        title: 'Un regalo con significado',
        description: 'Guarda lo que sientes, los momentos que importan y todo lo que quieras decir.',
        icon: Gift,
      },
      {
        title: 'Lo que sientes de verdad',
        description: 'Tus palabras, tus recuerdos, tus detalles. Lo que nace del corazón.',
        icon: Heart,
      },
    ],
    ctaText: '✦ EMPEZAR SU SORPRESA →',
    footerText: 'Porque hay historias que merecen sentirse.',
  },
  pet: {
    id: 'pet',
    badge: 'PET ✦',
    title: 'Ellos también escriben nuestra historia.',
    description: 'Guarda los momentos, aventuras y pequeñas cosas que hacen única su compañía. Porque su amor deja huella.\n\nY su historia también merece ser recordada.',
    features: [
      {
        title: 'Su vida, cada día',
        description: 'Momentos, travesuras y rutinas que cuentan quién es.',
        icon: PawPrint,
      },
      {
        title: 'Lo que significa para ti',
        description: 'Todo lo que sientes por él y lo que ha cambiado tu vida.',
        icon: Heart,
      },
      {
        title: 'Recuerdos que quedan',
        description: 'Fotos, vídeos y recuerdos para revivirlos siempre que quieras.',
        icon: Camera,
      },
    ],
    ctaText: '✦ CREAR SU CÁPSULA →',
    footerText: 'Su historia forma parte de la tuya. Guárdala para siempre. ♡',
  },
  origin: {
    id: 'origin',
    badge: 'ORIGIN ✦',
    title: 'Para que puedan conocer su historia desde el principio.',
    description: 'Guarda sus primeros momentos, recuerdos y mensajes futuros para que, algún día, puedan entender quiénes son y de dónde vienen.',
    features: [
      {
        title: 'Desde el primer día',
        description: 'Cada momento cuenta. Desde hoy, todo forma parte de su historia.',
        icon: Baby,
      },
      {
        title: 'Mensajes para el futuro',
        description: 'Escribe mensajes y recuerdos para cuando estén listos para conocerlos.',
        icon: Calendar,
      },
      {
        title: 'Su historia, completa',
        description: 'Para que algún día puedan entender quiénes son y de dónde vienen.',
        icon: Heart,
      },
    ],
    ctaText: '✦ EMPEZAR SU HISTORIA →',
    footerText: 'Todo lo que hoy no entenderán... algún día será parte de quiénes son.',
  },
};
