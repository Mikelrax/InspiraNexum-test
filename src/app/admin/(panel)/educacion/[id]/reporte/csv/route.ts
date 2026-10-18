import { cookies } from "next/headers";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { obtenerCurso } from "@/lib/educacion";
import { esFechaValida, generarReporte, reporteACsv } from "@/lib/clases";
import { parsearId } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  // El proxy ya protege /admin; se valida de nuevo porque esto devuelve datos de estudiantes.
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) return new Response("No autorizado", { status: 401 });

  const cursoId = parsearId((await params).id);
  const curso = cursoId === null ? null : await obtenerCurso(cursoId);
  if (!curso) return new Response("Curso no encontrado", { status: 404 });

  const consulta = new URL(request.url).searchParams;
  const desde = consulta.get("desde");
  const hasta = consulta.get("hasta");
  const reporte = await generarReporte(curso.id, {
    desde: esFechaValida(desde) ? desde : null,
    hasta: esFechaValida(hasta) ? hasta : null,
  });

  const nombreArchivo = `asistencia-${curso.nombre.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^\w]+/g, "-").replace(/^-+|-+$/g, "").toLowerCase() || "curso"}.csv`;
  return new Response(reporteACsv(reporte), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${nombreArchivo}"`,
      "Cache-Control": "no-store",
    },
  });
}
