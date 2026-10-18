import { NextResponse } from "next/server";
import { crearTarea, listarTareas } from "@/lib/tareas";
import { leerJson, manejarError } from "@/lib/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await listarTareas());
  } catch (error) {
    return manejarError(error);
  }
}

export async function POST(request: Request) {
  try {
    const datos = await leerJson(request);
    const tarea = await crearTarea(datos);
    return NextResponse.json(tarea, { status: 201 });
  } catch (error) {
    return manejarError(error);
  }
}
