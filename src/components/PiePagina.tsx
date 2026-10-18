import Link from "next/link";
import { Logo } from "./Logo";
import { IconoFacebook, IconoInstagram, IconoTiktok, IconoWhatsApp } from "./Iconos";
import { enlaceWhatsApp, REDES } from "@/data/sitio";

const COLUMNA = "flex flex-col gap-[0.6rem] text-[0.95rem]";
const TITULO_COLUMNA =
  "mb-[0.4rem] font-body text-[0.78rem] font-semibold tracking-[0.2em] uppercase text-dorado";
const ENLACE_COLUMNA = "w-fit no-underline transition-colors duration-300 hover:text-dorado-claro";
const RED =
  "grid size-[42px] place-items-center rounded-full bg-white/[0.08] text-lienzo [transition:background-color_0.3s,translate_0.35s_var(--ease-suave)] hover:-translate-y-[3px] hover:bg-magenta";

export function PiePagina() {
  return (
    <footer className="relative mt-12 bg-marino-osc pt-16 pb-8 text-lienzo/[0.78]">
      <div className="absolute inset-x-0 -top-[79px] h-20" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="size-full fill-marino-osc">
          <path d="M0 40 C 240 90, 480 -10, 720 40 S 1200 90, 1440 40 V 80 H 0 Z" />
        </svg>
      </div>
      <div className="contenedor grid grid-cols-1 gap-10 min-[601px]:grid-cols-2 min-[961px]:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div className="max-[960px]:col-span-full [&_.logo\_\_inspira]:text-white [&_.logo\_\_nexum]:text-white [&_.logo\_\_nexum+span]:text-white/60">
          <Logo tamano={44} />
          <p className="mt-[1.2rem] mb-[1.4rem] max-w-[22rem] text-[0.95rem]">
            <strong className="font-semibold text-lienzo">Inspira Nexum E.I.R.L.</strong> Tres emprendimientos y una
            escuela de oficios, hechos con el corazón en Arequipa, Perú.
          </p>
          <div className="flex gap-[0.7rem]">
            <a href={REDES.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={RED}>
              <IconoInstagram />
            </a>
            <a href={REDES.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={RED}>
              <IconoFacebook />
            </a>
            <a href={REDES.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className={RED}>
              <IconoTiktok />
            </a>
            <a
              href={enlaceWhatsApp("¡Hola Inspira Nexum!")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={RED}
            >
              <IconoWhatsApp />
            </a>
          </div>
        </div>

        <nav className={COLUMNA} aria-label="Marcas">
          <h4 className={TITULO_COLUMNA}>Nuestras marcas</h4>
          <Link href="/#dliriz" className={ENLACE_COLUMNA}>D&apos;Liriz</Link>
          <Link href="/#compartiendo-amor" className={ENLACE_COLUMNA}>Compartiendo Amor</Link>
          <Link href="/#personalizate" className={ENLACE_COLUMNA}>Personalízate Arequipa</Link>
          <Link href="/#alas" className={ENLACE_COLUMNA}>Alas hacia el futuro</Link>
        </nav>

        <nav className={COLUMNA} aria-label="Explorar">
          <h4 className={TITULO_COLUMNA}>Explora</h4>
          <Link href="/#ocasiones" className={ENLACE_COLUMNA}>Ocasiones</Link>
          <Link href="/#como-pedir" className={ENLACE_COLUMNA}>Cómo pedir</Link>
          <Link href="/branding" className={ENLACE_COLUMNA}>Manual de marca</Link>
        </nav>

        <div className={COLUMNA}>
          <h4 className={TITULO_COLUMNA}>Atención</h4>
          <p>Arequipa, Perú</p>
          <p>Pedidos por WhatsApp</p>
          <p>Delivery en la ciudad</p>
        </div>
      </div>
      <div className="contenedor mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-[0.85rem]">
        <span>© {new Date().getFullYear()} Inspira Nexum E.I.R.L.</span>
        <span className="script text-[2rem] bg-[image:linear-gradient(120deg,var(--color-dorado-claro),var(--color-dorado),var(--color-bronce))]!">
          Inspira Nexum
        </span>
      </div>
    </footer>
  );
}
