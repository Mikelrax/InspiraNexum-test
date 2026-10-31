"use server";

import { headers } from "next/headers";
import { inscribirConEnlace } from "@/lib/educacion";
import { ErrorValidacion } from "@/lib/tareas";
import { crearLimitador, ipCliente } from "@/lib/limite";

export type EstadoInscripcion = { error: string | null; curso?: string };

// Límite sencillo por IP para que un enlace ilimitado no se llene de registros automáticos.
const limite = crearLimitador("inscripcion-ip", 10, 60 * 1000);

export async function inscribirseAccion(
  token: string,
  _estado: EstadoInscripcion,
  formData: FormData
): Promise<EstadoInscripcion> {
  if (limite.consumir(ipCliente(await headers()))) return { error: "Demasiados intentos. Espera un minuto e inténtalo de nuevo" };

  try {
    const { curso } = await inscribirConEnlace(token, formData.get("nombre"));
    // Sin revalidatePath: refrescaría esta página y el último inscrito vería "límite alcanzado"
    // en lugar de su confirmación. Las páginas del panel son dinámicas, no hay caché que invalidar.
    return { error: null, curso };
  } catch (error) {
    if (error instanceof ErrorValidacion) return { error: error.message };
    throw error;
  }
}
