import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { AnimacionesScroll } from "@/components/Efectos";
import { Encabezado } from "@/components/Encabezado";
import { Logo, LogoMarca } from "@/components/Logo";
import { MuestraColor } from "@/components/Muestra";
import { PiePagina } from "@/components/PiePagina";

export const metadata: Metadata = {
  title: "Manual de marca · Inspira Nexum",
  description: "Logo, paleta, tipografía, voz y movimiento de Inspira Nexum y sus marcas.",
};

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;

// Clases que se repiten en varias secciones del manual.
const SECCION = "relative py-[clamp(5rem,10vw,8.5rem)]";
const CABECERA = "mb-14 max-w-[44rem]";
const TITULO = "my-4 text-[clamp(2.3rem,4.6vw,3.7rem)] tracking-[-0.03em]";
const BAJADA = "text-[1.12rem] text-tinta-suave";
// Cortes de 960px: columna única centrada con ancho máximo de 480px.
const APILAR_960 = "max-[960px]:mx-auto max-[960px]:max-w-[480px] max-[960px]:grid-cols-1";
// Animación de entrada del hero; el retraso llega por --retraso (style).
const ENTRADA = "animate-[entrar_1s_var(--ease-suave)_both] [animation-delay:var(--retraso,0ms)]";
const VOZ = "rounded-marca border border-white/[0.15] bg-white/[0.08] p-8";
const VOZ_LI = "font-display text-[1.1rem] italic text-white/[0.88]";
const MOV = "flex flex-col items-center gap-[0.3rem] rounded-marca bg-rubor px-6 py-8 text-center";
const DEMO = "grid h-24 w-24 place-items-center mb-4 rounded-full bg-white text-[2.6rem] shadow-suave";

const PALETA = [
  { nombre: "Crema", hex: "#fff8f3", uso: "Fondo principal", claro: true },
  { nombre: "Rubor", hex: "#fbe9e4", uso: "Fondos de sección", claro: true },
  { nombre: "Coral D'Liriz", hex: "#e7857a", uso: "Acento dulce" },
  { nombre: "Frambuesa", hex: "#c21f45", uso: "Acción y emoción" },
  { nombre: "Vino", hex: "#7c1030", uso: "Profundidad" },
  { nombre: "Pino", hex: "#1f5a4a", uso: "Corporativo" },
  { nombre: "Oro", hex: "#c99a4b", uso: "Detalle premium" },
  { nombre: "Cacao", hex: "#4a2a20", uso: "Texto y contraste" },
];

const SUBMARCAS = [
  {
    id: "dliriz",
    nombre: "D'Liriz",
    lema: "Arte y pasión a tu servicio",
    rol: "Repostería y chocolatería artesanal",
    color: "Coral + Cacao",
    tipo: "Great Vibes para el nombre, Outfit para el lema",
    personalidad: "Golosa, delicada, artesanal",
    acento: "[--acento:var(--color-coral)]",
    cabecera: "bg-rubor",
    claseNombre: "font-script text-[3.4rem] leading-[1.1] text-coral",
  },
  {
    id: "amor",
    nombre: "Compartiendo Amor",
    lema: "Detalles que abrazan",
    rol: "Arreglos, box temáticos y sorpresas",
    color: "Frambuesa + Vino + Oro",
    tipo: "Great Vibes en blanco sobre frambuesa",
    personalidad: "Romántica, festiva, sorprendente",
    acento: "[--acento:var(--color-frambuesa)]",
    cabecera: "bg-[linear-gradient(140deg,var(--color-vino),var(--color-frambuesa))] text-white",
    claseNombre: "font-script text-[2.9rem] leading-[1.1] text-white",
  },
  {
    id: "personalizate",
    nombre: "Personalízate",
    lema: "Tu nombre, tu marca, tu estilo",
    rol: "Regalos personalizados y corporativos",
    color: "Pino + Oro",
    tipo: "Fraunces + AREQUIPA espaciado en Outfit",
    personalidad: "Elegante, confiable, a medida",
    acento: "[--acento:var(--color-pino)]",
    cabecera: "bg-pino-claro",
    claseNombre: "font-display text-[2.2rem] font-semibold leading-[1.1] text-pino",
  },
];

export default function Branding() {
  return (
    <>
      <AnimacionesScroll />
      <Encabezado />
      <main>
        {/* Portada */}
        <section className="relative overflow-hidden bg-crema bg-[radial-gradient(ellipse_at_85%_30%,rgba(231,133,122,0.25),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(201,154,75,0.18),transparent_50%)] pt-[150px] pb-[90px]">
          <div className="contenedor grid grid-cols-[1.3fr_1fr] items-center gap-12 max-[960px]:grid-cols-1">
            <div>
              <p className={`etiqueta ${ENTRADA}`}>Manual de marca · v1.0</p>
              <h1
                className={`mt-4 mb-[1.4rem] text-[clamp(3.2rem,8vw,6.4rem)] italic tracking-[-0.04em] ${ENTRADA}`}
                style={retraso(120)}
              >
                Inspira <span className="script">Nexum</span>
              </h1>
              <p className={`max-w-[36rem] text-[1.15rem] text-tinta-suave ${ENTRADA}`} style={retraso(260)}>
                <em>Nexum</em> (latín): vínculo, lazo, unión. Somos la marca que une a quienes se quieren a través de
                detalles hechos a mano. Este manual reúne todo lo necesario para que cada pieza se sienta parte de
                la misma familia.
              </p>
            </div>
            <div
              className={`justify-self-center max-[960px]:order-[-1] [&_svg]:h-auto [&_svg]:w-[min(280px,60vw)] [&_.logo-marca__trazo]:[animation-duration:3s] [filter:drop-shadow(0_30px_40px_rgba(194,31,69,0.25))] ${ENTRADA}`}
              style={retraso(300)}
            >
              <LogoMarca tamano={280} animado />
            </div>
          </div>
        </section>

        {/* Concepto */}
        <section className={`${SECCION} contenedor`}>
          <header className={CABECERA} data-reveal="up">
            <p className="etiqueta">01 · Concepto</p>
            <h2 className={TITULO}>El lazo que lo une todo</h2>
            <p className={BAJADA}>
              El símbolo es un lazo de regalo cuyos dos bucles forman un corazón. El nudo central representa a
              Inspira Nexum: el punto donde se encuentran quien regala y quien recibe.
            </p>
          </header>
          <div className="grid grid-cols-4 gap-[1.4rem] max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
            {[
              ["Cálida", "Hablamos como una amiga que te ayuda a sorprender."],
              ["Artesanal", "Todo se hace a mano; lo mostramos con orgullo."],
              ["Detallista", "El moño, la tarjeta, el nombre bien escrito."],
              ["Arequipeña", "Orgullosamente locales, con delivery en la ciudad."],
            ].map(([titulo, texto], i) => (
              <article
                key={titulo}
                className="rounded-marca bg-white p-[1.6rem] shadow-suave"
                data-reveal="up"
                style={retraso(i * 100)}
              >
                <span className="font-display italic text-oro">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-[0.6rem] mb-[0.4rem] text-[1.5rem]">{titulo}</h3>
                <p className="text-[0.95rem] text-tinta-suave">{texto}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Logo */}
        <section className={`${SECCION} bg-rubor`}>
          <div className="contenedor">
            <header className={CABECERA} data-reveal="up">
              <p className="etiqueta">02 · Logotipo</p>
              <h2 className={TITULO}>Símbolo + palabra</h2>
              <p className={BAJADA}>
                &quot;Inspira&quot; en Fraunces itálica transmite cercanía; &quot;NEXUM&quot; en Outfit espaciado aporta orden y
                modernidad. Respeta siempre un área libre igual a la altura del nudo alrededor del logo.
              </p>
            </header>
            <div className={`grid grid-cols-3 gap-[1.4rem] ${APILAR_960}`}>
              <div
                className="flex min-h-[240px] flex-col items-center justify-center gap-[1.6rem] rounded-marca bg-crema shadow-suave [outline:1.5px_dashed_rgba(231,133,122,0.6)] [outline-offset:-18px]"
                data-reveal="up"
              >
                <Logo tamano={64} />
                <small className="text-[0.75rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  Sobre crema (principal)
                </small>
              </div>
              <div
                className="flex min-h-[240px] flex-col items-center justify-center gap-[1.6rem] rounded-marca bg-cacao text-crema shadow-suave [&_.logo__nexum]:text-coral"
                data-reveal="up"
                style={retraso(120)}
              >
                <Logo tamano={64} />
                <small className="text-[0.75rem] font-semibold tracking-[0.16em] uppercase opacity-70">Sobre cacao</small>
              </div>
              <div
                className="flex min-h-[240px] flex-col items-center justify-center gap-[1.6rem] rounded-marca bg-frambuesa text-white shadow-suave [&_.logo__nexum]:text-oro-claro"
                data-reveal="up"
                style={retraso(240)}
              >
                <Logo tamano={64} />
                <small className="text-[0.75rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  Sobre frambuesa
                </small>
              </div>
            </div>
            <div
              className="mt-8 rounded-marca border-[1.5px] border-frambuesa/25 bg-white/60 px-8 py-[1.6rem]"
              data-reveal="up"
            >
              <h3 className="text-[1.2rem] text-frambuesa">Evita</h3>
              <ul className="mt-[0.8rem] grid list-disc grid-cols-2 gap-x-8 gap-y-[0.4rem] pl-[1.2rem] text-tinta-suave max-[960px]:grid-cols-1">
                <li>Deformar o estirar el logo.</li>
                <li>Cambiar los colores del degradado del lazo.</li>
                <li>Colocarlo sobre fotos recargadas sin una base clara.</li>
                <li>Separar el símbolo de la palabra en piezas pequeñas.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Paleta */}
        <section className={`${SECCION} contenedor`}>
          <header className={CABECERA} data-reveal="up">
            <p className="etiqueta">03 · Color</p>
            <h2 className={TITULO}>Una paleta para antojarse</h2>
            <p className={BAJADA}>
              Tonos de repostería (crema, rubor, cacao) como base y tres acentos: uno por marca. El oro es el
              hilo común de lo premium. Haz clic en un color para copiar su código.
            </p>
          </header>
          <div className="grid grid-cols-4 gap-[1.2rem] max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
            {PALETA.map((color, i) => (
              <div key={color.hex} data-reveal="up" style={retraso(i * 70)}>
                <MuestraColor {...color} />
              </div>
            ))}
          </div>
          <div
            className="mt-[1.2rem] flex min-h-[110px] items-end rounded-marca bg-marca p-[1.3rem] font-semibold text-white [background-size:200%_100%] animate-[brillo-texto_6s_ease-in-out_infinite_alternate]"
            data-reveal="up"
          >
            <span>Degradado de marca · Coral → Frambuesa → Vino</span>
          </div>
        </section>

        {/* Tipografía */}
        <section className={`${SECCION} bg-rubor`}>
          <div className="contenedor">
            <header className={CABECERA} data-reveal="up">
              <p className="etiqueta">04 · Tipografía</p>
              <h2 className={TITULO}>Tres voces, un mismo tono</h2>
            </header>
            <div className={`grid grid-cols-3 gap-[1.4rem] ${APILAR_960}`}>
              <article className="rounded-marca bg-white p-[1.8rem] shadow-suave" data-reveal="up">
                <p className="font-display text-[5.5rem] leading-none font-semibold text-frambuesa">Aa</p>
                <h3 className="my-[0.6rem] text-[1.4rem]">Fraunces</h3>
                <p className="text-[0.95rem] text-tinta-suave">
                  Títulos y precios. Serif suave con carácter artesanal. Peso 600, itálica para el logo.
                </p>
              </article>
              <article className="rounded-marca bg-white p-[1.8rem] shadow-suave" data-reveal="up" style={retraso(120)}>
                <p className="font-script text-[5.5rem] leading-none text-coral">Aa</p>
                <h3 className="my-[0.6rem] text-[1.4rem]">Great Vibes</h3>
                <p className="text-[0.95rem] text-tinta-suave">
                  Solo para palabras con emoción: nombres de marca, &quot;conectan&quot;, dedicatorias. Nunca en párrafos.
                </p>
              </article>
              <article className="rounded-marca bg-white p-[1.8rem] shadow-suave" data-reveal="up" style={retraso(240)}>
                <p className="font-body text-[5.5rem] leading-none font-semibold text-pino">Aa</p>
                <h3 className="my-[0.6rem] text-[1.4rem]">Outfit</h3>
                <p className="text-[0.95rem] text-tinta-suave">
                  Texto, botones y etiquetas. Geométrica y legible. Etiquetas en mayúsculas con espaciado amplio.
                </p>
              </article>
            </div>
            <div className="mt-[1.4rem] rounded-marca bg-crema p-[2.2rem]" data-reveal="up">
              <p className="etiqueta">Etiqueta · Outfit 600</p>
              <p className="my-[0.8rem] font-display font-semibold text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.1] tracking-[-0.03em]">
                Detalles que <span className="script">conectan</span>
              </p>
              <p>Texto de párrafo en Outfit 400: claro, cálido y directo, sin tecnicismos.</p>
            </div>
          </div>
        </section>

        {/* Arquitectura */}
        <section className={`${SECCION} contenedor`}>
          <header className={CABECERA} data-reveal="up">
            <p className="etiqueta">05 · Arquitectura de marca</p>
            <h2 className={TITULO}>Una casa, tres marcas</h2>
            <p className={BAJADA}>
              Inspira Nexum es la marca madre. Cada submarca conserva su nombre y su color, y firma con
              &quot;una marca Inspira Nexum&quot;.
            </p>
          </header>
          <div
            className="relative flex justify-center pb-12 after:absolute after:bottom-0 after:left-1/2 after:h-12 after:w-[1.5px] after:bg-oro after:content-['']"
            data-reveal="zoom"
          >
            <div className="rounded-full bg-white px-[2.4rem] py-[1.4rem] shadow-suave">
              <Logo tamano={52} />
            </div>
          </div>
          <div className={`grid grid-cols-3 gap-[1.4rem] border-t-[1.5px] border-oro pt-[1.4rem] ${APILAR_960}`}>
            {SUBMARCAS.map((sub, i) => (
              <article
                key={sub.id}
                className={`overflow-hidden rounded-marca bg-white shadow-suave ${sub.acento}`}
                data-reveal="up"
                style={retraso(i * 140)}
              >
                <div
                  className={`flex min-h-[190px] flex-col items-center justify-center p-6 text-center ${sub.cabecera}`}
                >
                  <p className={sub.claseNombre}>{sub.nombre}</p>
                  {sub.id === "personalizate" && (
                    <small className="text-[0.7rem] font-semibold tracking-[0.6em] text-oro">AREQUIPA</small>
                  )}
                  <p className="mt-2 text-[0.8rem] font-semibold tracking-[0.14em] uppercase opacity-85">{sub.lema}</p>
                </div>
                <dl className="grid gap-[0.8rem] p-6">
                  <div>
                    <dt className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-(--acento)">Rol</dt>
                    <dd className="mt-[0.1rem] text-[0.95rem] text-tinta-suave">{sub.rol}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-(--acento)">Color</dt>
                    <dd className="mt-[0.1rem] text-[0.95rem] text-tinta-suave">{sub.color}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-(--acento)">
                      Tipografía
                    </dt>
                    <dd className="mt-[0.1rem] text-[0.95rem] text-tinta-suave">{sub.tipo}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.72rem] font-semibold tracking-[0.16em] uppercase text-(--acento)">
                      Personalidad
                    </dt>
                    <dd className="mt-[0.1rem] text-[0.95rem] text-tinta-suave">{sub.personalidad}</dd>
                  </div>
                </dl>
                <p className="px-6 pb-[1.4rem] font-display text-[0.9rem] italic text-oro">una marca Inspira Nexum</p>
              </article>
            ))}
          </div>
        </section>

        {/* Voz */}
        <section className={`${SECCION} bg-[linear-gradient(135deg,var(--color-cacao-osc),var(--color-vino))] text-white`}>
          <div className="contenedor">
            <header className={CABECERA} data-reveal="up">
              <p className="etiqueta etiqueta-clara">06 · Voz y tono</p>
              <h2 className={`${TITULO} text-white`}>Hablamos con el corazón</h2>
            </header>
            <div className="grid grid-cols-2 gap-[1.4rem] max-[960px]:grid-cols-1">
              <div className={VOZ} data-reveal="left">
                <h3 className="text-[1.5rem] text-oro-claro">Así sí ✓</h3>
                <ul className="mt-4 grid list-none gap-[0.8rem] p-0">
                  <li className={VOZ_LI}>&quot;¿Para quién es el detalle? Cuéntanos y lo armamos juntos.&quot;</li>
                  <li className={VOZ_LI}>&quot;Bombones pintados a mano, uno por uno.&quot;</li>
                  <li className={VOZ_LI}>&quot;Llegamos justo a tiempo para la sorpresa.&quot;</li>
                </ul>
              </div>
              <div className={VOZ} data-reveal="right">
                <h3 className="text-[1.5rem] text-[#ffb3c1]">Así no ✗</h3>
                <ul className="mt-4 grid list-none gap-[0.8rem] p-0">
                  <li className={`${VOZ_LI} line-through opacity-75 decoration-[rgba(255,179,193,0.7)]`}>
                    &quot;Estimado cliente, su pedido ha sido procesado.&quot;
                  </li>
                  <li className={`${VOZ_LI} line-through opacity-75 decoration-[rgba(255,179,193,0.7)]`}>
                    &quot;¡¡¡OFERTA IMPERDIBLE!!! COMPRA YA.&quot;
                  </li>
                  <li className={`${VOZ_LI} line-through opacity-75 decoration-[rgba(255,179,193,0.7)]`}>
                    &quot;Producto genérico de alta calidad.&quot;
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Movimiento y aplicaciones */}
        <section className={`${SECCION} contenedor`}>
          <header className={CABECERA} data-reveal="up">
            <p className="etiqueta">07 · Movimiento y aplicaciones</p>
            <h2 className={TITULO}>Todo late, nada salta</h2>
            <p className={BAJADA}>
              Las animaciones son suaves y orgánicas: entradas que suben con desenfoque, objetos que flotan y un
              latido para lo importante. Curva base: cubic-bezier(0.22, 1, 0.36, 1).
            </p>
          </header>
          <div className={`grid grid-cols-3 gap-[1.4rem] ${APILAR_960}`}>
            <div className={MOV} data-reveal="up">
              <span className={`${DEMO} animate-[flotar_3s_ease-in-out_infinite]`}>🎁</span>
              <h3>Flotar</h3>
              <p className="text-[0.9rem] text-tinta-suave">Fotos y stickers, 6–7 s</p>
            </div>
            <div className={MOV} data-reveal="up" style={retraso(100)}>
              <span className={`${DEMO} animate-[latido_1.6s_ease-in-out_infinite] text-frambuesa`}>♥</span>
              <h3>Latido</h3>
              <p className="text-[0.9rem] text-tinta-suave">Chips y llamados a la acción</p>
            </div>
            <div className={MOV} data-reveal="up" style={retraso(200)}>
              <span className={DEMO}>
                <LogoMarca
                  tamano={70}
                  animado
                  className="[&_.logo-marca__aro]:stroke-none [&_.logo-marca__trazo]:[animation-direction:alternate] [&_.logo-marca__trazo]:[animation-duration:2.4s] [&_.logo-marca__trazo]:[animation-iteration-count:infinite]"
                />
              </span>
              <h3>Trazo</h3>
              <p className="text-[0.9rem] text-tinta-suave">El lazo se dibuja al aparecer</p>
            </div>
          </div>

          <div className={`mt-16 grid grid-cols-3 items-center gap-8 ${APILAR_960}`}>
            <div
              className="flex flex-col items-center gap-[0.7rem] rounded-[18px] bg-crema px-[1.8rem] py-[2.4rem] text-center shadow-marca [outline:1px_solid_var(--color-oro)] [outline-offset:-12px] rotate-[-3deg]"
              data-reveal="left"
            >
              <LogoMarca tamano={46} />
              <p className="script text-[2.6rem] leading-[1.1]">Para ti, con amor</p>
              <p className="font-display italic text-tinta-suave">Que cada día tenga un motivo para sonreír.</p>
              <span className="mt-[0.6rem] text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-oro">
                Inspira Nexum · Arequipa
              </span>
            </div>
            <div
              className="relative aspect-square overflow-hidden rounded-[22px] shadow-marca"
              data-reveal="zoom"
              style={retraso(120)}
            >
              <Image
                className="object-cover"
                src="/img/dliriz-bombones.jpg"
                alt="Bombones D'Liriz"
                fill
                sizes="320px"
              />
              <div className="absolute inset-0 flex flex-col justify-end gap-[0.2rem] bg-[linear-gradient(to_top,rgba(46,25,18,0.85),transparent_60%)] p-[1.4rem] text-white">
                <span className="font-script text-[2.6rem] leading-none text-[#ffc9c0]">D&apos;Liriz</span>
                <p className="font-display text-[1.2rem] font-semibold">Bombones pintados a mano</p>
                <span className="mt-[0.6rem] w-fit rounded-full bg-white px-[0.8rem] py-[0.35rem] text-[0.78rem] font-semibold text-frambuesa">
                  Pide por WhatsApp
                </span>
              </div>
            </div>
            <div
              className="w-[min(240px,100%)] justify-self-center [&>svg]:h-auto [&>svg]:w-full [&>svg]:[filter:drop-shadow(0_20px_26px_rgba(124,16,48,0.4))]"
              data-reveal="right"
              style={retraso(240)}
            >
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="sticker-circulo" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
                </defs>
                <circle cx="100" cy="100" r="96" fill="var(--color-frambuesa)" />
                <circle cx="100" cy="100" r="88" fill="none" stroke="var(--color-oro-claro)" strokeDasharray="3 5" />
                <text
                  className="font-body text-[14px] font-semibold tracking-[3px] [transform-origin:100px_100px] animate-[girar_30s_linear_infinite]"
                  fill="white"
                >
                  <textPath href="#sticker-circulo">HECHO CON AMOR ✦ COMPARTIENDO AMOR ✦</textPath>
                </text>
                <text x="100" y="112" textAnchor="middle" fill="white" className="font-script text-[44px]">
                  Gracias
                </text>
              </svg>
            </div>
          </div>
        </section>
      </main>
      <PiePagina />
    </>
  );
}
