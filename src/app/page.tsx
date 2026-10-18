import Image from "next/image";
import type { CSSProperties } from "react";
import { AnimacionesScroll, Contador, Parallax, Tilt } from "@/components/Efectos";
import { Encabezado } from "@/components/Encabezado";
import { IconoWhatsApp } from "@/components/Iconos";
import { LogoMarca } from "@/components/Logo";
import { Ocasiones } from "@/components/Ocasiones";
import { PiePagina } from "@/components/PiePagina";
import {
  CATEGORIAS_DLIRIZ,
  enlaceWhatsApp,
  MARCAS,
  MARQUESINA,
  PRODUCTOS_AMOR,
  PRODUCTOS_PERSONALIZATE,
} from "@/data/sitio";

const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;

export default function Inicio() {
  return (
    <>
      <AnimacionesScroll />
      <Encabezado />
      <main>
        <Hero />
        <Marquesina />
        <Marcas />
        <SeccionDliriz />
        <SeccionCompartiendoAmor />
        <SeccionPersonalizate />
        <SeccionOcasiones />
        <ComoPedir />
        <LlamadoFinal />
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

/* ───────────────────────── Hero ───────────────────────── */

// Entrada escalonada: el retraso llega por style={retraso(ms)} (--retraso).
const ENTRADA = "animate-[entrar_1.1s_var(--ease-suave)_var(--retraso,0ms)_both]";
// Collage: cada pieza se desplaza según --px/--py (Parallax) y su --d; gira con --rot.
const PIEZA =
  "absolute transition-transform duration-[0.6s] ease-suave will-change-transform [transform:translate3d(calc(var(--px)*var(--d)*1px),calc(var(--py)*var(--d)*1px),0)_rotate(var(--rot,0deg))]";
// Contenedor interno: aparece (aparecer) y flota (flotar) con retrasos desde --retraso.
const FLOTAR =
  "relative animate-[aparecer_1.2s_var(--ease-suave)_calc(var(--retraso,0ms)_+_300ms)_both,flotar_7s_ease-in-out_calc(var(--retraso,0ms)_+_1500ms)_infinite]";
const IMAGEN_COLLAGE = "h-auto w-full rounded-[20px] border-[7px] border-white bg-white shadow-marca";

function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-crema bg-[image:radial-gradient(ellipse_at_80%_10%,rgba(231,133,122,0.18),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(201,154,75,0.14),transparent_50%)] pt-[120px] pb-[90px] max-[960px]:pt-[110px]"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute top-[-120px] left-[-100px] h-[420px] w-[420px] rounded-full bg-rubor-2 blur-[60px] opacity-[0.55] animate-[deriva_18s_ease-in-out_infinite_alternate]" />
        <span className="absolute top-[30%] right-[-120px] h-[360px] w-[360px] rounded-full bg-[rgba(231,133,122,0.45)] blur-[60px] opacity-[0.55] animate-[deriva_18s_ease-in-out_-6s_infinite_alternate]" />
        <span className="absolute bottom-[-120px] left-[35%] h-[300px] w-[300px] rounded-full bg-oro-claro blur-[60px] opacity-[0.55] animate-[deriva_18s_ease-in-out_-12s_infinite_alternate]" />
        <Destellos />
      </div>

      <div className="contenedor relative grid grid-cols-[1.05fr_1fr] items-center gap-12 max-[960px]:grid-cols-1">
        <div>
          <p className={`etiqueta etiqueta-sin-raya ${ENTRADA}`} style={retraso(0)}>
            <span className="punto-vivo" /> Hecho a mano en Arequipa
          </p>
          <h1 className="mt-[1.2rem] mb-6 text-[clamp(3rem,6.6vw,5.9rem)] leading-[0.98] tracking-[-0.035em]">
            <span className={`block ${ENTRADA}`} style={retraso(120)}>
              Detalles que
            </span>
            <span
              className="relative block w-fit py-0 pr-[0.15em] pl-[0.05em] mt-[-0.05em] mb-[-0.12em] font-script font-normal text-[1.32em] leading-[1.05] tracking-normal bg-marca bg-[length:200%_100%] bg-clip-text text-transparent animate-[entrar_1.1s_var(--ease-suave)_var(--retraso,0ms)_both,brillo-texto_6s_ease-in-out_1.4s_infinite_alternate]"
              style={retraso(260)}
            >
              conectan
              <svg
                className="absolute bottom-[-0.02em] left-[4%] h-[0.22em] w-[92%] overflow-visible"
                viewBox="0 0 300 24"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  pathLength={1}
                  d="M4 16 C 60 4, 120 22, 180 10 S 270 6, 296 14"
                  className="fill-none stroke-oro [stroke-width:5] [stroke-linecap:round] [stroke-dasharray:1] [stroke-dashoffset:1] animate-[dibujar_1.4s_var(--ease-suave)_1.1s_forwards]"
                />
              </svg>
            </span>
            <span className={`block ${ENTRADA}`} style={retraso(400)}>
              corazones
            </span>
          </h1>
          <p className={`max-w-[34rem] text-[1.15rem] text-tinta-suave ${ENTRADA}`} style={retraso(540)}>
            Somos <strong className="text-tinta">Inspira Nexum</strong>: la casa de{" "}
            <em className="font-medium not-italic text-coral-osc">D&apos;Liriz</em>,{" "}
            <em className="font-medium not-italic text-coral-osc">Compartiendo Amor</em> y{" "}
            <em className="font-medium not-italic text-coral-osc">Personalízate Arequipa</em>. Chocolates, arreglos y
            regalos personalizados que dicen lo que sientes, sin decir una palabra.
          </p>
          <div className={`mt-8 flex flex-wrap gap-[0.9rem] ${ENTRADA}`} style={retraso(680)}>
            <a
              className="group boton boton-primario"
              href={enlaceWhatsApp("¡Hola Inspira Nexum! Quiero armar un regalo 🎁")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Armar mi regalo
              <span
                className="inline-block transition-[translate] duration-[0.35s] ease-suave group-hover:translate-x-[5px]"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a className="boton boton-fantasma" href="#marcas">
              Ver nuestras marcas
            </a>
          </div>
          <dl
            className={`mt-[2.6rem] flex gap-[2.4rem] border-t border-[rgba(74,42,32,0.12)] pt-[1.6rem] max-[600px]:gap-[1.4rem] ${ENTRADA}`}
            style={retraso(820)}
          >
            <div>
              <dt className="font-display text-[2.2rem] leading-none font-semibold text-frambuesa max-[600px]:text-[1.8rem]">
                <Contador hasta={3} />
              </dt>
              <dd className="mt-[0.35rem] text-[0.88rem] text-tinta-suave">marcas, una familia</dd>
            </div>
            <div>
              <dt className="font-display text-[2.2rem] leading-none font-semibold text-frambuesa max-[600px]:text-[1.8rem]">
                <Contador hasta={100} sufijo="%" />
              </dt>
              <dd className="mt-[0.35rem] text-[0.88rem] text-tinta-suave">personalizable</dd>
            </div>
            <div>
              <dt className="font-display text-[2.2rem] leading-none font-semibold text-frambuesa max-[600px]:text-[1.8rem]">
                <Contador hasta={7} />
              </dt>
              <dd className="mt-[0.35rem] text-[0.88rem] text-tinta-suave">ocasiones al año</dd>
            </div>
          </dl>
        </div>

        <Parallax className="relative aspect-[1/1.02] max-h-[640px] w-full [--px:0] [--py:0] max-[960px]:mx-auto max-[960px]:max-w-[560px]">
          <div className={`${PIEZA} top-[4%] left-0 z-[1] w-[40%]`} style={{ "--d": 18, "--rot": "-9deg" } as CSSProperties}>
            <div className={FLOTAR} style={retraso(300)}>
              <Image src="/img/halloween.jpg" alt="Box de golosinas de Halloween con globos" width={716} height={960} sizes="220px" priority className={IMAGEN_COLLAGE} />
            </div>
          </div>
          <div className={`${PIEZA} top-[14%] left-[29%] z-[3] w-[42%]`} style={{ "--d": 34, "--rot": "-3deg" } as CSSProperties}>
            <div className={FLOTAR} style={retraso(0)}>
              <Image src="/img/arreglo-amor.jpg" alt="Arreglo con rosas rojas y peluche de Compartiendo Amor" width={300} height={413} sizes="260px" priority className={IMAGEN_COLLAGE} />
              <span className="absolute bottom-[-18px] left-1/2 -translate-x-1/2 -rotate-3 rounded-full bg-frambuesa px-[1.1rem] pt-[0.35rem] pb-[0.45rem] font-script text-[1.45rem] leading-[1.1] whitespace-nowrap text-white shadow-[0_12px_24px_-10px_rgba(194,31,69,0.7)]">
                Con amor para ti ♥
              </span>
            </div>
          </div>
          <div className={`${PIEZA} top-0 right-0 z-[2] w-[37%]`} style={{ "--d": 26, "--rot": "7deg" } as CSSProperties}>
            <div className={FLOTAR} style={retraso(600)}>
              <Image src="/img/caja-corporativa.jpg" alt="Caja premium corporativa navideña personalizada" width={288} height={333} sizes="220px" priority className={IMAGEN_COLLAGE} />
            </div>
          </div>
          <div className={`${PIEZA} bottom-[2%] left-[7%] z-[4] w-[25%]`} style={{ "--d": 48, "--rot": "0deg" } as CSSProperties}>
            <div className={FLOTAR} style={retraso(900)}>
              <Image
                src="/img/dliriz-bombones.jpg"
                alt="Bombones de colores D'Liriz"
                width={496}
                height={336}
                sizes="130px"
                className="aspect-square h-auto w-full rounded-full border-[7px] border-white bg-white object-cover shadow-marca"
              />
            </div>
          </div>
          <div className={`${PIEZA} right-[4%] bottom-[3%] z-[5] w-[27%]`} style={{ "--d": -20 } as CSSProperties} aria-hidden="true">
            <SelloGiratorio />
          </div>
        </Parallax>
      </div>

      <a
        href="#marcas"
        className="absolute bottom-[26px] left-1/2 h-[42px] w-[26px] -translate-x-1/2 rounded-[14px] border-2 border-[rgba(74,42,32,0.4)]"
        aria-label="Bajar a nuestras marcas"
      >
        <span className="absolute top-2 left-1/2 -ml-0.5 h-2 w-1 rounded-[2px] bg-frambuesa animate-[rueda_1.8s_var(--ease-suave)_infinite]" />
      </a>
    </section>
  );
}

function SelloGiratorio() {
  return (
    <svg viewBox="0 0 200 200" className="h-auto w-full overflow-visible animate-[aparecer_1s_var(--ease-rebote)_1.2s_both]">
      <defs>
        <path id="sello-circulo" d="M100,100 m-74,0 a74,74 0 1,1 148,0 a74,74 0 1,1 -148,0" />
      </defs>
      <circle cx="100" cy="100" r="98" className="fill-cacao" />
      <text className="fill-oro-claro font-body text-[15.5px] font-semibold tracking-[3.2px] [transform-origin:100px_100px] animate-[girar_22s_linear_infinite]">
        <textPath href="#sello-circulo">HECHO A MANO ✦ CON AMOR ✦ EN AREQUIPA ✦</textPath>
      </text>
      <g transform="translate(68 68)">
        <LogoMarca tamano={64} />
      </g>
    </svg>
  );
}

function Destellos() {
  const destellos = [
    { x: "8%", y: "22%", s: 14, d: 0 },
    { x: "46%", y: "12%", s: 10, d: 1.2 },
    { x: "92%", y: "18%", s: 16, d: 0.6 },
    { x: "56%", y: "86%", s: 12, d: 2 },
    { x: "4%", y: "78%", s: 10, d: 1.6 },
    { x: "84%", y: "74%", s: 9, d: 2.6 },
  ];
  const corazones = [
    { x: "18%", d: 0, s: 18 },
    { x: "38%", d: 4, s: 12 },
    { x: "66%", d: 2, s: 16 },
    { x: "88%", d: 6, s: 12 },
  ];
  return (
    <>
      {destellos.map((d, i) => (
        <svg
          key={`d${i}`}
          className="absolute fill-oro animate-[titilar_3.2s_ease-in-out_infinite]"
          viewBox="0 0 24 24"
          width={d.s}
          height={d.s}
          style={{ left: d.x, top: d.y, animationDelay: `${d.d}s` }}
        >
          <path d="M12 0 C 13 8, 16 11, 24 12 C 16 13, 13 16, 12 24 C 11 16, 8 13, 0 12 C 8 11, 11 8, 12 0 Z" />
        </svg>
      ))}
      {corazones.map((c, i) => (
        <svg
          key={`c${i}`}
          className="absolute bottom-[-30px] fill-coral opacity-0 animate-[subir_14s_linear_infinite]"
          viewBox="0 0 24 24"
          width={c.s}
          height={c.s}
          style={{ left: c.x, animationDelay: `${c.d}s` }}
        >
          <path d="M12 21 C 5 15, 1 11, 1 7 A 5 5 0 0 1 12 5 A 5 5 0 0 1 23 7 C 23 11, 19 15, 12 21 Z" />
        </svg>
      ))}
    </>
  );
}

/* ───────────────────────── Marquesina ───────────────────────── */

function Marquesina() {
  const fila = [...MARQUESINA, ...MARQUESINA];
  const item =
    "inline-flex items-center gap-[1.6rem] pr-[1.6rem] font-display text-[clamp(1.3rem,2.4vw,2rem)] font-medium whitespace-nowrap";
  const contorno = "italic text-transparent [-webkit-text-stroke:1px_rgba(255,248,243,0.55)]";
  const separador = "text-[0.8em] text-coral [-webkit-text-stroke:0]";
  // La pausa al pasar el cursor por la marquesina se hereda por el grupo.
  return (
    <section
      className="group relative z-[2] -mx-[2%] -rotate-[1.5deg] overflow-hidden bg-cacao py-[1.4rem] text-crema shadow-marca"
      aria-label="Lo que hacemos"
    >
      <div className="flex w-max animate-[desplazar_40s_linear_infinite] group-hover:[animation-play-state:paused]">
        {fila.map((texto, i) => (
          <span key={i} className={item} aria-hidden={i >= MARQUESINA.length}>
            {texto}
            <span className={separador} aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
      <div
        className="mt-[0.4rem] flex w-max animate-[desplazar_55s_linear_infinite_reverse] group-hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
        {fila.map((texto, i) => (
          <span key={i} className={`${item} ${contorno}`}>
            {texto}
            <span className={separador}>♥</span>
          </span>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────── Marcas ───────────────────────── */

type IdMarca = (typeof MARCAS)[number]["id"];

// Acento de cada marca (antes --acento) y par fondo/texto de los chips (antes --chip-*).
const ACENTO_MARCA: Record<IdMarca, string> = {
  dliriz: "text-coral",
  "compartiendo-amor": "text-frambuesa",
  personalizate: "text-pino",
};

const CHIP_MARCA: Record<IdMarca, string> = {
  dliriz: "bg-rubor text-cacao",
  "compartiendo-amor": "bg-[#fbe1e6] text-vino",
  personalizate: "bg-pino-claro text-pino",
};

function Marcas() {
  return (
    <section className="relative py-[clamp(5rem,10vw,8.5rem)] relative" id="marcas">
      <div className="contenedor">
        <header className="mb-14 max-w-[44rem]" data-reveal="up">
          <p className="etiqueta">Una familia, tres formas de emocionar</p>
          <h2 className="my-4 text-[clamp(2.3rem,4.6vw,3.7rem)] tracking-[-0.03em]">
            Cada marca, un <span className="script">lazo</span> distinto
          </h2>
          <p className="text-[1.12rem] text-tinta-suave">
            <em>Nexum</em> significa vínculo. Eso hacemos: unir personas a través de detalles pensados con el
            corazón y hechos con las manos.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-[1.8rem] max-[960px]:mx-auto max-[960px]:max-w-[560px] max-[960px]:grid-cols-1">
          {MARCAS.map((marca, i) => (
            <div key={marca.id} data-reveal="up" style={retraso(i * 140)}>
              <Tilt className="group h-full rounded-[28px]">
                <a
                  href={`#${marca.id}`}
                  className="relative flex h-full flex-col overflow-hidden rounded-[inherit] bg-white no-underline shadow-suave transition-shadow duration-500 ease-suave group-hover:shadow-marca"
                >
                  <div className="relative h-60 overflow-hidden after:absolute after:inset-0 after:content-[''] after:bg-[linear-gradient(to_top,white_0%,transparent_45%)]">
                    <Image
                      src={marca.imagen}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[1.2s] ease-suave group-hover:scale-[1.08]"
                    />
                  </div>
                  <div className="relative -mt-[1.6rem] flex flex-1 flex-col gap-[0.9rem] px-[1.8rem] pb-[1.8rem]">
                    <MarcaNombre id={marca.id} />
                    <p
                      className={`-mt-[0.4rem] text-[0.78rem] font-semibold uppercase tracking-[0.18em] ${ACENTO_MARCA[marca.id]}`}
                    >
                      {marca.lema}
                    </p>
                    <p className="text-[0.98rem] text-tinta-suave">{marca.descripcion}</p>
                    <ul className="m-0 flex list-none flex-wrap gap-[0.45rem] p-0">
                      {marca.etiquetas.map((etiqueta) => (
                        <li
                          key={etiqueta}
                          className={`rounded-full px-[0.75rem] py-[0.3rem] text-[0.78rem] font-medium ${CHIP_MARCA[marca.id]}`}
                        >
                          {etiqueta}
                        </li>
                      ))}
                    </ul>
                    <span className={`mt-auto pt-[0.6rem] font-semibold ${ACENTO_MARCA[marca.id]}`}>
                      Descubrir{" "}
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-[0.35s] ease-suave group-hover:translate-x-[6px]"
                      >
                        →
                      </span>
                    </span>
                  </div>
                  <span
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_var(--gx,50%)_var(--gy,0%),rgba(255,255,255,0.55),transparent_45%)] mix-blend-soft-light opacity-0 transition-opacity duration-[0.4s] group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </a>
              </Tilt>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarcaNombre({ id }: { id: IdMarca }) {
  if (id === "dliriz")
    return (
      <h3 className="font-script text-[2.9rem] leading-none font-normal tracking-normal text-coral">D&apos;Liriz</h3>
    );
  if (id === "compartiendo-amor")
    return (
      <h3 className="font-script text-[2.6rem] leading-none font-normal tracking-normal text-frambuesa">
        Compartiendo Amor
      </h3>
    );
  return (
    <h3 className="pt-[0.4rem] text-[1.9rem] leading-none text-pino">
      Personalízate{" "}
      <small className="mt-[0.3rem] block font-body text-[0.72rem] font-semibold tracking-[0.5em] text-oro uppercase">
        Arequipa
      </small>
    </h3>
  );
}

/* ───────────────────────── D'Liriz ───────────────────────── */

// Adornos florales: posición, parpadeo "abanico" por pétalo (retrasos 0/0.3/0.6/0.9s) y responsive.
const ADORNO_IZQ =
  "absolute top-[7rem] left-[calc(50%_-_clamp(260px,30vw,420px))] w-[clamp(80px,11vw,150px)] rotate-[-10deg] fill-coral opacity-[0.85] max-[600px]:top-[5.5rem] max-[600px]:left-[2%] max-[600px]:w-[70px] [&_path]:origin-[60px_60px] [&_path]:animate-[abanico_4s_ease-in-out_infinite_alternate] [&_path:nth-child(2)]:[animation-delay:0.3s] [&_path:nth-child(3)]:[animation-delay:0.6s] [&_path:nth-child(4)]:[animation-delay:0.9s]";

const ADORNO_DER =
  "absolute top-[7rem] right-[calc(50%_-_clamp(260px,30vw,420px))] w-[clamp(80px,11vw,150px)] rotate-[10deg] scale-x-[-1] fill-coral opacity-[0.85] max-[600px]:top-[5.5rem] max-[600px]:right-[2%] max-[600px]:w-[70px] [&_path]:origin-[60px_60px] [&_path]:animate-[abanico_4s_ease-in-out_infinite_alternate] [&_path:nth-child(2)]:[animation-delay:0.3s] [&_path:nth-child(3)]:[animation-delay:0.6s] [&_path:nth-child(4)]:[animation-delay:0.9s]";

// Columnas de la rejilla: 3+3 arriba, 2+2+2 abajo; en tablet todas 1 salvo la 5.ª (2); en móvil 1.
const COLUMNAS_CATEGORIA = [
  "col-span-3 max-[960px]:col-span-1",
  "col-span-3 max-[960px]:col-span-1",
  "col-span-2 max-[960px]:col-span-1",
  "col-span-2 max-[960px]:col-span-1",
  "col-span-2 max-[960px]:col-span-2 max-[600px]:col-span-1",
];

function SeccionDliriz() {
  return (
    <section
      className="relative py-[clamp(5rem,10vw,8.5rem)] relative overflow-hidden bg-rubor bg-[radial-gradient(rgba(231,133,122,0.16)_1.2px,transparent_1.2px)] bg-[length:22px_22px]"
      id="dliriz"
    >
      <Adorno className={ADORNO_IZQ} />
      <Adorno className={ADORNO_DER} />
      <div className="contenedor">
        <header className="mx-auto mb-14 max-w-[44rem] text-center [&_.etiqueta]:justify-center" data-reveal="zoom">
          <p className="bg-[linear-gradient(100deg,var(--color-coral)_20%,#f7b9ae_40%,var(--color-coral)_60%)] bg-[length:250%_100%] bg-clip-text font-script text-[clamp(4.5rem,10vw,7.5rem)] leading-[1.1] text-transparent animate-[brillo-texto_5s_linear_infinite]">
            D&apos;Liriz
          </p>
          <p className="mb-[1.4rem] text-[clamp(1.3rem,2.4vw,1.8rem)] font-medium text-cacao">
            Arte y Pasión a tu servicio
          </p>
          <p className="text-[1.12rem] text-tinta-suave">
            Repostería y chocolatería artesanal: cada bombón se pinta a mano y cada bocadito se arma para que
            tu mesa se vea tan rica como sabe.
          </p>
        </header>

        <div className="grid grid-cols-6 gap-[1.4rem] max-[960px]:grid-cols-2 max-[600px]:grid-cols-1">
          {CATEGORIAS_DLIRIZ.map((categoria, i) => (
            <article
              key={categoria.nombre}
              className={`group flex flex-col overflow-hidden rounded-marca bg-white shadow-suave transition-[translate,box-shadow] duration-500 ease-suave hover:-translate-y-2 hover:shadow-marca ${COLUMNAS_CATEGORIA[i]}`}
              data-reveal="up"
              style={retraso(i * 110)}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={categoria.imagen}
                  alt={categoria.nombre}
                  fill
                  sizes="(max-width: 700px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[1.2s] ease-suave group-hover:scale-[1.1] group-hover:rotate-1"
                />
              </div>
              <div className="flex flex-col gap-[0.4rem] px-[1.5rem] pt-[1.3rem] pb-[1.5rem]">
                <h3 className="text-[1.35rem]">{categoria.nombre}</h3>
                <p className="text-[0.95rem] text-tinta-suave">{categoria.texto}</p>
                <a
                  className="group/pedir mt-[0.4rem] w-fit font-semibold text-coral-osc no-underline"
                  href={enlaceWhatsApp(`¡Hola D'Liriz! Me interesa: ${categoria.nombre}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pedir{" "}
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-[0.35s] ease-suave group-hover/pedir:translate-x-[5px]"
                  >
                    →
                  </span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Adorno({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M60 60 C 40 30, 20 20, 6 24 C 22 30, 40 42, 60 60 Z" />
      <path d="M60 60 C 34 50, 14 52, 4 62 C 22 62, 40 62, 60 60 Z" />
      <path d="M60 60 C 40 70, 24 86, 22 100 C 34 88, 46 76, 60 60 Z" />
      <path d="M60 60 C 56 36, 50 16, 40 6 C 44 24, 50 42, 60 60 Z" />
    </svg>
  );
}

/* ───────────────────────── Compartiendo Amor ───────────────────────── */

const SOMBRA_FOTO = "shadow-[0_40px_70px_-30px_rgba(0,0,0,0.6)]";

function SeccionCompartiendoAmor() {
  return (
    <section
      className="relative py-[clamp(5rem,10vw,8.5rem)] relative overflow-hidden bg-[radial-gradient(ellipse_at_15%_20%,rgba(255,255,255,0.12),transparent_50%),linear-gradient(140deg,var(--color-vino)_0%,var(--color-frambuesa)_70%,#d8435f_100%)] text-white"
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
            className="absolute top-[46%] left-[52%] z-[3] grid h-[118px] w-[118px] place-items-center rounded-full bg-oro font-script text-center text-[1.9rem] leading-none text-cacao-osc shadow-[0_18px_30px_-12px_rgba(0,0,0,0.5)] rotate-[-12deg] data-[visible]:animate-[latido_2.4s_ease-in-out_1s_infinite]"
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
            <p className="text-[0.85rem] font-semibold uppercase tracking-[0.3em] text-oro-claro">Detalles que abrazan</p>
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

/* ───────────────────────── Personalízate Arequipa ───────────────────────── */

function SeccionPersonalizate() {
  return (
    <section
      className="relative py-[clamp(5rem,10vw,8.5rem)] overflow-hidden bg-[image:linear-gradient(180deg,var(--color-crema)_0%,#f7f1e8_100%)]"
      id="personalizate"
    >
      <div className="contenedor grid grid-cols-[1.1fr_0.9fr] items-center gap-16 max-[960px]:grid-cols-[1fr]">
        <div>
          <header data-reveal="up">
            <p className="etiqueta text-pino!">Regalos corporativos y personalizados</p>
            <h2 className="my-4 text-[clamp(2.6rem,5vw,4rem)] tracking-[-0.03em] text-pino">
              Personalízate{" "}
              <span className="mt-2 block font-body text-[0.32em] font-semibold tracking-[0.7em] uppercase text-oro">
                Arequipa
              </span>
            </h2>
            <p className="text-[1.12rem] text-tinta-suave">
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
                className="flex gap-4 border-t-[1.5px] border-pino/[0.18] pt-[1.1rem] hover:border-pino"
              >
                <span className="font-display text-[1.1rem] italic text-oro">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-[1.15rem] text-pino">{producto.nombre}</h3>
                  <p className="mt-1 text-[0.93rem] text-tinta-suave">{producto.texto}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="flex flex-wrap gap-[0.9rem]" data-reveal="up">
            <a
              className="group boton boton-pino"
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
              className="boton boton-fantasma"
              href={enlaceWhatsApp("¡Hola Personalízate Arequipa! Quiero una taza personalizada ☕")}
              target="_blank"
              rel="noopener noreferrer"
            >
              Regalo personal
            </a>
          </div>
        </div>

        <div
          className="relative w-[min(420px,100%)] justify-self-center before:absolute before:-bottom-[6%] before:-right-[10%] before:top-[8%] before:left-[12%] before:rounded-[46%_54%_40%_60%/55%_40%_60%_45%] before:bg-pino before:content-[''] before:animate-[morfar_12s_ease-in-out_infinite_alternate] max-[960px]:-order-1 max-[960px]:w-[min(360px,80%)]"
          data-reveal="zoom"
        >
          <Tilt className="relative">
            <Image
              src="/img/caja-corporativa.jpg"
              alt="Caja premium corporativa personalizable con logotipo"
              width={288}
              height={333}
              sizes="(max-width: 900px) 80vw, 420px"
              className="h-auto w-full rounded-3xl border-[10px] border-white shadow-marca"
            />
            <span className="absolute -left-[2.2rem] top-[12%] flex flex-col items-center rounded-[14px] bg-white px-[1.3rem] pt-[0.6rem] pb-[0.7rem] shadow-suave rotate-[-8deg] animate-[flotar_6s_ease-in-out_infinite] max-[600px]:-left-[0.8rem]">
              <span className="script text-[2.2rem]! leading-[1.1]!">Haydée</span>
              <small className="text-[0.65rem] font-semibold tracking-[0.2em] uppercase text-tinta-suave">
                tu nombre aquí
              </small>
            </span>
          </Tilt>
          <div
            className="absolute -right-6 bottom-[8%] flex flex-col rounded-2xl bg-oro px-[1.2rem] py-[0.9rem] text-cacao-osc shadow-suave max-[600px]:-right-[0.6rem]"
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

/* ───────────────────────── Ocasiones ───────────────────────── */

function SeccionOcasiones() {
  return (
    <section className="relative bg-rubor py-[clamp(5rem,10vw,8.5rem)]" id="ocasiones">
      <div className="contenedor">
        <header className="mx-auto mb-14 max-w-[44rem] text-center [&_.etiqueta]:justify-center" data-reveal="up">
          <p className="etiqueta">Calendario de detalles</p>
          <h2 className="my-4 text-[clamp(2.3rem,4.6vw,3.7rem)] tracking-[-0.03em]">
            Siempre hay una <span className="script">excusa</span> para regalar
          </h2>
          <p className="text-[1.12rem] text-tinta-suave">Reserva con anticipación: en temporada alta los cupos vuelan.</p>
        </header>
        <Ocasiones />
      </div>
    </section>
  );
}

/* ───────────────────────── Cómo pedir ───────────────────────── */

const PASOS = [
  { titulo: "Elige", texto: "Mira nuestras marcas y escoge el detalle o la idea base.", icono: "🎁" },
  { titulo: "Personaliza", texto: "Nombre, logotipo, colores, dedicatoria: tú decides.", icono: "✍️" },
  { titulo: "Confirma", texto: "Te enviamos la propuesta y coordinamos el pago.", icono: "💬" },
  { titulo: "Recibe", texto: "Entregamos en Arequipa justo a tiempo para sorprender.", icono: "🚚" },
];

function ComoPedir() {
  return (
    <section className="relative py-[clamp(5rem,10vw,8.5rem)]" id="como-pedir">
      <div className="contenedor">
        <header className="mx-auto mb-14 max-w-[44rem] text-center [&_.etiqueta]:justify-center" data-reveal="up">
          <p className="etiqueta">Así de fácil</p>
          <h2 className="my-4 text-[clamp(2.3rem,4.6vw,3.7rem)] tracking-[-0.03em]">Tu regalo en cuatro pasos</h2>
        </header>
        <ol
          className="relative grid grid-cols-[repeat(4,1fr)] gap-8 list-none p-0 m-0 before:absolute before:top-[38px] before:left-[12.5%] before:right-[12.5%] before:h-[2px] before:origin-left before:scale-x-0 before:bg-[image:repeating-linear-gradient(90deg,var(--color-coral)_0_10px,transparent_10px_18px)] before:content-[''] before:transition-[scale] before:duration-[1.8s] before:ease-suave before:delay-[0.3s] data-[visible]:before:scale-x-100 max-[960px]:grid-cols-[1fr_1fr] max-[960px]:gap-y-12 max-[960px]:before:hidden max-[600px]:grid-cols-[1fr]"
          data-reveal="linea"
        >
          {PASOS.map((paso, i) => (
            <li
              key={paso.titulo}
              className="group relative flex flex-col items-center gap-[0.4rem] text-center"
              data-reveal="up"
              style={retraso(i * 160)}
            >
              <span
                className="mb-[0.8rem] grid size-[78px] place-items-center rounded-full bg-white text-[2rem] shadow-[0_0_0_8px_var(--color-crema),var(--shadow-suave)] transition-[translate,scale] duration-500 ease-rebote group-hover:-translate-y-[6px] group-hover:scale-[1.06]"
                aria-hidden="true"
              >
                {paso.icono}
              </span>
              <span className="text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-coral-osc">
                Paso {i + 1}
              </span>
              <h3 className="text-[1.5rem]">{paso.titulo}</h3>
              <p className="max-w-[15rem] text-[0.95rem] text-tinta-suave">{paso.texto}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── Llamado final ───────────────────────── */

function LlamadoFinal() {
  return (
    <section className="relative pt-0 pb-[clamp(5rem,10vw,8.5rem)]" id="contacto">
      <div className="contenedor">
        <div
          className="relative flex flex-col items-center gap-[1.2rem] overflow-hidden rounded-[36px] px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,7vw,5.5rem)] text-center text-white shadow-marca bg-[image:radial-gradient(circle_at_80%_0%,rgba(231,133,122,0.45),transparent_50%),radial-gradient(circle_at_0%_100%,rgba(201,154,75,0.35),transparent_45%),linear-gradient(135deg,var(--color-cacao-osc),var(--color-vino))]"
          data-reveal="zoom"
        >
          <div
            className="absolute -inset-1/2 animate-[girar_12s_linear_infinite] bg-[image:conic-gradient(from_0deg,transparent_0_70%,rgba(255,255,255,0.12)_80%,transparent_90%)]"
            aria-hidden="true"
          />
          <LogoMarca
            tamano={72}
            animado
            className="relative [&_.logo-marca__aro]:fill-[rgba(255,255,255,0.95)] [&_.logo-marca__aro]:stroke-none [&_.logo-marca__trazo]:[animation-iteration-count:infinite] [&_.logo-marca__trazo]:[animation-duration:4s] [&_.logo-marca__trazo]:[animation-direction:alternate]"
          />
          <h2 className="relative max-w-[40rem] text-[clamp(2.2rem,4.6vw,3.6rem)] tracking-[-0.03em]">
            ¿Tienes una fecha especial{" "}
            <span className="script bg-[image:linear-gradient(100deg,var(--color-oro-claro),var(--color-coral))]!">
              en mente
            </span>
            ?
          </h2>
          <p className="relative max-w-[34rem] text-[1.12rem] text-white/[0.82]">
            Cuéntanos para quién es y qué quieres decirle. Nosotros nos encargamos de convertirlo en un detalle
            inolvidable.
          </p>
          <div className="relative mt-[0.8rem]">
            <a
              className="boton boton-blanco"
              href={enlaceWhatsApp("¡Hola Inspira Nexum! Tengo una fecha especial y quiero un detalle 💝")}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconoWhatsApp /> Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
