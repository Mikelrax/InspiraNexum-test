import Image from "next/image";
import type { CSSProperties } from "react";
import { retraso } from "@/lib/retraso";
import { enlaceWhatsApp, PRODUCTOS_AMOR } from "@/data/sitio";

/* ───────────────────────── Compartiendo Amor ───────────────────────── */

const SOMBRA_FOTO = "shadow-[0_40px_70px_-30px_rgba(0,0,0,0.6)]";

export function CompartiendoAmor() {
  return (
    <section
      className="relative py-[clamp(5rem,10vw,8.5rem)] relative overflow-hidden bg-[radial-gradient(ellipse_at_15%_20%,rgba(255,255,255,0.12),transparent_50%),linear-gradient(140deg,var(--color-magenta-osc)_0%,var(--color-magenta)_70%,#c93a8a_100%)] text-white"
      id="compartiendo-amor"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="absolute -bottom-[40px] left-[calc(var(--i)*10%_+_3%)] text-[calc(14px_+_var(--i)*2px)] text-white/[0.18] animate-[subir_calc(10s_+_var(--i)*1.3s)_linear_infinite_calc(var(--i)*-1.7s)]"
            style={{ "--i": i } as CSSProperties}
          >
            ♥
          </span>
        ))}
      </div>
      <div className="contenedor relative grid grid-cols-2 items-center gap-[4rem] max-[960px]:grid-cols-1">
        <div className="relative min-h-[560px] max-[960px]:mx-auto max-[960px]:aspect-[1/1.05] max-[960px]:min-h-0 max-[960px]:w-full max-[960px]:max-w-[520px]">
          <div className="absolute top-0 left-[2%] z-[2] w-[62%] rotate-[-5deg]" data-reveal="left">
            <Image
              src="/img/arreglo-amor.jpg"
              alt="Arreglo con rosas rojas y peluche"
              width={300}
              height={413}
              sizes="(max-width: 900px) 70vw, 340px"
              className={`h-auto w-full rounded-[22px] border-[8px] border-white ${SOMBRA_FOTO}`}
            />
          </div>
          <div
            className="absolute right-0 bottom-0 w-1/2 rotate-6"
            data-reveal="up"
            style={retraso(200)}
          >
            <Image
              src="/img/halloween.jpg"
              alt="Box temático de Halloween con globos y golosinas"
              width={716}
              height={960}
              sizes="(max-width: 900px) 50vw, 280px"
              className={`aspect-[4/5] h-auto w-full rounded-[22px] border-[8px] border-white object-cover ${SOMBRA_FOTO}`}
            />
          </div>
          <span
            className="absolute top-[46%] left-[52%] z-[3] grid h-[118px] w-[118px] place-items-center rounded-full bg-dorado font-script text-center text-[1.9rem] leading-none text-marino-osc shadow-[0_18px_30px_-12px_rgba(0,0,0,0.5)] rotate-[-12deg] data-[visible]:animate-[latido_2.4s_ease-in-out_1s_infinite]"
            data-reveal="zoom"
            style={retraso(400)}
          >
            ¡Feliz día!
          </span>
        </div>

        <div>
          <header data-reveal="up">
            <p className="etiqueta etiqueta-clara">@compartiendo.amor</p>
            <h2 className="mt-[0.6rem] font-script text-[clamp(3.4rem,6.5vw,5.4rem)] leading-[1.1] font-normal tracking-normal">
              Compartiendo Amor
            </h2>
            <p className="text-[0.85rem] font-semibold uppercase tracking-[0.3em] text-dorado-claro">Detalles que abrazan</p>
            <p className="mt-[1.3rem] text-[1.1rem] text-white/85">
              Arreglos y box temáticos para cada fecha: San Valentín, cumpleaños, aniversarios, Halloween o
              simplemente porque sí. Tú pones el mensaje; nosotros, la sorpresa.
            </p>
          </header>
          <ul className="my-[2.2rem] grid list-none grid-cols-2 gap-4 p-0 max-[600px]:grid-cols-1">
            {PRODUCTOS_AMOR.map((producto, i) => (
              <li
                key={producto.nombre}
                className="group flex gap-[0.9rem] rounded-[18px] border border-white/[0.16] bg-white/[0.09] p-[1.1rem] backdrop-blur-[6px] transition-colors duration-300 hover:bg-white/[0.16]"
                data-reveal="right"
                style={retraso(i * 120)}
              >
                <span
                  className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white/95 text-[1.3rem] transition-[rotate] duration-500 ease-rebote group-hover:rotate-[-14deg]"
                  aria-hidden="true"
                >
                  {producto.icono}
                </span>
                <div>
                  <h3 className="font-body text-[1rem] font-semibold">{producto.nombre}</h3>
                  <p className="mt-[0.2rem] text-[0.88rem] text-white/[0.78]">{producto.texto}</p>
                </div>
              </li>
            ))}
          </ul>
          <a
            className="boton boton-blanco group"
            data-reveal="up"
            href={enlaceWhatsApp("¡Hola Compartiendo Amor! Quiero un arreglo sorpresa 💝")}
            target="_blank"
            rel="noopener noreferrer"
          >
            Quiero sorprender
            <span
              className="inline-block transition-transform duration-[0.35s] ease-suave group-hover:translate-x-[5px]"
              aria-hidden="true"
            >
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
