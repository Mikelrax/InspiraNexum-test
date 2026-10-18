"use server";

import { headers } from "next/headers";
import { inscribirConEnlace } from "@/lib/educacion";
import { ErrorValidacion } from "@/lib/tareas";

export type EstadoInscripcion = { error: string | null; curso?: string };

// Límite sencillo por IP para que un enlace ilimitado no se llene de registros automáticos.
const MAX_POR_VENTANA = 10;
const VENTANA_MS = 60 * 1000;
const globalParaLimite = globalThis as unknown as {
  inscripcionesPorIp?: Map<string, { cantidad: number; reinicio: number }>;
};
const porIp = (globalParaLimite.inscripcionesPorIp ??= new Map());

function limiteSuperado(ip: string): boolean {
  const ahora = Date.now();
  const registro = porIp.get(ip);
  if (!registro || registro.reinicio < ahora) {
    porIp.set(ip, { cantidad: 1, reinicio: ahora + VENTANA_MS });
    return false;
  }
  registro.cantidad++;
  return registro.cantidad > MAX_POR_VENTANA;
}

export async function inscribirseAccion(
  token: string,
  _estado: EstadoInscripcion,
  formData: FormData
): Promise<EstadoInscripcion> {
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0].trim() || "local";
  if (limiteSuperado(ip)) return { error: "Demasiados intentos. Espera un minuto e inténtalo de nuevo" };

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
