import Image from "next/image";
import { Tilt } from "@/components/Efectos";
import { ALAS, enlaceWhatsApp } from "@/data/sitio";
import { retraso } from "@/lib/retraso";

/* ───────────────────────── Alas hacia el futuro ───────────────────────── */

const FOTO = "relative overflow-hidden rounded-[20px] border-[6px] border-white bg-white shadow-marca";

export function Alas() {
  const [portada, ...resto] = ALAS.galeria;
  const mosaico = resto.slice(0, 4);

  return (
    <section
      id="alas"
      className="relative overflow-hidden bg-alas-claro py-[clamp(5rem,10vw,8.5rem)] before:pointer-events-none before:absolute before:-top-40 before:-right-40 before:size-[32rem] before:rounded-full before:bg-[radial-gradient(circle,rgba(21,101,192,0.18),transparent_70%)] before:content-['']"
    >
      <div className="contenedor relative">
        <div className="grid grid-cols-[1fr_1.05fr] items-center gap-[clamp(2rem,5vw,4.5rem)] max-[960px]:grid-cols-1">
          <div data-reveal="left">
            <p className="etiqueta text-alas!">Alas hacia el futuro · {ALAS.lema}</p>
            <h2 className="my-4 text-[clamp(2.3rem,4.6vw,3.7rem)] tracking-[-0.03em] text-alas-osc">
              Aprende un oficio y <span className="font-script text-[1.3em] font-normal leading-[0.8] text-alas">despega</span>
            </h2>
            <p className="max-w-[34rem] text-[1.12rem] text-marino-2">{ALAS.descripcion}</p>

            <ul className="mt-8 grid list-none gap-3 p-0">
              {ALAS.cursos.map((curso, i) => (
                <li
                  key={curso.nombre}
                  data-reveal="up"
                  style={retraso(i * 110)}
                  className="group flex items-center gap-4 rounded-[18px] border border-alas/15 bg-white p-3 shadow-suave"
                >
                  <span className="relative size-16 flex-none overflow-hidden rounded-[14px]">
                    <Image
                      src={curso.imagen}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-700 ease-suave group-hover:scale-110"
                    />
                  </span>
                  <span className="grid gap-0.5">
                    <strong className="font-display text-[1.08rem] font-semibold text-alas-osc">{curso.nombre}</strong>
                    <span className="text-[0.92rem] leading-snug text-marino-2">{curso.texto}</span>
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 max-[600px]:gap-x-6">
              {ALAS.datos.map((dato) => (
                <div key={dato.valor}>
                  <dt className="font-display text-[1.7rem] font-semibold text-alas">{dato.valor}</dt>
                  <dd className="text-[0.85rem] text-marino-2">{dato.detalle}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                className="boton boton-alas"
                href={enlaceWhatsApp("¡Hola Inspira Nexum! Quisiera información sobre los cursos de Alas hacia el futuro 🎓")}
                target="_blank"
                rel="noopener noreferrer"
              >
                Quiero inscribirme
              </a>
              <a className="boton boton-fantasma" href="#marcas">
                Conoce las otras marcas
              </a>
            </div>
          </div>

          <div className="relative" data-reveal="right">
            <Tilt className="relative">
              <div className={`${FOTO} aspect-[4/3]`}>
                <Image
                  src={portada.src}
                  alt={portada.alt}
                  fill
                  sizes="(max-width: 960px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <span className="absolute -bottom-5 left-6 rounded-full bg-alas px-5 py-2.5 text-[0.85rem] font-semibold tracking-wide text-white shadow-suave">
                Clausura · Módulo II · 2026
              </span>
            </Tilt>
          </div>
        </div>

        <div className="mt-[clamp(3rem,6vw,5rem)] grid grid-cols-4 gap-4 max-[960px]:grid-cols-2">
          {mosaico.map((foto, i) => (
            <div
              key={foto.src}
              data-reveal="up"
              style={retraso(i * 100)}
              className={`${FOTO} aspect-[4/3] transition-[translate,rotate] duration-500 ease-suave hover:-translate-y-1.5 ${
                i % 2 === 0 ? "hover:-rotate-1" : "hover:rotate-1"
              }`}
            >
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                sizes="(max-width: 960px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
