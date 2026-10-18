type Props = {
  tamano?: number;
  animado?: boolean;
  className?: string;
};

// Los cuatro pétalos de Inspira Nexum: cada uno es una línea de negocio y el
// destello dorado del centro es el vínculo (nexum) que las une.
// Las clases con nombre (logo-marca__trazo, logo__nexum…) se conservan como
// ganchos para /branding y el pie; el resto del estilo son utilidades.
const PETALO = "M30 30 C 30 15, 21 6, 7 7 C 6 21, 15 30, 30 30 Z";

export function LogoMarca({ tamano = 44, animado = false, className }: Props) {
  const entrada = (retraso: string) =>
    `logo-marca__trazo [transform-box:fill-box] origin-center group-hover/logo:animate-[aparecer_0.9s_var(--ease-rebote)_${retraso}_both]${
      animado ? ` animate-[aparecer_0.9s_var(--ease-rebote)_${retraso}_both]` : ""
    }`;

  return (
    <svg
      width={tamano}
      height={tamano}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      className={`flex-none overflow-visible${className ? ` ${className}` : ""}`}
    >
      <path d={PETALO} fill="var(--color-turquesa)" className={entrada("0s")} />
      <path d={PETALO} fill="var(--color-magenta)" transform="rotate(90 32 32)" className={entrada("0.12s")} />
      <path d={PETALO} fill="var(--color-dorado)" transform="rotate(180 32 32)" className={entrada("0.24s")} />
      <path d={PETALO} fill="var(--color-celeste)" transform="rotate(270 32 32)" className={entrada("0.36s")} />
      <path
        d="M32 22 L34.2 29.8 L42 32 L34.2 34.2 L32 42 L29.8 34.2 L22 32 L29.8 29.8 Z"
        fill="var(--color-dorado)"
        stroke="white"
        strokeWidth="1.6"
        strokeLinejoin="round"
        className={`[transform-box:fill-box] origin-center group-hover/logo:animate-[latido_1.6s_var(--ease-rebote)_0.5s_both]${
          animado ? " animate-[latido_1.6s_var(--ease-rebote)_0.5s_both]" : ""
        }`}
      />
    </svg>
  );
}

export function Logo({ tamano = 40, animado = false }: Props) {
  return (
    <span className="group/logo inline-flex items-center gap-[0.65rem] no-underline">
      <LogoMarca tamano={tamano} animado={animado} />
      <span className="flex flex-col font-body leading-[0.95]">
        <span className="logo__inspira text-[1.12rem] font-bold tracking-[0.04em] uppercase text-marino">Inspira</span>
        <span className="logo__nexum text-[1.12rem] font-bold tracking-[0.04em] uppercase text-marino">Nexum</span>
        <span className="mt-[0.2rem] text-[0.5rem] font-semibold tracking-[0.34em] text-marino-2">E.I.R.L.</span>
      </span>
    </span>
  );
}
