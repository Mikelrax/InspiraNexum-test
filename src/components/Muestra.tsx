"use client";

import { useState } from "react";

export type MuestraDeColor = {
  nombre: string;
  hex: string;
  clase: string; // utilidad bg-… completa y literal (Tailwind la detecta en el código)
  uso: string;
  claro?: boolean;
};

// Muestra de color que copia su código HEX al portapapeles al hacer clic.
export function MuestraColor({ nombre, hex, clase, uso, claro = false }: MuestraDeColor) {
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
  const texto = claro
    ? "text-marino shadow-[inset_0_0_0_1.5px_rgba(29,43,92,0.1),var(--shadow-suave)]"
    : "text-white shadow-suave";

  return (
    <button type="button" className={`${clase} ${base} ${texto}`} onClick={copiar}>
      <span className="font-display text-[1.25rem] font-semibold">{nombre}</span>
      <span className="text-[0.9rem] font-semibold tracking-[0.08em]">{copiado ? "¡Copiado!" : hex.toUpperCase()}</span>
      <span className="text-[0.8rem] opacity-80">{uso}</span>
    </button>
  );
}
