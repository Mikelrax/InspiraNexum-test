import Image from "next/image";
import { retraso } from "@/lib/retraso";
import { CATEGORIAS_DLIRIZ, enlaceWhatsApp } from "@/data/sitio";

/* ───────────────────────── D'Liriz ───────────────────────── */

// Adornos florales: posición, parpadeo "abanico" por pétalo (retrasos 0/0.3/0.6/0.9s) y responsive.
const ADORNO_IZQ =
  "absolute top-[7rem] left-[calc(50%_-_clamp(260px,30vw,420px))] w-[clamp(80px,11vw,150px)] rotate-[-10deg] fill-dorado opacity-[0.85] max-[600px]:top-[5.5rem] max-[600px]:left-[2%] max-[600px]:w-[70px] [&_path]:origin-[60px_60px] [&_path]:animate-[abanico_4s_ease-in-out_infinite_alternate] [&_path:nth-child(2)]:[animation-delay:0.3s] [&_path:nth-child(3)]:[animation-delay:0.6s] [&_path:nth-child(4)]:[animation-delay:0.9s]";

const ADORNO_DER =
  "absolute top-[7rem] right-[calc(50%_-_clamp(260px,30vw,420px))] w-[clamp(80px,11vw,150px)] rotate-[10deg] scale-x-[-1] fill-dorado opacity-[0.85] max-[600px]:top-[5.5rem] max-[600px]:right-[2%] max-[600px]:w-[70px] [&_path]:origin-[60px_60px] [&_path]:animate-[abanico_4s_ease-in-out_infinite_alternate] [&_path:nth-child(2)]:[animation-delay:0.3s] [&_path:nth-child(3)]:[animation-delay:0.6s] [&_path:nth-child(4)]:[animation-delay:0.9s]";

// Columnas de la rejilla: 3+3 arriba, 2+2+2 abajo; en tablet todas 1 salvo la 5.ª (2); en móvil 1.
const COLUMNAS_CATEGORIA = [
  "col-span-3 max-[960px]:col-span-1",
  "col-span-3 max-[960px]:col-span-1",
  "col-span-2 max-[960px]:col-span-1",
  "col-span-2 max-[960px]:col-span-1",
  "col-span-2 max-[960px]:col-span-2 max-[600px]:col-span-1",
];

export function Dliriz() {
  return (
    <section
      className="relative py-[clamp(5rem,10vw,8.5rem)] relative overflow-hidden bg-dorado-claro/40 bg-[radial-gradient(rgba(235,177,71,0.22)_1.2px,transparent_1.2px)] bg-[length:22px_22px]"
      id="dliriz"
    >
      <Adorno className={ADORNO_IZQ} />
      <Adorno className={ADORNO_DER} />
      <div className="contenedor">
        <header className="mx-auto mb-14 max-w-[44rem] text-center [&_.etiqueta]:justify-center" data-reveal="zoom">
          <p className="bg-[linear-gradient(100deg,var(--color-fresa)_20%,var(--color-dorado-osc)_40%,var(--color-fresa)_60%)] bg-[length:250%_100%] bg-clip-text font-script text-[clamp(4.5rem,10vw,7.5rem)] leading-[1.1] text-transparent animate-[brillo-texto_5s_linear_infinite]">
            D&apos;Liriz
          </p>
          <p className="mb-[1.4rem] text-[clamp(1.3rem,2.4vw,1.8rem)] font-medium text-marino">
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
                  className="group/pedir mt-[0.4rem] w-fit font-semibold text-fresa no-underline"
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
