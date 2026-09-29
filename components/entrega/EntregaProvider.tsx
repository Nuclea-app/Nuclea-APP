"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import type { Memory } from "@/components/capsule/MomentosClaveClient";
import {
  CapsulaEntregada,
  descargarMedio,
  ErrorDeEntrega,
  leerCapsula,
  MensajeEntregado,
  olvidarSesion,
  sesionGuardada,
} from "@/lib/entrega/cliente";
import { claveDeMedios } from "@/lib/utils";

import { PuertaDeEntrega } from "./PuertaDeEntrega";

/**
 * TODA /capsula/[token] PASA POR AQUÍ.
 *
 * Va en el layout y no en cada página para que no haya una página que se
 * olvide de la puerta: antes cada una de las seis leía la cápsula por su
 * cuenta con solo el enlace, y bastaba con escribir la dirección de una
 * subpágina para saltarse todo.
 *
 * Tres cosas y en este orden:
 *   1. Sin sesión, la puerta: nombre y apellidos, y el código que llega al
 *      correo (Andrea, 01:04:04 y 48:03).
 *   2. Con sesión, la cápsula, leída del servidor.
 *   3. Los ficheros, descargados con la sesión y convertidos en URLs de objeto
 *      para que los componentes de siempre los pinten sin enterarse.
 */

export interface MensajeParaPintar {
  id: string;
  type: string;
  unlocksAt: string;
  unlocked: boolean;
  texto: string | null;
  ilegible: boolean;
  fileUrl: string | null;
}

interface EntregaContexto {
  token: string;
  capsula: CapsulaEntregada["capsula"];
  remitente: CapsulaEntregada["remitente"];
  destinatario: CapsulaEntregada["destinatario"];
  /** Los recuerdos con la forma que esperan los componentes de la cápsula. */
  recuerdos: Memory[];
  mensajes: MensajeParaPintar[];
  /** La portada ya como URL de objeto, o null mientras llega (o si no hay). */
  portada: string | null;
}

const Contexto = createContext<EntregaContexto | null>(null);

export function useEntrega(): EntregaContexto {
  const valor = useContext(Contexto);
  if (!valor) throw new Error("useEntrega fuera de EntregaProvider");
  return valor;
}

/** Lo que salió de leer la cápsula con una sesión concreta. */
type Carga = { sesion: string; datos: CapsulaEntregada } | { sesion: string; error: string };

/** sessionStorage no avisa de cambios en la misma pestaña: nada que escuchar. */
const sinSuscripcion = () => () => {};

/** Cuántos ficheros se piden a la vez: más satura el móvil sin ir más rápido. */
const DESCARGAS_A_LA_VEZ = 4;

function claveDe(item: { storageKey?: string | null; fileUrl?: string | null }): string | null {
  if (item.storageKey) return item.storageKey;
  return item.fileUrl ? claveDeMedios(item.fileUrl) : null;
}

export function EntregaProvider({ token, children }: { token: string; children: React.ReactNode }) {
  // La sesión que ya había en la pestaña (una recarga). Se lee con
  // useSyncExternalStore y no en un efecto: en el servidor no hay
  // sessionStorage, y así el primer pintado del navegador coincide con el del
  // servidor (la rueda de carga) sin un setState de más.
  const guardada = useSyncExternalStore(
    sinSuscripcion,
    () => sesionGuardada(token),
    () => undefined
  );
  // La que pone la puerta al entrar; null cuando el servidor dice que la
  // guardada ya no vale.
  const [propia, setPropia] = useState<string | null | undefined>(undefined);
  const sesion = propia !== undefined ? propia : guardada;

  const [carga, setCarga] = useState<Carga | null>(null);
  const [intento, setIntento] = useState(0);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const creadas = useRef<string[]>([]);

  useEffect(() => {
    if (!sesion) return;
    let vivo = true;
    leerCapsula(sesion)
      .then((datos) => vivo && setCarga({ sesion, datos }))
      .catch((e) => {
        if (!vivo) return;
        // Sesión vencida o enlace caducado: se vuelve a la puerta. Si el
        // enlace ya no sirve, la propia puerta lo dirá al pedir el código.
        if (e instanceof ErrorDeEntrega && e.estado === 401) {
          olvidarSesion(token);
          setPropia(null);
          return;
        }
        setCarga({
          sesion,
          error: e instanceof Error ? e.message : "No se pudo abrir la cápsula.",
        });
      });
    return () => {
      vivo = false;
    };
  }, [sesion, token, intento]);

  // Solo vale lo cargado con la sesión de AHORA: si la puerta acaba de dar
  // una nueva, lo anterior no se enseña mientras llega lo nuevo.
  const lista = carga && carga.sesion === sesion && "datos" in carga ? carga : null;
  const fallo = carga && carga.sesion === sesion && "error" in carga ? carga.error : null;

  // Los ficheros: se descargan en segundo plano, de pocos en pocos, y cada uno
  // aparece en cuanto llega. La portada primero, que es lo que se ve antes.
  useEffect(() => {
    if (!lista) return;
    const { datos, sesion: conSesion } = lista;
    const claves = new Set<string>();
    if (datos.capsula.portada) claves.add(datos.capsula.portada);
    for (const r of datos.recuerdos) {
      const c = r.type === "NOTE" ? null : claveDe(r);
      if (c) claves.add(c);
    }
    for (const m of datos.mensajesFuturos.abiertos) {
      const c = claveDe(m);
      if (c) claves.add(c);
    }

    let vivo = true;
    const cola = [...claves];
    const trabajador = async () => {
      while (vivo && cola.length > 0) {
        const clave = cola.shift()!;
        try {
          const blob = await descargarMedio(token, clave, conSesion);
          if (!vivo) return;
          const url = URL.createObjectURL(blob);
          creadas.current.push(url);
          setUrls((antes) => ({ ...antes, [clave]: url }));
        } catch {
          // Un fichero que no llega no tumba la cápsula: se queda sin pintar y
          // el resto sigue. Es lo mismo que hace la app.
        }
      }
    };
    void Promise.all(Array.from({ length: DESCARGAS_A_LA_VEZ }, trabajador));
    return () => {
      vivo = false;
    };
  }, [lista, token]);

  // Las URLs de objeto ocupan memoria hasta que se sueltan.
  useEffect(() => {
    const lista = creadas.current;
    return () => {
      for (const u of lista) URL.revokeObjectURL(u);
    };
  }, []);

  const alEntrar = useCallback((nueva: string) => setPropia(nueva), []);

  const valor = useMemo<EntregaContexto | null>(() => {
    if (!lista) return null;
    const { datos } = lista;
    const urlDe = (item: { storageKey?: string | null; fileUrl?: string | null }) => {
      const c = claveDe(item);
      return c ? (urls[c] ?? null) : null;
    };

    const recuerdos: Memory[] = datos.recuerdos.map((r) => ({
      id: r.id,
      type: r.type,
      // El calendario y el día agrupan por `createdAt`; aquí va la fecha DEL
      // RECUERDO, que es la que eligió quien lo guardó y la que pinta la app.
      createdAt: r.date ?? r.createdAt,
      isFavorite: r.isFavorite,
      title: r.title,
      description: r.description,
      location: r.location,
      content: r.content,
      fileUrl: r.type === "NOTE" ? null : urlDe(r),
    }));

    const todos: MensajeEntregado[] = [
      ...datos.mensajesFuturos.abiertos,
      ...datos.mensajesFuturos.bloqueados,
    ];
    const mensajes: MensajeParaPintar[] = todos
      .map((m) => ({
        id: m.id,
        type: m.type,
        unlocksAt: m.unlocksAt,
        unlocked: m.abierto,
        texto: m.texto ?? null,
        ilegible: m.ilegible ?? false,
        fileUrl: m.abierto ? urlDe(m) : null,
      }))
      .sort((a, b) => a.unlocksAt.localeCompare(b.unlocksAt));

    return {
      token,
      capsula: datos.capsula,
      remitente: datos.remitente,
      destinatario: datos.destinatario,
      recuerdos,
      mensajes,
      portada: datos.capsula.portada ? (urls[datos.capsula.portada] ?? null) : null,
    };
  }, [lista, urls, token]);

  // `null` es «no hay»; `undefined` es «todavía no se ha podido mirar» (el
  // pintado del servidor), y ahí va la rueda, no la puerta.
  if (sesion === null) {
    return <PuertaDeEntrega token={token} onEntrar={alEntrar} />;
  }

  if (fallo) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <p className="mb-2 font-serif text-2xl text-foreground">No hemos podido abrir la cápsula.</p>
        <p className="mb-6 text-[13px] text-foreground/50">{fallo}</p>
        <button
          onClick={() => {
            setCarga(null);
            setIntento((n) => n + 1);
          }}
          className="text-[13px] font-semibold uppercase tracking-wider underline underline-offset-4"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!valor) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}
