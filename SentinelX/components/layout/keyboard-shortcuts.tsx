"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const ROUTES: Record<string, string> = {
  "g d": "/dashboard",
  "g a": "/assets",
  "g v": "/vulnerabilities",
  "g t": "/threats",
  "g i": "/incidents",
  "g p": "/posture",
  "g r": "/reports",
  "g n": "/network",
  "g z": "/analyze",
};

/**
 * KeyboardShortcuts — registra atajos de navegación global.
 *
 * Atajos disponibles:
 *   Ctrl+K  → abre la paleta de comandos (logs to console hasta que se implemente la paleta)
 *   Esc     → cierra modales (event bubbling — los modales escuchan Esc directamente)
 *   g + d/a/v/t/i/p/r/n/z  → navega a la sección correspondiente (modo vim-like)
 *
 * Decisión de diseño: usamos key sequences para la navegación vim-like en lugar
 * de modificadores (Ctrl+Shift+X) para evitar colisiones con el SO y el browser.
 */
export function KeyboardShortcuts() {
  const router = useRouter();
  const keyBuffer = { current: "" as string };

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignorar si el foco está en un input / textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;

      // Ctrl+K → paleta de comandos (futuro)
      if (e.ctrlKey && e.key === "k") {
        e.preventDefault();
        // Dispatch a custom event que los componentes pueden escuchar
        window.dispatchEvent(new CustomEvent("sentinelx:command-palette"));
        return;
      }

      // Secuencias vim-like (g + tecla)
      const now = e.key.toLowerCase();
      keyBuffer.current = keyBuffer.current + now;

      // Recortar buffer si es demasiado largo
      if (keyBuffer.current.length > 3) {
        keyBuffer.current = keyBuffer.current.slice(-3);
      }

      // Buscar en las últimas 3 chars del buffer
      for (const [seq, path] of Object.entries(ROUTES)) {
        if (keyBuffer.current.endsWith(seq.replace(" ", ""))) {
          router.push(path);
          keyBuffer.current = "";
          return;
        }
      }
    },
    [router]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Este componente no renderiza nada visual
  return null;
}
