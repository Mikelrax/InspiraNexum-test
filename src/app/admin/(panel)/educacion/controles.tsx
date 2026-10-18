"use client";

import { useState, useTransition, type ReactNode } from "react";

/** Botón que ejecuta una server action (ya enlazada con sus argumentos), con confirmación opcional. */
export function BotonAccion({
  accion,
  confirmar,
  peligro,
  children,
}: {
  accion: () => Promise<void>;
  confirmar?: string;
  peligro?: boolean;
  children: ReactNode;
}) {
  const [pendiente, iniciar] = useTransition();
  return (
    <button
      type="button"
      className={
        peligro
          ? "boton boton-fantasma boton-chico whitespace-nowrap text-magenta-osc"
          : "boton boton-fantasma boton-chico whitespace-nowrap"
      }
      disabled={pendiente}
      onClick={() => {
        if (confirmar && !window.confirm(confirmar)) return;
        iniciar(async () => {
          await accion();
        });
      }}
    >
      {children}
    </button>
  );
}

export function CopiarEnlace({ url }: { url: string }) {
  const [copiado, setCopiado] = useState(false);

  return (
    <div className="flex gap-2">
      <input
        className="campo min-w-0 flex-1"
        readOnly
        value={url}
        onFocus={(e) => e.currentTarget.select()}
        aria-label="Enlace de registro"
      />
      <button
        type="button"
        className="boton boton-fantasma boton-chico whitespace-nowrap"
        onClick={async () => {
          await navigator.clipboard.writeText(url);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 1800);
        }}
      >
        {copiado ? "¡Copiado!" : "Copiar"}
      </button>
    </div>
  );
}
