import { NextResponse } from "next/server";
import { ErrorValidacion } from "./tareas";

export function parsearId(valor: string): number | null {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function leerJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const cuerpo = await request.json();
    if (cuerpo && typeof cuerpo === "object" && !Array.isArray(cuerpo)) {
      return cuerpo as Record<string, unknown>;
    }
  } catch {}
  throw new ErrorValidacion("El cuerpo debe ser un objeto JSON válido");
}

export function manejarError(error: unknown) {
  if (error instanceof ErrorValidacion) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error(error);
  return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
}

export function noEncontrado() {
  return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
}
