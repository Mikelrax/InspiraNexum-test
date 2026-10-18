import { MARQUESINA } from "@/data/sitio";

/* ───────────────────────── Marquesina ───────────────────────── */

// Acentos de marca que rotan entre separadores. Las clases van completas para que Tailwind las detecte.
const SEPARADORES = ["text-magenta", "text-celeste", "text-dorado", "text-turquesa"] as const;

export function Marquesina() {
  const fila = [...MARQUESINA, ...MARQUESINA];
  const item =
    "inline-flex items-center gap-[1.6rem] pr-[1.6rem] font-display text-[clamp(1.3rem,2.4vw,2rem)] font-medium whitespace-nowrap";
  const contorno = "italic text-transparent [-webkit-text-stroke:1px_rgba(250,248,245,0.55)]";
  const separador = (i: number) =>
    `text-[0.8em] [-webkit-text-stroke:0] ${SEPARADORES[i % SEPARADORES.length]}`;
  // La pausa al pasar el cursor por la marquesina se hereda por el grupo.
  return (
    <section
      className="group relative z-[2] -mx-[2%] -rotate-[1.5deg] overflow-hidden bg-marino-osc py-[1.4rem] text-lienzo shadow-marca"
      aria-label="Lo que hacemos"
    >
      <div className="flex w-max animate-[desplazar_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        {fila.map((texto, i) => (
          <span key={i} className={item} aria-hidden={i >= MARQUESINA.length}>
            {texto}
            <span className={separador(i)} aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
      <div
        className="mt-[0.4rem] flex w-max animate-[desplazar_55s_linear_infinite_reverse] group-hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
        {fila.map((texto, i) => (
          <span key={i} className={`${item} ${contorno}`}>
            {texto}
            <span className={separador(i + 1)}>♥</span>
          </span>
        ))}
      </div>
    </section>
  );
}
