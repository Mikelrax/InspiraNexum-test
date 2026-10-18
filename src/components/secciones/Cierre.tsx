import Link from "next/link";
import { IconoWhatsApp } from "@/components/Iconos";
import { LogoMarca } from "@/components/Logo";
import { Ocasiones } from "@/components/Ocasiones";
import { retraso } from "@/lib/retraso";
import { enlaceWhatsApp } from "@/data/sitio";

/* ───────────────────────── Ocasiones ───────────────────────── */

export function SeccionOcasiones() {
  return (
    <section className="relative bg-bruma py-[clamp(5rem,10vw,8.5rem)]" id="ocasiones">
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

export function ComoPedir() {
  return (
    <section className="relative py-[clamp(5rem,10vw,8.5rem)]" id="como-pedir">
      <div className="contenedor">
        <header className="mx-auto mb-14 max-w-[44rem] text-center [&_.etiqueta]:justify-center" data-reveal="up">
          <p className="etiqueta">Así de fácil</p>
          <h2 className="my-4 text-[clamp(2.3rem,4.6vw,3.7rem)] tracking-[-0.03em]">Tu regalo en cuatro pasos</h2>
        </header>
        <ol
          className="relative grid grid-cols-[repeat(4,1fr)] gap-8 list-none p-0 m-0 before:absolute before:top-[38px] before:left-[12.5%] before:right-[12.5%] before:h-[2px] before:origin-left before:scale-x-0 before:bg-[image:repeating-linear-gradient(90deg,var(--color-celeste)_0_10px,transparent_10px_18px)] before:content-[''] before:transition-[scale] before:duration-[1.8s] before:ease-suave before:delay-[0.3s] data-[visible]:before:scale-x-100 max-[960px]:grid-cols-[1fr_1fr] max-[960px]:gap-y-12 max-[960px]:before:hidden max-[600px]:grid-cols-[1fr]"
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
                className="mb-[0.8rem] grid size-[78px] place-items-center rounded-full bg-white text-[2rem] shadow-[0_0_0_8px_var(--color-lienzo),var(--shadow-suave)] transition-[translate,scale] duration-500 ease-rebote group-hover:-translate-y-[6px] group-hover:scale-[1.06]"
                aria-hidden="true"
              >
                {paso.icono}
              </span>
              <span className="text-[0.75rem] font-semibold tracking-[0.2em] uppercase text-celeste-osc">
                Paso {i + 1}
              </span>
              <h3 className="text-[1.5rem]">{paso.titulo}</h3>
              <p className="max-w-[15rem] text-[0.95rem] text-tinta-suave">{paso.texto}</p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-14 max-w-[36rem] text-center text-[1.02rem] text-tinta-suave">
          ¿Quieres un curso? Escríbenos y reserva tu cupo en{" "}
          <Link href="/#alas" className="font-semibold text-alas no-underline hover:underline">
            Alas hacia el futuro
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── Llamado final ───────────────────────── */

export function LlamadoFinal() {
  return (
    <section className="relative pt-0 pb-[clamp(5rem,10vw,8.5rem)]" id="contacto">
      <div className="contenedor">
        <div
          className="relative flex flex-col items-center gap-[1.2rem] overflow-hidden rounded-[36px] bg-marino px-[clamp(1.5rem,5vw,4rem)] py-[clamp(3rem,7vw,5.5rem)] text-center text-white shadow-marca bg-[image:radial-gradient(circle_at_80%_0%,rgba(21,150,189,0.45),transparent_50%),radial-gradient(circle_at_0%_100%,rgba(235,177,71,0.35),transparent_45%)]"
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
          <p className="relative etiqueta etiqueta-clara">Hecho a tu medida</p>
          <h2 className="relative max-w-[40rem] text-[clamp(2.2rem,4.6vw,3.6rem)] tracking-[-0.03em]">
            ¿Tienes una fecha especial{" "}
            <span className="script bg-[image:linear-gradient(100deg,var(--color-dorado-claro),var(--color-dorado))]!">
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

export function Cierre() {
  return (
    <>
      <SeccionOcasiones />
      <ComoPedir />
      <LlamadoFinal />
    </>
  );
}
