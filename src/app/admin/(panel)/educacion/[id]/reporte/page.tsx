import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { obtenerCurso } from "@/lib/educacion";
import { esFechaValida, generarReporte } from "@/lib/clases";
import { parsearId } from "@/lib/http";

export const metadata: Metadata = { title: "Reporte de asistencia · Inspira Nexum" };
export const dynamic = "force-dynamic";

const cabecera =
  "border-b border-bruma bg-lienzo px-3 py-3 text-center align-bottom text-[0.78rem] font-semibold text-marino-2";
const celda = "border-b border-bruma px-3 py-2.5 text-center align-middle";

const formatoPorcentaje = (valor: number | null) => (valor === null ? "—" : `${valor.toFixed(1).replace(/\.0$/, "")}%`);

export default async function PaginaReporte({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ desde?: string; hasta?: string }>;
}) {
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect("/admin/login");

  const cursoId = parsearId((await params).id);
  const curso = cursoId === null ? null : await obtenerCurso(cursoId);
  if (!curso) notFound();

  const consulta = await searchParams;
  const desde = esFechaValida(consulta.desde) ? consulta.desde : null;
  const hasta = esFechaValida(consulta.hasta) ? consulta.hasta : null;
  const reporte = await generarReporte(curso.id, { desde, hasta });

  const parametrosCsv = new URLSearchParams();
  if (desde) parametrosCsv.set("desde", desde);
  if (hasta) parametrosCsv.set("hasta", hasta);
  const hrefCsv = `/admin/educacion/${curso.id}/reporte/csv${parametrosCsv.size ? `?${parametrosCsv}` : ""}`;

  const nivel = (porcentaje: number | null) =>
    porcentaje === null ? "text-marino-2" : porcentaje < 70 ? "font-semibold text-magenta-osc" : "font-semibold text-turquesa";

  return (
    <div className="grid gap-5">
      <nav>
        <Link
          href={`/admin/educacion/${curso.id}`}
          className="text-[0.9rem] text-marino-2 no-underline transition-colors hover:text-magenta"
        >
          ← {curso.nombre}
        </Link>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem]">Reporte de asistencia</h1>
          <p className="mt-1 text-marino-2">{curso.nombre}</p>
        </div>
        <a href={hrefCsv} className="boton boton-primario boton-chico whitespace-nowrap" download>
          Descargar CSV
        </a>
      </header>

      <form method="get" className="tarjeta flex flex-wrap items-end gap-3 p-4">
        <label className="grid gap-1.5 text-[0.85rem]">
          <span className="font-semibold">Desde</span>
          <input className="campo" type="date" name="desde" defaultValue={desde ?? ""} />
        </label>
        <label className="grid gap-1.5 text-[0.85rem]">
          <span className="font-semibold">Hasta</span>
          <input className="campo" type="date" name="hasta" defaultValue={hasta ?? ""} />
        </label>
        <button type="submit" className="boton boton-fantasma boton-chico whitespace-nowrap">
          Filtrar
        </button>
        {(desde || hasta) && (
          <Link href={`/admin/educacion/${curso.id}/reporte`} className="boton boton-fantasma boton-chico whitespace-nowrap">
            Quitar filtro
          </Link>
        )}
      </form>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="tarjeta p-4">
          <p className="m-0 text-[0.8rem] text-marino-2">Clases con asistencia</p>
          <p className="m-0 mt-1 text-[1.6rem] font-semibold">{reporte.clases.length}</p>
        </div>
        <div className="tarjeta p-4">
          <p className="m-0 text-[0.8rem] text-marino-2">Asistencia general</p>
          <p className={`m-0 mt-1 text-[1.6rem] ${nivel(reporte.porcentajeGeneral)}`}>
            {formatoPorcentaje(reporte.porcentajeGeneral)}
          </p>
        </div>
        <div className="tarjeta p-4">
          <p className="m-0 text-[0.8rem] text-marino-2">Estudiantes</p>
          <p className="m-0 mt-1 text-[1.6rem] font-semibold">{reporte.filas.length}</p>
        </div>
      </div>

      {reporte.sinTomar > 0 && (
        <p className="m-0 text-[0.9rem] text-marino-2">
          {reporte.sinTomar} {reporte.sinTomar === 1 ? "clase del rango no tiene" : "clases del rango no tienen"} asistencia
          tomada y no se cuentan.
        </p>
      )}

      <div className="tarjeta overflow-x-auto">
        <table className="w-full border-collapse text-[0.9rem]">
          <thead>
            <tr>
              <th className={`${cabecera} sticky left-0 bg-lienzo text-left`}>Estudiante</th>
              {reporte.clases.map((clase) => (
                <th key={clase.id} className={cabecera} title={clase.titulo}>
                  <Link
                    href={`/admin/educacion/${curso.id}/clases/${clase.id}`}
                    className="block text-marino-2 no-underline hover:text-magenta"
                  >
                    {clase.fecha.slice(5).split("-").reverse().join("/")}
                  </Link>
                </th>
              ))}
              <th className={cabecera}>Asistió</th>
              <th className={cabecera}>Faltó</th>
              <th className={cabecera}>%</th>
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {reporte.filas.map((fila) => (
              <tr key={fila.estudianteId}>
                <td className={`${celda} sticky left-0 whitespace-nowrap bg-white text-left font-medium`}>{fila.nombre}</td>
                {fila.asistencia.map((valor, i) => (
                  <td key={reporte.clases[i].id} className={celda}>
                    {valor === null ? (
                      <span className="text-marino-2/50" title="Sin registro">·</span>
                    ) : valor ? (
                      <span className="font-bold text-turquesa" title="Asistió">✓</span>
                    ) : (
                      <span className="font-bold text-magenta-osc" title="Faltó">✗</span>
                    )}
                  </td>
                ))}
                <td className={celda}>{fila.presentes}</td>
                <td className={celda}>{fila.faltas}</td>
                <td className={`${celda} ${nivel(fila.porcentaje)}`}>{formatoPorcentaje(fila.porcentaje)}</td>
              </tr>
            ))}
            {reporte.filas.length === 0 && (
              <tr>
                <td colSpan={reporte.clases.length + 4} className="px-4 py-8 text-center text-marino-2">
                  Este curso no tiene estudiantes.
                </td>
              </tr>
            )}
            {reporte.filas.length > 0 && reporte.clases.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-marino-2">
                  Aún no hay clases con asistencia tomada en este rango.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
