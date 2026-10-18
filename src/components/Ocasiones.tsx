"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { enlaceWhatsApp, OCASIONES, proximaFecha } from "@/data/sitio";

const DIA_MS = 24 * 60 * 60 * 1000;
const formato = new Intl.DateTimeFormat("es-PE", { day: "numeric", month: "long" });

const TARJETA =
  "group relative flex flex-col gap-[0.35rem] pt-[1.6rem] px-[1.4rem] pb-[1.4rem] rounded-marca shadow-suave hover:-translate-y-[6px] hover:shadow-marca";
const NORMAL = "bg-white";
// Borde degradado de marca: el fondo blanco va en padding-box y el degradado en border-box.
const DESTACADA =
  "border-[2.5px] border-solid border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(120deg,var(--color-coral)_0%,var(--color-frambuesa)_60%,var(--color-vino)_100%)_border-box]";

// La fecha "de hoy" solo se conoce en el navegador; en el servidor se
// renderiza sin destacar ninguna ocasión para evitar desajustes de hidratación.
export function Ocasiones() {
  const [hoy, setHoy] = useState<Date | null>(null);
  useEffect(() => setHoy(new Date()), []);

  const conFecha = OCASIONES.map((ocasion) => ({
    ocasion,
    fecha: hoy ? proximaFecha(ocasion, hoy) : null,
  }));

  // En el navegador: fechas en orden cronológico desde hoy y luego las de todo el año.
  const ordenadas = hoy
    ? [
        ...conFecha.filter((item) => item.fecha).sort((a, b) => a.fecha!.getTime() - b.fecha!.getTime()),
        ...conFecha.filter((item) => !item.fecha),
      ]
    : conFecha;
  const siguiente = hoy ? ordenadas[0] : undefined;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(205px,1fr))] gap-[1.2rem]">
      {ordenadas.map(({ ocasion, fecha }, indice) => {
        const destacada = siguiente?.ocasion === ocasion;
        const dias = fecha && hoy ? Math.ceil((fecha.getTime() - hoy.getTime()) / DIA_MS) : null;
        return (
          <article
            key={ocasion.nombre}
            className={`${TARJETA} ${destacada ? DESTACADA : NORMAL}`}
            data-reveal="up"
            style={{ "--retraso": `${indice * 70}ms` } as CSSProperties}
          >
            {destacada && (
              <span className="absolute -top-3 right-4 rounded-full bg-marca px-3 py-1 text-[0.72rem] font-semibold tracking-[0.06em] text-white animate-[latido_2s_ease-in-out_infinite]">
                Se viene pronto
              </span>
            )}
            <span
              className="mb-[0.4rem] w-fit text-[2.4rem] leading-none transition-[scale,rotate] duration-500 ease-rebote group-hover:scale-[1.2] group-hover:rotate-[-10deg]"
              aria-hidden="true"
            >
              {ocasion.icono}
            </span>
            <h3 className="text-[1.3rem]">{ocasion.nombre}</h3>
            <p className="min-h-[1.4em] text-[0.82rem] font-semibold tracking-[0.04em] text-coral-osc">
              {ocasion.fecha === null
                ? "Todo el año"
                : fecha
                  ? `${formato.format(fecha)}${destacada && dias !== null ? ` · faltan ${dias} días` : ""}`
                  : " "}
            </p>
            <p className="text-[0.92rem] text-tinta-suave">{ocasion.sugerencia}</p>
            <a
              className="mt-auto w-fit pt-[0.8rem] text-[0.9rem] font-semibold text-frambuesa no-underline"
              href={enlaceWhatsApp(`¡Hola! Quiero un detalle para ${ocasion.nombre}: ${ocasion.sugerencia}.`)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Reservar →
            </a>
          </article>
        );
      })}
    </div>
  );
}

