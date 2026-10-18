"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { enlaceWhatsApp } from "@/data/sitio";

const ENLACES = [
  { href: "/#marcas", texto: "Marcas" },
  { href: "/#dliriz", texto: "D'Liriz" },
  { href: "/#compartiendo-amor", texto: "Compartiendo Amor" },
  { href: "/#personalizate", texto: "Personalízate" },
  { href: "/#alas", texto: "Alas hacia el futuro" },
  { href: "/#ocasiones", texto: "Ocasiones" },
];

// Estado del encabezado en data-solido / data-abierto (header.group/encabezado).
// Subrayado de marca con ::after; en móvil, enlaces de pantalla completa con entrada escalonada.
const ENLACE =
  "relative py-[0.3rem] text-[0.95rem] font-medium no-underline " +
  "max-[1080px]:min-[961px]:text-[0.88rem] " +
  "after:absolute after:inset-x-0 after:bottom-0 after:h-[2px] after:rounded-[2px] after:bg-marca after:origin-right after:scale-x-0 after:transition-transform after:duration-450 after:ease-suave after:content-[''] " +
  "hover:after:origin-left hover:after:scale-x-100 " +
  "max-[960px]:font-display max-[960px]:text-[1.9rem] max-[960px]:opacity-0 max-[960px]:translate-y-5 max-[960px]:transition-[opacity,translate] max-[960px]:duration-500 max-[960px]:ease-suave " +
  "max-[960px]:group-data-[abierto]/encabezado:translate-none max-[960px]:group-data-[abierto]/encabezado:opacity-100 " +
  "max-[960px]:group-data-[abierto]/encabezado:nth-[2]:delay-50 max-[960px]:group-data-[abierto]/encabezado:nth-[3]:delay-100 " +
  "max-[960px]:group-data-[abierto]/encabezado:nth-[4]:delay-150 max-[960px]:group-data-[abierto]/encabezado:nth-[5]:delay-200 " +
  "max-[960px]:group-data-[abierto]/encabezado:nth-[6]:delay-250";

// Barra del icono hamburguesa; las tres se pliegan en una X al abrir el menú.
const BARRA_HAMBURGUESA =
  "absolute left-[13px] right-[13px] h-[2px] rounded-[2px] bg-marino [transition:transform_0.4s_var(--ease-suave),opacity_0.3s]";

export function Encabezado() {
  const [desplazado, setDesplazado] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const actualizar = () => setDesplazado(window.scrollY > 24);
    actualizar();
    window.addEventListener("scroll", actualizar, { passive: true });
    return () => window.removeEventListener("scroll", actualizar);
  }, []);

  useEffect(() => {
    document.body.style.overflow = abierto ? "hidden" : "";
  }, [abierto]);

  return (
    <header
      className="group/encabezado fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-400 data-[solido]:bg-lienzo/90 data-[solido]:shadow-[0_1px_0_rgba(29,43,92,0.08),0_10px_30px_-20px_rgba(29,43,92,0.3)] data-[solido]:backdrop-blur-[14px] data-[solido]:backdrop-saturate-[1.4]"
      data-solido={desplazado || undefined}
      data-abierto={abierto || undefined}
    >
      <div className="contenedor flex h-[84px] items-center justify-between gap-6 transition-[height] duration-400 ease-suave group-data-[solido]/encabezado:h-[68px]">
        <Link
          href="/"
          className="no-underline max-[960px]:relative max-[960px]:z-[2]"
          aria-label="Inspira Nexum, inicio"
          onClick={() => setAbierto(false)}
        >
          <Logo tamano={38} />
        </Link>

        <nav
          aria-label="Principal"
          className="flex items-center gap-[1.6rem] max-[1080px]:min-[961px]:gap-[1.1rem] max-[960px]:fixed max-[960px]:inset-0 max-[960px]:flex-col max-[960px]:justify-center max-[960px]:gap-[1.4rem] max-[960px]:bg-lienzo/[0.97] max-[960px]:backdrop-blur-[10px] max-[960px]:invisible max-[960px]:opacity-0 max-[960px]:[transition:opacity_0.4s_var(--ease-suave),visibility_0.4s] max-[960px]:group-data-[abierto]/encabezado:visible max-[960px]:group-data-[abierto]/encabezado:opacity-100"
        >
          {ENLACES.map((enlace) => (
            <Link key={enlace.href} href={enlace.href} className={ENLACE} onClick={() => setAbierto(false)}>
              {enlace.texto}
            </Link>
          ))}
          <a
            className="boton boton-primario boton-chico"
            href={enlaceWhatsApp("¡Hola Inspira Nexum! Quiero hacer un pedido 🎁")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Hacer pedido
          </a>
        </nav>

        <button
          type="button"
          className="relative z-[2] hidden size-[46px] cursor-pointer rounded-full border-0 bg-white shadow-suave max-[960px]:block"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          onClick={() => setAbierto((valor) => !valor)}
        >
          <span className={`${BARRA_HAMBURGUESA} top-4 group-data-[abierto]/encabezado:translate-y-[6px] group-data-[abierto]/encabezado:rotate-45`} />
          <span className={`${BARRA_HAMBURGUESA} top-[22px] group-data-[abierto]/encabezado:opacity-0`} />
          <span className={`${BARRA_HAMBURGUESA} top-[28px] group-data-[abierto]/encabezado:-translate-y-[6px] group-data-[abierto]/encabezado:-rotate-45`} />
        </button>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[3px] origin-[0_50%] bg-marca [transform:scaleX(0)] supports-[animation-timeline:scroll()]:animate-[progreso_linear_both] supports-[animation-timeline:scroll()]:[animation-timeline:scroll(root)]" aria-hidden="true" />
    </header>
  );
}
