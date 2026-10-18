import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { listarCursos } from "@/lib/educacion";
import { eliminarCursoAccion } from "./actions";
import { BotonAccion } from "./controles";
import { FormularioCurso } from "./formularios";
import { BotonModal } from "./modal";

export const metadata: Metadata = { title: "Educación · Inspira Nexum" };
export const dynamic = "force-dynamic";

const cabecera =
  "border-b border-rubor bg-crema px-4 py-3 text-left align-middle text-[0.78rem] font-semibold tracking-[0.04em] text-cacao-2 uppercase";
const cabeceraNumero =
  "border-b border-rubor bg-crema px-4 py-3 text-right align-middle text-[0.78rem] font-semibold tracking-[0.04em] text-cacao-2 uppercase tabular-nums";
const celda = "border-b border-rubor px-4 py-3 text-left align-middle";
const celdaNumero = "border-b border-rubor px-4 py-3 text-right align-middle tabular-nums";
const celdaVacia = "px-4 py-8 text-center align-middle text-cacao-2";

export default async function PaginaEducacion() {
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect("/admin/login");

  const cursos = await listarCursos();

  return (
    <div className="grid gap-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem]">Educación</h1>
          <p className="mt-1 text-cacao-2">
            {cursos.length} {cursos.length === 1 ? "curso" : "cursos"}
          </p>
        </div>
        <BotonModal etiqueta="Nuevo curso" titulo="Nuevo curso">
          <FormularioCurso />
        </BotonModal>
      </header>

      <div className="tarjeta overflow-x-auto">
        <table className="w-full border-collapse text-[0.93rem]">
          <thead>
            <tr>
              <th className={cabecera}>Curso</th>
              <th className={cabecera}>Instructor</th>
              <th className={cabeceraNumero}>Estudiantes</th>
              <th className={cabecera}>Creado</th>
              <th aria-label="Acciones" className={cabecera} />
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {cursos.map((curso) => (
              <tr key={curso.id}>
                <td className={celda}>
                  <Link
                    href={`/admin/educacion/${curso.id}`}
                    className="block font-semibold text-tinta no-underline transition-colors hover:text-frambuesa"
                  >
                    {curso.nombre}
                  </Link>
                  {curso.descripcion && (
                    <span className="mt-0.5 block max-w-[44ch] truncate text-[0.82rem] text-cacao-2">
                      {curso.descripcion}
                    </span>
                  )}
                </td>
                <td className={celda}>{curso.instructor || "—"}</td>
                <td className={celdaNumero}>{curso.estudiantes}</td>
                <td className={celda}>{curso.creadoEn.slice(0, 10)}</td>
                <td className={celda}>
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/educacion/${curso.id}`}
                      className="boton boton-fantasma boton-chico whitespace-nowrap"
                    >
                      Estudiantes
                    </Link>
                    <BotonAccion
                      accion={eliminarCursoAccion.bind(null, curso.id)}
                      confirmar={`¿Eliminar el curso "${curso.nombre}" y sus ${curso.estudiantes} estudiantes?`}
                      peligro
                    >
                      Eliminar
                    </BotonAccion>
                  </div>
                </td>
              </tr>
            ))}
            {cursos.length === 0 && (
              <tr>
                <td colSpan={5} className={celdaVacia}>
                  Aún no hay cursos. Crea el primero con «Nuevo curso».
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
