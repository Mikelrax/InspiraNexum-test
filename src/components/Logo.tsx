import { useId } from "react";

type Props = {
  tamano?: number;
  animado?: boolean;
  className?: string;
};

// "El lazo Nexum": dos bucles que forman un corazón y se anudan al centro,
// como el lazo de un regalo. Nexum = vínculo, nudo (latín).
// Las clases con nombre (logo-marca__trazo, logo__nexum…) se conservan como
// ganchos para los estilos de /branding; el resto del estilo son utilidades.
export function LogoMarca({ tamano = 44, animado = false, className }: Props) {
  const id = useId();
  const degradado = `lazo-${id}`;
  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`flex-none overflow-visible${className ? ` ${className}` : ""}`}
    >
      <defs>
        <linearGradient id={degradado} x1="6" y1="10" x2="58" y2="56" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-coral)" />
          <stop offset="0.55" stopColor="var(--color-frambuesa)" />
          <stop offset="1" stopColor="var(--color-oro)" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" className="logo-marca__aro fill-white stroke-rubor-2 [stroke-width:1.5]" />
      <path
        pathLength={1}
        className={`logo-marca__trazo [stroke-dasharray:1] [stroke-dashoffset:0] group-hover/logo:animate-[dibujar_2.2s_var(--ease-suave)_both]${animado ? " animate-[dibujar_2.2s_var(--ease-suave)_both]" : ""}`}
        stroke={`url(#${degradado})`}
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M32 29 C 24 14, 8 15, 10 27 C 11.5 35, 22 39, 32 29 C 42 39, 52.5 35, 54 27 C 56 15, 40 14, 32 29 Z"
      />
      <path
        pathLength={1}
        className={`logo-marca__trazo [stroke-dasharray:1] [stroke-dashoffset:0] group-hover/logo:animate-[dibujar_2.2s_var(--ease-suave)_0.6s_both]${animado ? " animate-[dibujar_2.2s_var(--ease-suave)_0.6s_both]" : ""}`}
        stroke={`url(#${degradado})`}
        strokeWidth="3.6"
        strokeLinecap="round"
        d="M32 30 C 30 38, 25 44, 21 50 M32 30 C 34 38, 39 44, 43 50"
      />
      <circle
        cx="32"
        cy="29.5"
        r="4.2"
        fill={`url(#${degradado})`}
        className={`[transform-box:fill-box] origin-center group-hover/logo:animate-[latido_1.6s_var(--ease-rebote)_0.4s_both]${animado ? " animate-[latido_1.6s_var(--ease-rebote)_0.4s_both]" : ""}`}
      />
    </svg>
  );
}

export function Logo({ tamano = 40, animado = false }: Props) {
  return (
    <span className="group/logo inline-flex items-center gap-[0.65rem] no-underline">
      <LogoMarca tamano={tamano} animado={animado} />
      <span className="flex flex-col leading-none">
        <span className="logo__inspira font-display text-[1.45rem] font-semibold italic tracking-[-0.02em]">Inspira</span>
        <span className="logo__nexum mt-[0.2rem] text-[0.66rem] font-semibold tracking-[0.52em] uppercase text-coral-osc">
          Nexum
        </span>
      </span>
    </span>
  );
}
