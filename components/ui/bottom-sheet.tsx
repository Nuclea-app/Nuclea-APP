"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

const ANIM_MS = 300;

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Extra classes for the sheet panel (e.g. horizontal padding). */
  className?: string;
  /** Allow closing by tapping the overlay or pressing Escape. Default true. */
  dismissible?: boolean;
}

/**
 * A bottom sheet built from scratch instead of vaul.
 *
 * The whole point is reliable on-screen-keyboard handling on iOS Safari:
 * - The panel is `position: fixed`, anchored to the bottom.
 * - It listens to `window.visualViewport` and sits exactly above the keyboard,
 *   shrinking its `max-height` so its content scrolls internally instead of the
 *   page jumping around and hiding the focused input.
 * - The background `<body>` is locked while open so nothing behind it scrolls.
 * - The focused input is scrolled into the centre of the visible area.
 */
export function BottomSheet({
  open,
  onClose,
  children,
  className,
  dismissible = true,
}: BottomSheetProps) {
  const [rendered, setRendered] = React.useState(false);
  const [shown, setShown] = React.useState(false);
  const sheetRef = React.useRef<HTMLDivElement>(null);

  // ── Mount / unmount with enter + exit animation ──────────────────────────
  React.useEffect(() => {
    if (open) {
      setRendered(true);
      const id = requestAnimationFrame(() =>
        requestAnimationFrame(() => setShown(true)),
      );
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    const t = setTimeout(() => setRendered(false), ANIM_MS);
    return () => clearTimeout(t);
  }, [open]);

  // ── Lock the page behind the sheet while it is on screen ─────────────────
  React.useEffect(() => {
    if (!rendered) return;
    const scrollY = window.scrollY;
    const { body } = document;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    return () => {
      Object.assign(body.style, prev);
      window.scrollTo(0, scrollY);
    };
  }, [rendered]);

  // ── Keep the panel docked above the on-screen keyboard ───────────────────
  React.useEffect(() => {
    if (!rendered) return;
    const vv = window.visualViewport;
    if (!vv) return;

    const apply = () => {
      const sheet = sheetRef.current;
      if (!sheet) return;
      // Area obscured at the bottom by the keyboard (and any browser chrome).
      const keyboard = Math.max(
        0,
        window.innerHeight - vv.height - vv.offsetTop,
      );
      // Small gap at the very top so it reads as a sheet; minimal when the
      // keyboard is up so we use all the room we can.
      const topGap = keyboard > 0 ? 8 : 48;
      sheet.style.bottom = `${keyboard}px`;
      sheet.style.maxHeight = `${vv.height - topGap}px`;
    };

    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    return () => {
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
    };
  }, [rendered]);

  // ── Escape to close ──────────────────────────────────────────────────────
  React.useEffect(() => {
    if (!rendered || !dismissible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [rendered, dismissible, onClose]);

  // ── Bring a focused input into the centre of the visible area ────────────
  const handleFocus = (e: React.FocusEvent) => {
    const target = e.target;
    if (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement
    ) {
      // Wait for the keyboard to open and the panel to settle, then centre it.
      window.setTimeout(() => {
        target.scrollIntoView({ block: "center", behavior: "smooth" });
      }, 150);
    }
  };

  if (!rendered) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/30 supports-backdrop-filter:backdrop-blur-[2px] transition-opacity",
          shown ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: `${ANIM_MS}ms` }}
        onClick={dismissible ? onClose : undefined}
      />

      {/* Panel */}
      <div
        ref={sheetRef}
        onFocus={handleFocus}
        className={cn(
          "absolute inset-x-0 bottom-0 mx-auto flex w-full max-w-[430px] flex-col rounded-t-[32px] bg-white shadow-xl transition-transform will-change-transform",
          shown ? "translate-y-0" : "translate-y-full",
          className,
        )}
        style={{ transitionDuration: `${ANIM_MS}ms` }}
      >
        {/* Grabber */}
        <div className="mx-auto mt-3 h-1.5 w-[100px] shrink-0 rounded-full bg-muted/40" />
        {children}
      </div>
    </div>,
    document.body,
  );
}
