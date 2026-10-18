"use server";

import { revalidatePath } from "next/cache";
import { alternarTarea, crearTarea, eliminarTarea, ErrorValidacion } from "@/lib/tareas";

export type EstadoFormulario = { error: string | null };

export async function crearTareaAccion(
  _estado: EstadoFormulario,
  formData: FormData
): Promise<EstadoFormulario> {
  try {
    await crearTarea({
      titulo: formData.get("titulo"),
      descripcion: formData.get("descripcion"),
    });
  } catch (error) {
    if (error instanceof ErrorValidacion) return { error: error.message };
    throw error;
  }
  revalidatePath("/tareas");
  return { error: null };
}

export async function alternarTareaAccion(id: number) {
  await alternarTarea(id);
  revalidatePath("/tareas");
}

export async function eliminarTareaAccion(id: number) {
  await eliminarTarea(id);
  revalidatePath("/tareas");
}
