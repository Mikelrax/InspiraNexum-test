import Image from "next/image";
import { Tilt } from "@/components/Efectos";
import { retraso } from "@/lib/retraso";
import { enlaceWhatsApp, PRODUCTOS_PERSONALIZATE } from "@/data/sitio";

/* ───────────────────────── Personalízate Arequipa ───────────────────────── */

export function Personalizate() {
  return (
    <section
      className="relative py-[clamp(5rem,10vw,8.5rem)] overflow-hidden bg-ebano text-lienzo"
      id="personalizate"
    >
      <div className="contenedor grid grid-cols-[1.1fr_0.9fr] items-center gap-16 max-[960px]:grid-cols-[1fr]">
        <div>
          <header data-reveal="up">
            <p className="etiqueta text-bronce!">Regalos corporativos y personalizados</p>
            <h2 className="my-4 text-[clamp(2.6rem,5vw,4rem)] tracking-[-0.03em] text-bronce">
              Personalízate{" "}
              <span className="mt-2 block font-body text-[0.32em] font-semibold tracking-[0.7em] uppercase text-dorado">
                Arequipa
              </span>
            </h2>
            <p className="text-[1.12rem] text-lienzo/75">
              Tu nombre, tu marca, tu estilo. Armamos cajas premium con el logotipo de tu empresa y regalos con
              nombre que se quedan en la memoria (y en el escritorio).
            </p>
          </header>

          <ol className="my-10 grid grid-cols-[1fr_1fr] gap-[1.6rem_2rem] list-none p-0 max-[600px]:grid-cols-[1fr]">
            {PRODUCTOS_PERSONALIZATE.map((producto, i) => (
              <li
                key={producto.nombre}
                data-reveal="up"
                style={retraso(i * 110)}
                className="flex gap-4 border-t-[1.5px] border-bronce/25 pt-[1.1rem] hover:border-bronce"
              >
                <span className="font-display text-[1.1rem] italic text-dorado">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.15rem] text-lienzo">{producto.nombre}</h3>
                  <p className="mt-1 text-[0.93rem] text-lienzo/70">{producto.texto}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-[0.9rem]" data-reveal="up">
            <a
              className="group boton boton-ebano outline outline-1 outline-bronce/60 outline-offset-[3px]"
              href={enlaceWhatsApp("¡Hola Personalízate Arequipa! Quiero cotizar cajas corporativas con logotipo.")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cotizar para mi empresa
              <span
                className="inline-block transition-[translate] duration-[0.35s] ease-suave group-hover:translate-x-[5px]"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a
              className="boton boton-fantasma text-bronce! shadow-[inset_0_0_0_1.5px_var(--color-bronce)]! hover:bg-bronce/10! hover:shadow-[inset_0_0_0_1.5px_var(--color-dorado)]!"
              href={enlaceWhatsApp("¡Hola Personalízate Arequipa! Quiero una taza personalizada ☕")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Regalo personal
            </a>
          </div>
        </div>

        <div
          className="relative w-[min(420px,100%)] justify-self-center before:absolute before:-bottom-[6%] before:-right-[10%] before:top-[8%] before:left-[12%] before:rounded-[46%_54%_40%_60%/55%_40%_60%_45%] before:bg-bronce before:content-[''] before:animate-[morfar_12s_ease-in-out_infinite_alternate] max-[960px]:-order-1 max-[960px]:w-[min(360px,80%)]"
          data-reveal="zoom"
        >
          <Tilt className="relative">
            <Image
              src="/img/caja-corporativa.jpg"
              alt="Caja premium corporativa personalizable con logotipo"
              width={288}
              height={333}
              sizes="(max-width: 900px) 80vw, 420px"
              className="h-auto w-full rounded-3xl border-[10px] border-bronce shadow-marca"
            />
            <span className="absolute -left-[2.2rem] top-[12%] flex flex-col items-center rounded-[14px] bg-[#f4efe6] px-[1.3rem] pt-[0.6rem] pb-[0.7rem] shadow-suave rotate-[-8deg] animate-[flotar_6s_ease-in-out_infinite] max-[600px]:-left-[0.8rem]">
              <span className="script text-[2.2rem]! leading-[1.1]! [background-image:linear-gradient(120deg,var(--color-bronce)_0%,var(--color-dorado-osc)_100%)]!">
                Haydée
              </span>
              <small className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-ebano/70">
                tu nombre aquí
              </small>
            </span>
          </Tilt>
          <div
            className="absolute -right-6 bottom-[8%] flex flex-col rounded-2xl bg-dorado px-[1.2rem] py-[0.9rem] text-marino-osc shadow-suave max-[600px]:-right-[0.6rem]"
            data-reveal="right"
            style={retraso(300)}
          >
            <strong className="font-display text-[1.2rem]">+ tu logotipo</strong>
            <span className="text-[0.82rem]">en caja, taza, tarjeta y esfera</span>
          </div>
        </div>
      </div>
    </section>
  );
}
