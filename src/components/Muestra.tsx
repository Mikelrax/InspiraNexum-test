"use client";

import { useState } from "react";

// Muestra de color que copia su código HEX al portapapeles al hacer clic.
export function MuestraColor({ nombre, hex, uso, claro = false }: { nombre: string; hex: string; uso: string; claro?: boolean }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1400);
    } catch {
      // Sin permiso de portapapeles: no hacemos nada.
    }
  };

  // Clases completas y literales (Tailwind las detecta al escanear el código).
  const base =
    "flex flex-col items-start justify-end gap-[0.2rem] w-full min-h-[190px] p-[1.3rem] border-0 rounded-marca text-left font-body cursor-pointer transition-[translate,box-shadow] duration-[0.45s] ease-suave hover:-translate-y-[6px] hover:shadow-marca";
  const color = claro
    ? "text-cacao shadow-[inset_0_0_0_1.5px_rgba(74,42,32,0.1),var(--shadow-suave)]"
    : "text-white shadow-suave";

  return (
    <button type="button" className={`${base} ${color}`} onClick={copiar} style={{ background: hex }}>
      <span className="font-display text-[1.25rem] font-semibold">{nombre}</span>
      <span className="text-[0.9rem] font-semibold tracking-[0.08em]">{copiado ? "¡Copiado!" : hex.toUpperCase()}</span>
      <span className="text-[0.8rem] opacity-80">{uso}</span>
    </button>
  );
}
