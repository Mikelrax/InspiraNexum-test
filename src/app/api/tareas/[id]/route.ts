import { NextResponse } from "next/server";
import { actualizarTarea, eliminarTarea, obtenerTarea } from "@/lib/tareas";
import { leerJson, manejarError, noEncontrado, parsearId } from "@/lib/http";

type Contexto = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Contexto) {
  try {
    const id = parsearId((await params).id);
    if (id === null) return noEncontrado();
    const tarea = await obtenerTarea(id);
    return tarea ? NextResponse.json(tarea) : noEncontrado();
  } catch (error) {
    return manejarError(error);
  }
}

export async function PATCH(request: Request, { params }: Contexto) {
  try {
    const id = parsearId((await params).id);
    if (id === null) return noEncontrado();
    const datos = await leerJson(request);
    const tarea = await actualizarTarea(id, datos);
    return tarea ? NextResponse.json(tarea) : noEncontrado();
  } catch (error) {
    return manejarError(error);
  }
}

export async function DELETE(_request: Request, { params }: Contexto) {
  try {
    const id = parsearId((await params).id);
    if (id === null) return noEncontrado();
    const eliminada = await eliminarTarea(id);
    return eliminada ? new NextResponse(null, { status: 204 }) : noEncontrado();
  } catch (error) {
    return manejarError(error);
  }
}
