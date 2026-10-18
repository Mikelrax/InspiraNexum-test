import { AnimacionesScroll } from "@/components/Efectos";
import { Encabezado } from "@/components/Encabezado";
import { IconoWhatsApp } from "@/components/Iconos";
import { PiePagina } from "@/components/PiePagina";
import { Alas } from "@/components/secciones/Alas";
import { CompartiendoAmor } from "@/components/secciones/CompartiendoAmor";
import { Cierre } from "@/components/secciones/Cierre";
import { Dliriz } from "@/components/secciones/Dliriz";
import { Hero } from "@/components/secciones/Hero";
import { Marcas } from "@/components/secciones/Marcas";
import { Marquesina } from "@/components/secciones/Marquesina";
import { Personalizate } from "@/components/secciones/Personalizate";
import { enlaceWhatsApp } from "@/data/sitio";

// La landing solo compone secciones: cada una vive en src/components/secciones.
export default function Inicio() {
  return (
    <>
      <AnimacionesScroll />
      <Encabezado />
      <main>
        <Hero />
        <Marquesina />
        <Marcas />
        <Dliriz />
        <CompartiendoAmor />
        <Personalizate />
        <Alas />
        <Cierre />
      </main>
      <PiePagina />
      <a
        className="fixed right-[22px] bottom-[22px] z-40 grid size-[60px] place-items-center rounded-full bg-[#25d366] text-white shadow-[0_14px_30px_-10px_rgba(37,211,102,0.7)] animate-[aparecer_0.8s_var(--ease-rebote)_1.8s_both] transition-[translate] duration-350 ease-suave hover:-translate-y-1 before:absolute before:inset-0 before:content-[''] before:rounded-full before:border-2 before:border-[#25d366] before:animate-[onda_2.2s_ease-out_infinite] [&_svg]:size-[30px]"
        href={enlaceWhatsApp("¡Hola Inspira Nexum! Quisiera más información 😊")}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Escríbenos por WhatsApp"
      >
        <IconoWhatsApp />
      </a>
    </>
  );
}
