"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { ErrorValidacion } from "@/lib/tareas";
import {
  agregarEstudiante,
  cambiarEstadoEnlace,
  configurarEnlace,
  crearCurso,
  eliminarCurso,
  eliminarEstudiante,
  rotarEnlace,
  validarMaxUsos,
} from "@/lib/educacion";

export type EstadoFormulario = { error: string | null; ok?: boolean };

// Las server actions son endpoints públicos: se valida la sesión en cada una.
async function requerirSesion() {
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect("/admin/login");
}

async function conErrores(trabajo: () => Promise<void>): Promise<EstadoFormulario> {
  try {
    await trabajo();
  } catch (error) {
    if (error instanceof ErrorValidacion) return { error: error.message };
    throw error;
  }
  return { error: null, ok: true };
}

const rutaCurso = (id: number) => `/admin/educacion/${id}`;

export async function crearCursoAccion(
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  await requerirSesion();
  const resultado = await conErrores(async () => {
    await crearCurso({
      nombre: formData.get("nombre"),
      descripcion: formData.get("descripcion"),
      instructor: formData.get("instructor"),
    });
  });
  if (resultado.ok) revalidatePath("/admin/educacion");
  return resultado;
}

export async function eliminarCursoAccion(id: number) {
  await requerirSesion();
  await eliminarCurso(id);
  revalidatePath("/admin/educacion");
}

export async function agregarEstudianteAccion(
  cursoId: number,
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  await requerirSesion();
  const resultado = await conErrores(async () => {
    await agregarEstudiante(cursoId, formData.get("nombre"), "manual");
  });
  if (resultado.ok) {
    revalidatePath(rutaCurso(cursoId));
    revalidatePath("/admin/educacion");
  }
  return resultado;
}

export async function eliminarEstudianteAccion(cursoId: number, estudianteId: number) {
  await requerirSesion();
  await eliminarEstudiante(estudianteId);
  revalidatePath(rutaCurso(cursoId));
  revalidatePath("/admin/educacion");
}

export async function configurarEnlaceAccion(
  cursoId: number,
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  await requerirSesion();
  const resultado = await conErrores(async () => {
    const maxUsos =
      formData.get("modo") === "limitado" ? validarMaxUsos(formData.get("maxUsos") || "x") : null;
    await configurarEnlace(cursoId, maxUsos);
  });
  if (resultado.ok) revalidatePath(rutaCurso(cursoId));
  return resultado;
}

export async function rotarEnlaceAccion(cursoId: number) {
  await requerirSesion();
  await rotarEnlace(cursoId);
  revalidatePath(rutaCurso(cursoId));
}

export async function cambiarEstadoEnlaceAccion(cursoId: number, activo: boolean) {
  await requerirSesion();
  await cambiarEstadoEnlace(cursoId, activo);
  revalidatePath(rutaCurso(cursoId));
}
