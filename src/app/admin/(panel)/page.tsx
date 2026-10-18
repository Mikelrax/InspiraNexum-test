import type { Metadata } from "next";
import Link from "next/link";
import { MODULOS } from "@/data/modulos";
import { listarCursos } from "@/lib/educacion";
import { listarTareas } from "@/lib/tareas";
import { almacenConfigurado } from "@/lib/almacen";

export const metadata: Metadata = { title: "Dashboard · Inspira Nexum" };
export const dynamic = "force-dynamic";

type Resumen = { valor: string; detalle: string };

// Cada módulo aporta una cifra clave; si su fuente falla, la tarjeta sigue
// visible con un guion para que un módulo caído no tumbe todo el panel.
async function resumenes(): Promise<Record<string, Resumen>> {
  const [cursos, tareas] = await Promise.allSettled([listarCursos(), listarTareas()]);

  const resultado: Record<string, Resumen> = {
    archivos: almacenConfigurado()
      ? { valor: "Activo", detalle: "R2 configurado" }
      : { valor: "Pendiente", detalle: "Faltan variables R2" },
    branding: { valor: "v1.0", detalle: "Manual vigente" },
    sitio: { valor: "En línea", detalle: "Arequipa" },
  };

  resultado.educacion =
    cursos.status === "fulfilled"
      ? {
          valor: String(cursos.value.length),
          detalle: `cursos · ${cursos.value.reduce((n, c) => n + c.estudiantes, 0)} estudiantes`,
        }
      : { valor: "—", detalle: "Sin datos" };

  resultado.tareas =
    tareas.status === "fulfilled"
      ? {
          valor: String(tareas.value.filter((t) => !t.completada).length),
          detalle: `pendientes · ${tareas.value.length} en total`,
        }
      : { valor: "—", detalle: "Sin datos" };

  return resultado;
}

export default async function Dashboard() {
  const datos = await resumenes();

  return (
    <>
      <header className="mb-8">
        <p className="etiqueta">Panel administrativo</p>
        <h1 className="mt-3 text-4xl">Dashboard</h1>
        <p className="mt-2 text-cacao-2">Todos los módulos de Inspira Nexum en un solo lugar.</p>
      </header>

      <section aria-label="Módulos" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {MODULOS.map((m) => (
          <Link
            key={m.id}
            href={m.href}
            className={`tarjeta group flex flex-col gap-4 p-5 transition-all duration-300 ease-suave hover:-translate-y-1 ${m.acento.borde}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span
                className={`grid size-11 place-items-center rounded-xl font-display text-xl font-semibold ${m.acento.fondo} ${m.acento.texto}`}
                aria-hidden="true"
              >
                {m.nombre[0]}
              </span>
              <span className="rounded-full bg-crema px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-widest text-cacao-2">
                {m.zona === "admin" ? "Privado" : "Público"}
              </span>
            </div>
            <div>
              <h2 className="text-xl">{m.nombre}</h2>
              <p className="mt-1 text-sm text-cacao-2">{m.descripcion}</p>
            </div>
            <p className="mt-auto flex items-baseline gap-2 border-t border-rubor-2 pt-3">
              <strong className={`font-display text-2xl ${m.acento.texto}`}>{datos[m.id].valor}</strong>
              <span className="text-sm text-cacao-2">{datos[m.id].detalle}</span>
            </p>
          </Link>
        ))}
      </section>
    </>
  );
}
