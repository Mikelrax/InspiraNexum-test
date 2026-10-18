import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { listarEstudiantes, obtenerCurso } from "@/lib/educacion";
import { obtenerAsistencia, obtenerClase } from "@/lib/clases";
import { parsearId } from "@/lib/http";
import { AsistenciaForm } from "./asistencia-form";

export const metadata: Metadata = { title: "Asistencia · Inspira Nexum" };
export const dynamic = "force-dynamic";

export default async function PaginaClase({ params }: { params: Promise<{ id: string; claseId: string }> }) {
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect("/admin/login");

  const { id, claseId: claseParam } = await params;
  const cursoId = parsearId(id);
  const claseId = parsearId(claseParam);
  if (cursoId === null || claseId === null) notFound();

  const [curso, clase] = await Promise.all([obtenerCurso(cursoId), obtenerClase(cursoId, claseId)]);
  if (!curso || !clase) notFound();

  const [estudiantes, asistencia] = await Promise.all([listarEstudiantes(cursoId), obtenerAsistencia(claseId)]);
  // Orden alfabético para pasar lista; sin registro previo se parte de "faltó" (casilla vacía).
  const filas = estudiantes
    .map((e) => ({ id: e.id, nombre: e.nombre, presente: asistencia.get(e.id) === true }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

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

      <header>
        <h1 className="text-[1.75rem]">{clase.titulo}</h1>
        <p className="mt-1 text-marino-2">
          {clase.fecha} · {clase.asistenciaTomada ? "Asistencia tomada" : "Asistencia sin tomar"}
        </p>
        <p className="mt-2 text-[0.9rem] text-marino-2">
          Marca la casilla de quienes asistieron; los que queden sin marcar se registran como falta.
        </p>
      </header>

      <AsistenciaForm cursoId={curso.id} claseId={clase.id} estudiantes={filas} yaTomada={clase.asistenciaTomada} />
    </div>
  );
}
