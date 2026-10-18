import type { Metadata } from "next";
import Image from "next/image";
import type { CSSProperties } from "react";
import { AnimacionesScroll } from "@/components/Efectos";
import { Encabezado } from "@/components/Encabezado";
import { Logo, LogoMarca } from "@/components/Logo";
import { MuestraColor, type MuestraDeColor } from "@/components/Muestra";
import { PiePagina } from "@/components/PiePagina";

export const metadata: Metadata = {
  title: "Manual de marca · Inspira Nexum",
  description: "Logotipo, paleta, tipografía, líneas de negocio y movimiento de Inspira Nexum.",
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
const MOV = "flex flex-col items-center gap-[0.3rem] rounded-marca bg-bruma px-6 py-8 text-center";
const DEMO = "grid h-24 w-24 place-items-center mb-4 rounded-full bg-white text-[2.6rem] shadow-suave";
// Logo sobre fondo oscuro: el logotipo toma color claro (la clase de E.I.R.L. es text-marino-2).
const LOGO_SOBRE_OSCURO =
  "[&_.logo__inspira]:text-white [&_.logo__nexum]:text-white [&_.text-marino-2]:text-white/80";

// ───────── Paleta: nombre, hex y rol según la tabla de tokens (globals.css) ─────────

const PALETA_BASE: MuestraDeColor[] = [
  { nombre: "Lienzo", hex: "#fbfaf7", clase: "bg-lienzo", uso: "Fondo de página", claro: true },
  { nombre: "Bruma", hex: "#eef3f8", clase: "bg-bruma", uso: "Fondos suaves / hover", claro: true },
  { nombre: "Bruma 2", hex: "#d9e3ee", clase: "bg-bruma-2", uso: "Fondos suaves / hover", claro: true },
  { nombre: "Marino", hex: "#1d2b5c", clase: "bg-marino", uso: "Texto / tinta" },
  { nombre: "Marino 2", hex: "#4b5883", clase: "bg-marino-2", uso: "Texto secundario" },
  { nombre: "Marino oscuro", hex: "#111a3b", clase: "bg-marino-osc", uso: "Fondos oscuros" },
];

const PALETA_PETALOS: MuestraDeColor[] = [
  { nombre: "Turquesa", hex: "#0e6b6b", clase: "bg-turquesa", uso: "Pétalo arriba-izquierda" },
  { nombre: "Turquesa claro", hex: "#ddf0ee", clase: "bg-turquesa-claro", uso: "Tinte claro del turquesa", claro: true },
  { nombre: "Celeste", hex: "#1596bd", clase: "bg-celeste", uso: "Pétalo abajo-izquierda" },
  { nombre: "Celeste profundo", hex: "#0e7296", clase: "bg-celeste-osc", uso: "Etiquetas y acentos sobre claro" },
  { nombre: "Magenta", hex: "#b5287f", clase: "bg-magenta", uso: "Pétalo arriba-derecha · Compartiendo Amor" },
  { nombre: "Magenta profundo", hex: "#7e1658", clase: "bg-magenta-osc", uso: "Profundidad y degradados" },
  { nombre: "Dorado", hex: "#ebb147", clase: "bg-dorado", uso: "Pétalo abajo-derecha · destello central", claro: true },
  { nombre: "Dorado claro", hex: "#fbebc8", clase: "bg-dorado-claro", uso: "Texto dorado sobre oscuro", claro: true },
  { nombre: "Dorado profundo", hex: "#a97a1f", clase: "bg-dorado-osc", uso: "Texto dorado sobre claro" },
];

const PALETA_LINEAS: MuestraDeColor[] = [
  { nombre: "Fresa", hex: "#d0243a", clase: "bg-fresa", uso: "D'Liriz · acento (con dorado)" },
  { nombre: "Ébano", hex: "#15110f", clase: "bg-ebano", uso: "Personalízate · fondo" },
  { nombre: "Bronce", hex: "#c49a52", clase: "bg-bronce", uso: "Personalízate · acento sobre ébano", claro: true },
  { nombre: "Alas", hex: "#1565c0", clase: "bg-alas", uso: "Alas hacia el futuro · acento" },
  { nombre: "Alas profundo", hex: "#0b3f8f", clase: "bg-alas-osc", uso: "Alas · profundidad" },
  { nombre: "Alas claro", hex: "#e3eefb", clase: "bg-alas-claro", uso: "Alas · fondos suaves", claro: true },
];

// ───────── Líneas de negocio: tres emprendimientos y una escuela ─────────

// Tarjetas de arquitectura (los tres emprendimientos de la casa).
const SUBMARCAS = [
  {
    id: "dliriz",
    nombre: "D'Liriz",
    lema: "Arte y pasión a tu servicio",
    rol: "Repostería y chocolatería artesanal",
    color: "Fresa + Dorado",
    tipo: "Great Vibes para el nombre, Outfit para el lema",
    personalidad: "Golosa, delicada, artesanal",
    acento: "[--acento:var(--color-fresa)]",
    cabecera: "bg-fresa",
    claseNombre: "font-script text-[3.4rem] leading-[1.1] text-white",
  },
  {
    id: "amor",
    nombre: "Compartiendo Amor",
    lema: "Detalles que abrazan",
    rol: "Arreglos, box temáticos y sorpresas",
    color: "Magenta + Rosa claro",
    tipo: "Great Vibes en blanco sobre magenta",
    personalidad: "Romántica, festiva, sorprendente",
    acento: "[--acento:var(--color-magenta)]",
    cabecera: "bg-[linear-gradient(140deg,var(--color-magenta-osc),var(--color-magenta))] text-white",
    claseNombre: "font-script text-[2.9rem] leading-[1.1] text-white",
  },
  {
    id: "personalizate",
    nombre: "Personalízate",
    lema: "Tu nombre, tu marca, tu estilo",
    rol: "Regalos personalizados y corporativos",
    color: "Ébano + Bronce",
    tipo: "Fraunces + AREQUIPA espaciado en Outfit",
    personalidad: "Elegante, confiable, a medida",
    acento: "[--acento:var(--color-ebano)]",
    cabecera: "bg-ebano",
    claseNombre: "font-display text-[2.2rem] font-semibold leading-[1.1] text-bronce",
  },
];

// Las cuatro líneas: una tarjeta por línea, incluida Alas (escuela de oficios).
const LINEAS = [
  {
    nombre: "D'Liriz",
    tipo: "Emprendimiento",
    lema: "Arte y pasión",
    queHace: "Chocolatería, bombones, queques y bocaditos dulces y salados.",
    cabecera: "bg-fresa text-white",
    claseNombre: "font-script text-[2.8rem] leading-[1.1] text-white",
    colores: [
      { nombre: "Fresa", clase: "bg-fresa" },
      { nombre: "Dorado", clase: "bg-dorado" },
    ],
  },
  {
    nombre: "Compartiendo Amor",
    tipo: "Emprendimiento",
    lema: "Obsequios y detalles",
    queHace: "Arreglos con rosas y peluches, box de golosinas y globos.",
    cabecera: "bg-magenta text-white",
    claseNombre: "font-script text-[2.6rem] leading-[1.1] text-white",
    colores: [
      { nombre: "Magenta", clase: "bg-magenta" },
      { nombre: "Rosa claro", clase: "bg-[#fbe1e6]" },
    ],
  },
  {
    nombre: "Personalízate Arequipa",
    tipo: "Emprendimiento",
    lema: "Tu nombre, tu marca, tu estilo",
    queHace: "Cajas corporativas, tazas y esferas personalizadas.",
    cabecera: "bg-ebano text-bronce",
    claseNombre: "font-display text-[1.9rem] font-semibold leading-[1.1] text-bronce",
    colores: [
      { nombre: "Ébano", clase: "bg-ebano" },
      { nombre: "Bronce", clase: "bg-bronce" },
    ],
  },
  {
    nombre: "Alas hacia el futuro",
    tipo: "Escuela de oficios",
    lema: "Capacitación técnico productiva",
    queHace: "Catering, chocolatería, gelatina y tartas. Cierra con muestra final y certificados.",
    cabecera: "bg-alas text-white",
    claseNombre: "font-display text-[1.9rem] font-semibold leading-[1.1] text-white",
    colores: [
      { nombre: "Azul real", clase: "bg-alas" },
      { nombre: "Azul profundo", clase: "bg-alas-osc" },
      { nombre: "Azul claro", clase: "bg-alas-claro" },
    ],
  },
];

// Ejemplos de botones: cada variante con su fondo para que se lea el contraste.
const BOTONES = [
  { clase: "boton boton-primario", texto: "Pide tu detalle", nota: "Primario · degradado de marca", fondo: "bg-white" },
  { clase: "boton boton-fantasma", texto: "Ver catálogo", nota: "Fantasma · contorno marino", fondo: "bg-white" },
  { clase: "boton boton-dorado", texto: "Hazlo tuyo", nota: "Dorado · acento premium", fondo: "bg-white" },
  { clase: "boton boton-ebano", texto: "Personalizar", nota: "Ébano · Personalízate", fondo: "bg-white" },
  { clase: "boton boton-alas", texto: "Inscríbete", nota: "Alas · escuela de oficios", fondo: "bg-white" },
  { clase: "boton boton-blanco", texto: "Escríbenos", nota: "Blanco · sobre fondos oscuros", fondo: "bg-marino-osc" },
  { clase: "boton boton-primario boton-chico", texto: "Pedir", nota: "Chico · acciones en listas", fondo: "bg-white" },
];

function GrupoColores({
  titulo,
  nota,
  colores,
}: {
  titulo: string;
  nota: string;
  colores: MuestraDeColor[];
}) {
  return (
    <div className="mb-[3rem]">
      <h3 className="mb-[0.4rem] text-[1.4rem]">{titulo}</h3>
      <p className="mb-[1.2rem] text-[0.95rem] text-tinta-suave">{nota}</p>
      <div className="grid grid-cols-4 gap-[1.2rem] max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
        {colores.map((color, i) => (
          <div key={color.clase} data-reveal="up" style={retraso(i * 60)}>
            <MuestraColor {...color} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Branding() {
  return (
    <>
      <AnimacionesScroll />
      <Encabezado />
      <main>
        {/* Portada */}
        <section className="relative overflow-hidden bg-lienzo bg-[radial-gradient(ellipse_at_85%_30%,rgba(21,150,189,0.25),transparent_55%),radial-gradient(ellipse_at_10%_90%,rgba(235,177,71,0.18),transparent_50%)] pt-[150px] pb-[90px]">
          <div className="contenedor grid grid-cols-[1.3fr_1fr] items-center gap-12 max-[960px]:grid-cols-1">
            <div>
              <p className={`etiqueta ${ENTRADA}`}>Manual de marca · v2.0</p>
              <h1
                className={`mt-4 mb-[1.4rem] text-[clamp(3.2rem,8vw,6.4rem)] italic tracking-[-0.04em] ${ENTRADA}`}
                style={retraso(120)}
              >
                Inspira <span className="script">Nexum</span>
              </h1>
              <p className={`max-w-[36rem] text-[1.15rem] text-tinta-suave ${ENTRADA}`} style={retraso(260)}>
                <em>Nexum</em> (latín): vínculo, unión. Cuatro pétalos, cuatro líneas de negocio y un solo destello
                que las conecta. Este manual reúne todo lo necesario para que cada pieza se sienta parte de la misma
                familia.
              </p>
            </div>
            <div
              className={`justify-self-center max-[960px]:order-[-1] [&_svg]:h-auto [&_svg]:w-[min(280px,60vw)] [&_.logo-marca__trazo]:[animation-duration:3s] [filter:drop-shadow(0_30px_40px_rgba(181,40,127,0.25))] ${ENTRADA}`}
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
            <h2 className={TITULO}>Los cuatro pétalos</h2>
            <p className={BAJADA}>
              La flor tiene cuatro pétalos: turquesa, celeste, magenta y dorado. Cada pétalo es una línea de negocio,
              y el destello dorado del centro es el nexum: el vínculo que las une a todas.
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
                <span className="font-display italic text-dorado-osc">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-[0.6rem] mb-[0.4rem] text-[1.5rem]">{titulo}</h3>
                <p className="text-[0.95rem] text-tinta-suave">{texto}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Logo */}
        <section className={`${SECCION} bg-bruma`}>
          <div className="contenedor">
            <header className={CABECERA} data-reveal="up">
              <p className="etiqueta">02 · Logotipo</p>
              <h2 className={TITULO}>Flor + palabra</h2>
              <p className={BAJADA}>
                La flor de cuatro pétalos va junto a INSPIRA NEXUM E.I.R.L., que se escribe en sans bold (Outfit) y en
                mayúsculas; E.I.R.L. va debajo, en tamaño pequeño. No usamos la itálica ni la firma manuscrita en el
                logotipo. Respeta un área libre igual a la altura del destello alrededor del logo.
              </p>
            </header>
            <div className={`grid grid-cols-3 gap-[1.4rem] ${APILAR_960}`}>
              <div
                className="flex min-h-[240px] flex-col items-center justify-center gap-[1.6rem] rounded-marca bg-lienzo shadow-suave [outline:1.5px_dashed_rgba(21,150,189,0.6)] [outline-offset:-18px]"
                data-reveal="up"
              >
                <Logo tamano={64} />
                <small className="text-[0.75rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  Sobre lienzo (principal)
                </small>
              </div>
              <div
                className={`flex min-h-[240px] flex-col items-center justify-center gap-[1.6rem] rounded-marca bg-marino text-white shadow-suave ${LOGO_SOBRE_OSCURO}`}
                data-reveal="up"
                style={retraso(120)}
              >
                <Logo tamano={64} />
                <small className="text-[0.75rem] font-semibold tracking-[0.16em] uppercase opacity-70">Sobre marino</small>
              </div>
              <div
                className={`flex min-h-[240px] flex-col items-center justify-center gap-[1.6rem] rounded-marca bg-magenta-osc text-white shadow-suave ${LOGO_SOBRE_OSCURO}`}
                data-reveal="up"
                style={retraso(240)}
              >
                <Logo tamano={64} />
                <small className="text-[0.75rem] font-semibold tracking-[0.16em] uppercase opacity-70">
                  Sobre magenta profundo
                </small>
              </div>
            </div>
            <div
              className="mt-8 rounded-marca border-[1.5px] border-magenta/25 bg-white/60 px-8 py-[1.6rem]"
              data-reveal="up"
            >
              <h3 className="text-[1.2rem] text-magenta">Evita</h3>
              <ul className="mt-[0.8rem] grid list-disc grid-cols-2 gap-x-8 gap-y-[0.4rem] pl-[1.2rem] text-tinta-suave max-[960px]:grid-cols-1">
                <li>Deformar o estirar el logo.</li>
                <li>Cambiar los colores de los pétalos o del destello central.</li>
                <li>Girar la flor o dibujarla con otro número de pétalos.</li>
                <li>Colocarlo sobre fotos recargadas sin una base clara.</li>
                <li>Separar la flor de la palabra en piezas pequeñas.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Paleta */}
        <section className={`${SECCION} contenedor`}>
          <header className={CABECERA} data-reveal="up">
            <p className="etiqueta">03 · Color</p>
            <h2 className={TITULO}>Una paleta de pétalos</h2>
            <p className={BAJADA}>
              Lienzo, bruma y marino son la base. Los cuatro pétalos de la flor son el color de la madre, y cada línea
              de negocio tiene el suyo. Haz clic en un color para copiar su código.
            </p>
          </header>
          <GrupoColores
            titulo="Base"
            nota="Fondos de página, superficies suaves y tinta."
            colores={PALETA_BASE}
          />
          <GrupoColores
            titulo="Pétalos de la madre"
            nota="Los cuatro pétalos del logotipo de Inspira Nexum E.I.R.L., con sus tintes."
            colores={PALETA_PETALOS}
          />
          <GrupoColores
            titulo="Líneas de negocio"
            nota="Colores propios de D'Liriz, Personalízate y Alas. Compartiendo Amor usa el magenta de la flor."
            colores={PALETA_LINEAS}
          />
          <div
            className="mt-[1.2rem] flex min-h-[110px] items-end rounded-marca bg-marca p-[1.3rem] font-semibold text-white [background-size:200%_100%] animate-[brillo-texto_6s_ease-in-out_infinite_alternate]"
            data-reveal="up"
          >
            <span>Degradado de marca (bg-marca) · Turquesa → Celeste → Magenta</span>
          </div>
        </section>

        {/* Tipografía */}
        <section className={`${SECCION} bg-bruma`}>
          <div className="contenedor">
            <header className={CABECERA} data-reveal="up">
              <p className="etiqueta">04 · Tipografía</p>
              <h2 className={TITULO}>Tres voces, un mismo tono</h2>
            </header>
            <div className={`grid grid-cols-3 gap-[1.4rem] ${APILAR_960}`}>
              <article className="rounded-marca bg-white p-[1.8rem] shadow-suave" data-reveal="up">
                <p className="font-display text-[5.5rem] leading-none font-semibold text-magenta">Aa</p>
                <h3 className="my-[0.6rem] text-[1.4rem]">Fraunces</h3>
                <p className="text-[0.95rem] text-tinta-suave">
                  Display: títulos, nombres de sección y precios. Serif suave con carácter artesanal. Peso 600.
                </p>
              </article>
              <article className="rounded-marca bg-white p-[1.8rem] shadow-suave" data-reveal="up" style={retraso(120)}>
                <p className="font-script text-[5.5rem] leading-none text-celeste">Aa</p>
                <h3 className="my-[0.6rem] text-[1.4rem]">Great Vibes</h3>
                <p className="text-[0.95rem] text-tinta-suave">
                  Firma: solo para palabras con emoción, como &quot;conectan&quot; o los nombres de marca. Nunca en
                  párrafos.
                </p>
              </article>
              <article className="rounded-marca bg-white p-[1.8rem] shadow-suave" data-reveal="up" style={retraso(240)}>
                <p className="font-body text-[5.5rem] leading-none font-semibold text-turquesa">Aa</p>
                <h3 className="my-[0.6rem] text-[1.4rem]">Outfit</h3>
                <p className="text-[0.95rem] text-tinta-suave">
                  Cuerpo: texto, botones, etiquetas y logotipo (sans bold en mayúsculas). Geométrica y legible.
                </p>
              </article>
            </div>
            <div className="mt-[1.4rem] rounded-marca bg-lienzo p-[2.2rem]" data-reveal="up">
              <p className="etiqueta">Etiqueta · Outfit 600</p>
              <p className="my-[0.8rem] font-display font-semibold text-[clamp(2rem,4.5vw,3.4rem)] leading-[1.1] tracking-[-0.03em]">
                Detalles que <span className="script">conectan</span>
              </p>
              <p>Texto de párrafo en Outfit 400: claro, cálido y directo, sin tecnicismos.</p>
            </div>
            <div className="mt-[1.4rem] rounded-marca bg-lienzo p-[2.2rem]" data-reveal="up">
              <p className="etiqueta">Botones · utilidades boton-*</p>
              <div className={`mt-6 grid grid-cols-3 gap-[1.2rem] ${APILAR_960}`}>
                {BOTONES.map((b, i) => (
                  <div
                    key={b.clase}
                    className={`flex flex-col items-start gap-[0.9rem] rounded-marca p-[1.4rem] shadow-suave ${b.fondo}`}
                    data-reveal="up"
                    style={retraso(i * 60)}
                  >
                    <span className={b.clase}>{b.texto}</span>
                    <small
                      className={`text-[0.82rem] ${b.fondo === "bg-marino-osc" ? "text-white/75" : "text-tinta-suave"}`}
                    >
                      {b.nota}
                    </small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Arquitectura */}
        <section className={`${SECCION} contenedor`}>
          <header className={CABECERA} data-reveal="up">
            <p className="etiqueta">05 · Arquitectura de marca</p>
            <h2 className={TITULO}>Una casa, tres marcas</h2>
            <p className={BAJADA}>
              Inspira Nexum es la marca madre, la flor de cuatro pétalos. Cada emprendimiento conserva su nombre y su
              color, y firma con &quot;una marca Inspira Nexum&quot;. La escuela Alas aparece en la sección siguiente.
            </p>
          </header>
          <div
            className="relative flex justify-center pb-12 after:absolute after:bottom-0 after:left-1/2 after:h-12 after:w-[1.5px] after:bg-dorado after:content-['']"
            data-reveal="zoom"
          >
            <div className="rounded-full bg-white px-[2.4rem] py-[1.4rem] shadow-suave">
              <Logo tamano={52} />
            </div>
          </div>
          <div className={`grid grid-cols-3 gap-[1.4rem] border-t-[1.5px] border-dorado pt-[1.4rem] ${APILAR_960}`}>
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
                    <small className="text-[0.7rem] font-semibold tracking-[0.6em] text-bronce">AREQUIPA</small>
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
                <p className="px-6 pb-[1.4rem] font-display text-[0.9rem] italic text-dorado-osc">
                  una marca Inspira Nexum
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Las cuatro líneas */}
        <section className={`${SECCION} bg-lienzo`}>
          <div className="contenedor">
            <header className={CABECERA} data-reveal="up">
              <p className="etiqueta">06 · Las cuatro líneas</p>
              <h2 className={TITULO}>Un pétalo por línea</h2>
              <p className={BAJADA}>
                Tres son emprendimientos de producto. La cuarta, Alas hacia el futuro, es la escuela de oficios de
                Inspira Nexum: capacitación técnico productiva que enseña un oficio y entrega certificado.
              </p>
            </header>
            <div className="grid grid-cols-4 gap-[1.2rem] max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
              {LINEAS.map((linea, i) => (
                <article
                  key={linea.nombre}
                  className="flex flex-col overflow-hidden rounded-marca bg-white shadow-suave"
                  data-reveal="up"
                  style={retraso(i * 90)}
                >
                  <div className={`flex min-h-[170px] flex-col justify-end gap-[0.4rem] p-6 ${linea.cabecera}`}>
                    <small className="text-[0.7rem] font-semibold tracking-[0.16em] uppercase opacity-85">
                      {linea.tipo}
                    </small>
                    <p className={linea.claseNombre}>{linea.nombre}</p>
                  </div>
                  <div className="grid flex-1 content-start gap-[0.8rem] p-6">
                    <p className="font-display text-[1.05rem] italic text-marino">{linea.lema}</p>
                    <p className="text-[0.95rem] text-tinta-suave">{linea.queHace}</p>
                    <ul className="mt-auto flex list-none flex-wrap gap-x-[1rem] gap-y-[0.5rem] p-0 pt-2">
                      {linea.colores.map((c) => (
                        <li key={c.clase} className="flex items-center gap-[0.45rem] text-[0.85rem] font-semibold">
                          <span className={`size-4 rounded-full ring-1 ring-marino/15 ${c.clase}`} aria-hidden="true" />
                          {c.nombre}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Voz */}
        <section className={`${SECCION} bg-[linear-gradient(135deg,var(--color-marino-osc),var(--color-magenta-osc))] text-white`}>
          <div className="contenedor">
            <header className={CABECERA} data-reveal="up">
              <p className="etiqueta etiqueta-clara">07 · Voz y tono</p>
              <h2 className={`${TITULO} text-white`}>Hablamos con el corazón</h2>
            </header>
            <div className="grid grid-cols-2 gap-[1.4rem] max-[960px]:grid-cols-1">
              <div className={VOZ} data-reveal="left">
                <h3 className="text-[1.5rem] text-dorado-claro">Así sí ✓</h3>
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
            <p className="etiqueta">08 · Movimiento y aplicaciones</p>
            <h2 className={TITULO}>Todo late, nada salta</h2>
            <p className={BAJADA}>
              Las animaciones son suaves y orgánicas: entradas que suben con desenfoque, objetos que flotan y un
              latido para lo importante. Curva base: cubic-bezier(0.22, 1, 0.36, 1).
            </p>
          </header>
          <div className={`grid grid-cols-3 gap-[1.4rem] ${APILAR_960}`}>
            <div className={MOV} data-reveal="up">
              <span className={`${DEMO} text-turquesa animate-[flotar_3s_ease-in-out_infinite]`}>✿</span>
              <h3>Flotar</h3>
              <p className="text-[0.9rem] text-tinta-suave">Fotos y stickers, 6–7 s</p>
            </div>
            <div className={MOV} data-reveal="up" style={retraso(100)}>
              <span className={`${DEMO} animate-[latido_1.6s_ease-in-out_infinite] text-magenta`}>♥</span>
              <h3>Latido</h3>
              <p className="text-[0.9rem] text-tinta-suave">Chips y llamados a la acción</p>
            </div>
            <div className={MOV} data-reveal="up" style={retraso(200)}>
              <span className={DEMO}>
                <LogoMarca
                  tamano={70}
                  animado
                  className="[&_.logo-marca__trazo]:[animation-direction:alternate] [&_.logo-marca__trazo]:[animation-duration:2.4s] [&_.logo-marca__trazo]:[animation-iteration-count:infinite]"
                />
              </span>
              <h3>Pétalos</h3>
              <p className="text-[0.9rem] text-tinta-suave">Los cuatro pétalos aparecen uno a uno</p>
            </div>
          </div>

          <div className={`mt-16 grid grid-cols-3 items-center gap-8 ${APILAR_960}`}>
            <div
              className="flex flex-col items-center gap-[0.7rem] rounded-[18px] bg-lienzo px-[1.8rem] py-[2.4rem] text-center shadow-marca [outline:1px_solid_var(--color-dorado)] [outline-offset:-12px] rotate-[-3deg]"
              data-reveal="left"
            >
              <LogoMarca tamano={46} />
              <p className="script text-[2.6rem] leading-[1.1]">Para ti, con amor</p>
              <p className="font-display italic text-tinta-suave">Que cada día tenga un motivo para sonreír.</p>
              <span className="mt-[0.6rem] text-[0.68rem] font-semibold tracking-[0.2em] uppercase text-dorado-osc">
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
              <div className="absolute inset-0 flex flex-col justify-end gap-[0.2rem] bg-[linear-gradient(to_top,rgba(17,26,59,0.85),transparent_60%)] p-[1.4rem] text-white">
                <span className="font-script text-[2.6rem] leading-none text-[#ffc9c0]">D&apos;Liriz</span>
                <p className="font-display text-[1.2rem] font-semibold">Bombones pintados a mano</p>
                <span className="mt-[0.6rem] w-fit rounded-full bg-white px-[0.8rem] py-[0.35rem] text-[0.78rem] font-semibold text-magenta">
                  Pide por WhatsApp
                </span>
              </div>
            </div>
            <div
              className="w-[min(240px,100%)] justify-self-center [&>svg]:h-auto [&>svg]:w-full [&>svg]:[filter:drop-shadow(0_20px_26px_rgba(126,22,88,0.4))]"
              data-reveal="right"
              style={retraso(240)}
            >
              <svg viewBox="0 0 200 200">
                <defs>
                  <path id="sticker-circulo" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0" />
                </defs>
                <circle cx="100" cy="100" r="96" fill="var(--color-magenta)" />
                <circle cx="100" cy="100" r="88" fill="none" stroke="var(--color-dorado-claro)" strokeDasharray="3 5" />
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
