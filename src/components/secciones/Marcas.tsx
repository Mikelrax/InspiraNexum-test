import Image from "next/image";
import { Tilt } from "@/components/Efectos";
import { retraso } from "@/lib/retraso";
import { ALAS, MARCAS } from "@/data/sitio";

/* ───────────────────────── Marcas ───────────────────────── */

type IdMarca = (typeof MARCAS)[number]["id"];

// Color de acento de cada marca (lema y "Descubrir").
const ACENTO_MARCA: Record<IdMarca, string> = {
  dliriz: "text-fresa",
  "compartiendo-amor": "text-magenta",
  personalizate: "text-marino",
};

// Par fondo/texto de los chips de cada marca.
const CHIP_MARCA: Record<IdMarca, string> = {
  dliriz: "bg-dorado-claro text-dorado-osc",
  "compartiendo-amor": "bg-[#fbe1e6] text-magenta-osc",
  personalizate: "bg-ebano text-bronce",
};

export function Marcas() {
  return (
    <section className="relative py-[clamp(5rem,10vw,8.5rem)]" id="marcas">
      <div className="contenedor">
        <header className="mb-14 max-w-[44rem]" data-reveal="up">
          <p className="etiqueta">Una casa, tres emprendimientos y una escuela</p>
          <h2 className="my-4 text-[clamp(2.3rem,4.6vw,3.7rem)] tracking-[-0.03em]">
            Cada marca, un <span className="script">pétalo</span> distinto
          </h2>
          <p className="text-[1.12rem] text-tinta-suave">
            <em>Nexum</em> significa vínculo. Como los cuatro pétalos de nuestro logotipo, cada línea es distinta y
            todas se unen en un mismo propósito: conectar personas con detalles y oficios hechos con las manos.
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

        <article
          data-reveal="up"
          className="mt-[1.8rem] grid grid-cols-2 overflow-hidden rounded-[28px] bg-alas-osc bg-linear-to-br from-alas-osc to-alas text-white shadow-marca max-[960px]:grid-cols-1"
        >
          <div className="flex flex-col items-start gap-[1rem] p-[clamp(1.8rem,4vw,3.4rem)]">
            <span className="etiqueta etiqueta-clara">Escuela de oficios</span>
            <h3 className="text-[clamp(2rem,3.6vw,2.9rem)] leading-[1.05] text-white">{ALAS.nombre}</h3>
            <p className="text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-alas-claro">{ALAS.lema}</p>
            <p className="text-[0.98rem] text-white/85">{ALAS.descripcion}</p>
            <a href="#alas" className="boton boton-blanco mt-[0.6rem]">
              Ver cursos
            </a>
          </div>
          <div className="relative min-h-[280px] overflow-hidden">
            <Image
              src="/img/alas/clausura-catering.jpg"
              alt="Clausura del taller de catering, módulo II 2026"
              fill
              sizes="(max-width: 960px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </article>
      </div>
    </section>
  );
}

function MarcaNombre({ id }: { id: IdMarca }) {
  if (id === "dliriz")
    return (
      <h3 className="font-script text-[2.9rem] leading-none font-normal tracking-normal text-fresa">D&apos;Liriz</h3>
    );
  if (id === "compartiendo-amor")
    return (
      <h3 className="font-script text-[2.6rem] leading-none font-normal tracking-normal text-magenta">
        Compartiendo Amor
      </h3>
    );
  return (
    <h3 className="pt-[0.4rem] text-[1.9rem] leading-none text-ebano">
      Personalízate{" "}
      <small className="mt-[0.3rem] block font-body text-[0.72rem] font-semibold tracking-[0.5em] text-bronce uppercase">
        Arequipa
      </small>
    </h3>
  );
}
