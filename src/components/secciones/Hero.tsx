import Image from "next/image";
import type { CSSProperties } from "react";
import { Contador, Parallax } from "@/components/Efectos";
import { LogoMarca } from "@/components/Logo";
import { retraso } from "@/lib/retraso";

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

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-svh items-center overflow-hidden bg-lienzo bg-[image:radial-gradient(ellipse_at_80%_10%,rgba(21,150,189,0.14),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgba(235,177,71,0.12),transparent_50%),radial-gradient(ellipse_at_45%_55%,rgba(14,107,107,0.06),transparent_45%)] pt-[120px] pb-[90px] max-[960px]:pt-[110px]"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute top-[-120px] left-[-100px] h-[420px] w-[420px] rounded-full bg-turquesa-claro blur-[60px] opacity-[0.55] animate-[deriva_18s_ease-in-out_infinite_alternate]" />
        <span className="absolute top-[30%] right-[-120px] h-[360px] w-[360px] rounded-full bg-celeste/45 blur-[60px] opacity-[0.55] animate-[deriva_18s_ease-in-out_-6s_infinite_alternate]" />
        <span className="absolute bottom-[-120px] left-[35%] h-[300px] w-[300px] rounded-full bg-dorado-claro blur-[60px] opacity-[0.55] animate-[deriva_18s_ease-in-out_-12s_infinite_alternate]" />
        <Destellos />
      </div>

      <div className="contenedor relative grid grid-cols-[1.05fr_1fr] items-center gap-12 max-[960px]:grid-cols-1">
        <div>
          <p className={`etiqueta etiqueta-sin-raya ${ENTRADA}`} style={retraso(0)}>
            <span className="punto-vivo" /> Inspira Nexum · Arequipa
          </p>
          <h1 className="mt-[1.2rem] mb-6 text-[clamp(3rem,6.6vw,5.9rem)] leading-[0.98] tracking-[-0.035em]">
            <span className={`block ${ENTRADA}`} style={retraso(120)}>
              Detalles que
            </span>
            <span
              className="relative block w-fit py-0 pr-[0.15em] pl-[0.05em] mt-[-0.05em] mb-[-0.12em] font-script font-normal text-[1.32em] leading-[1.05] tracking-normal bg-marca bg-[length:200%_100%] bg-clip-text text-transparent animate-[entrar_1.1s_var(--ease-suave)_var(--retraso,0ms)_both,brillo-texto_6s_ease-in-out_1.4s_infinite_alternate]"
              style={retraso(260)}
            >
              conectan,
              <svg
                className="absolute bottom-[-0.02em] left-[4%] h-[0.22em] w-[92%] overflow-visible"
                viewBox="0 0 300 24"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  pathLength={1}
                  d="M4 16 C 60 4, 120 22, 180 10 S 270 6, 296 14"
                  className="fill-none stroke-dorado [stroke-width:5] [stroke-linecap:round] [stroke-dasharray:1] [stroke-dashoffset:1] animate-[dibujar_1.4s_var(--ease-suave)_1.1s_forwards]"
                />
              </svg>
            </span>
            <span className={`block ${ENTRADA}`} style={retraso(400)}>
              talento que despega
            </span>
          </h1>
          <p className={`max-w-[34rem] text-[1.15rem] text-marino-2 ${ENTRADA}`} style={retraso(540)}>
            Somos <strong className="font-semibold text-marino">Inspira Nexum</strong>: la casa de{" "}
            <strong className="font-semibold text-fresa">D&apos;Liriz</strong>,{" "}
            <strong className="font-semibold text-magenta">Compartiendo Amor</strong> y{" "}
            <strong className="font-semibold text-marino">Personalízate Arequipa</strong>, tres emprendimientos hechos a
            mano, y de <strong className="font-semibold text-alas">Alas hacia el futuro</strong>, nuestra escuela de
            oficios.
          </p>
          <div className={`mt-8 flex flex-wrap gap-[0.9rem] ${ENTRADA}`} style={retraso(680)}>
            <a className="group boton boton-primario" href="#marcas">
              Conoce nuestras marcas
              <span
                className="inline-block transition-[translate] duration-[0.35s] ease-suave group-hover:translate-x-[5px]"
                aria-hidden="true"
              >
                →
              </span>
            </a>
            <a className="boton boton-fantasma" href="#alas">
              Cursos Alas hacia el futuro
            </a>
          </div>
          <dl
            className={`mt-[2.6rem] flex gap-[2.4rem] border-t border-bruma-2 pt-[1.6rem] max-[600px]:gap-[1.4rem] ${ENTRADA}`}
            style={retraso(820)}
          >
            <div>
              <dt className="font-display text-[2.2rem] leading-none font-semibold text-magenta max-[600px]:text-[1.8rem]">
                <Contador hasta={3} />
              </dt>
              <dd className="mt-[0.35rem] text-[0.88rem] text-marino-2">emprendimientos</dd>
            </div>
            <div>
              <dt className="font-display text-[2.2rem] leading-none font-semibold text-magenta max-[600px]:text-[1.8rem]">
                <Contador hasta={1} />
              </dt>
              <dd className="mt-[0.35rem] text-[0.88rem] text-marino-2">escuela de oficios</dd>
            </div>
            <div>
              <dt className="font-display text-[2.2rem] leading-none font-semibold text-magenta max-[600px]:text-[1.8rem]">
                <Contador hasta={100} sufijo="%" />
              </dt>
              <dd className="mt-[0.35rem] text-[0.88rem] text-marino-2">hecho en Arequipa</dd>
            </div>
          </dl>
        </div>

        <Parallax className="relative aspect-[1/1.02] max-h-[640px] w-full [--px:0] [--py:0] max-[960px]:mx-auto max-[960px]:max-w-[560px]">
          <div className={`${PIEZA} top-[4%] left-0 z-[1] w-[40%]`} style={{ "--d": 18, "--rot": "-9deg" } as CSSProperties}>
            <div className={FLOTAR} style={retraso(300)}>
              <Image src="/img/alas/clausura-chocolateria.jpg" alt="Clausura del taller de chocolatería de Alas hacia el futuro" width={1600} height={1067} sizes="220px" priority className={IMAGEN_COLLAGE} />
            </div>
          </div>
          <div className={`${PIEZA} top-[14%] left-[29%] z-[3] w-[42%]`} style={{ "--d": 34, "--rot": "-3deg" } as CSSProperties}>
            <div className={FLOTAR} style={retraso(0)}>
              <Image src="/img/arreglo-amor.jpg" alt="Arreglo con rosas rojas y peluche de Compartiendo Amor" width={300} height={413} sizes="260px" priority className={IMAGEN_COLLAGE} />
              <span className="absolute bottom-[-18px] left-1/2 flex -translate-x-1/2 -rotate-3 items-center gap-[0.4rem] rounded-full bg-white px-[1.1rem] pt-[0.35rem] pb-[0.45rem] font-script text-[1.45rem] leading-[1.1] whitespace-nowrap text-magenta shadow-[0_12px_24px_-10px_rgba(29,43,92,0.35)]">
                Con amor para ti
                <LogoMarca tamano={20} />
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
        className="absolute bottom-[26px] left-1/2 h-[42px] w-[26px] -translate-x-1/2 rounded-[14px] border-2 border-marino/40"
        aria-label="Bajar a nuestras marcas"
      >
        <span className="absolute top-2 left-1/2 -ml-0.5 h-2 w-1 rounded-[2px] bg-magenta animate-[rueda_1.8s_var(--ease-suave)_infinite]" />
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
      <circle cx="100" cy="100" r="98" className="fill-marino" />
      <text className="fill-dorado-claro font-body text-[15.5px] font-semibold tracking-[3.2px] [transform-origin:100px_100px] animate-[girar_22s_linear_infinite]">
        <textPath href="#sello-circulo">INSPIRA NEXUM · E.I.R.L. · AREQUIPA ·</textPath>
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
  const petalos = [
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
          className="absolute fill-dorado animate-[titilar_3.2s_ease-in-out_infinite]"
          viewBox="0 0 24 24"
          width={d.s}
          height={d.s}
          style={{ left: d.x, top: d.y, animationDelay: `${d.d}s` }}
        >
          <path d="M12 0 C 13 8, 16 11, 24 12 C 16 13, 13 16, 12 24 C 11 16, 8 13, 0 12 C 8 11, 11 8, 12 0 Z" />
        </svg>
      ))}
      {petalos.map((p, i) => (
        <span
          key={`p${i}`}
          className="absolute bottom-[-30px] opacity-0 animate-[subir_14s_linear_infinite]"
          style={{ left: p.x, animationDelay: `${p.d}s` }}
        >
          <LogoMarca tamano={p.s} />
        </span>
      ))}
    </>
  );
}
