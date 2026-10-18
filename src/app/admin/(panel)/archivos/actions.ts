"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { ErrorValidacion } from "@/lib/tareas";
import {
  crearCarpeta,
  eliminarArchivo,
  eliminarCarpeta,
  normalizarRuta,
  renombrarArchivo,
  renombrarCarpeta,
  urlDescarga,
  urlSubida,
} from "@/lib/almacen";

export type Resultado<T = object> = ({ error: null } & T) | { error: string };

// Las server actions son endpoints públicos: se valida la sesión en cada una.
async function requerirSesion() {
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect("/admin/login");
}

async function conErrores<T = object>(trabajo: () => Promise<T>): Promise<Resultado<T>> {
  try {
    return { error: null, ...(await trabajo()) };
  } catch (error) {
    if (error instanceof ErrorValidacion) return { error: error.message };
    console.error(error);
    return { error: "No se pudo completar la operación con el almacenamiento" };
  }
}

const refrescar = () => revalidatePath("/admin/archivos");

export async function crearCarpetaAccion(carpeta: string, nombre: string): Promise<Resultado> {
  await requerirSesion();
  const resultado = await conErrores(async () => {
    await crearCarpeta(normalizarRuta(carpeta), nombre);
    return {};
  });
  if (!resultado.error) refrescar();
  return resultado;
}

export async function renombrarCarpetaAccion(ruta: string, nombre: string): Promise<Resultado> {
  await requerirSesion();
  const resultado = await conErrores(async () => {
    await renombrarCarpeta(normalizarRuta(ruta), nombre);
    return {};
  });
  if (!resultado.error) refrescar();
  return resultado;
}

export async function eliminarCarpetaAccion(ruta: string): Promise<Resultado> {
  await requerirSesion();
  const resultado = await conErrores(async () => {
    await eliminarCarpeta(normalizarRuta(ruta));
    return {};
  });
  if (!resultado.error) refrescar();
  return resultado;
}

export async function renombrarArchivoAccion(ruta: string, nombre: string): Promise<Resultado> {
  await requerirSesion();
  const resultado = await conErrores(async () => {
    await renombrarArchivo(normalizarRuta(ruta), nombre);
    return {};
  });
  if (!resultado.error) refrescar();
  return resultado;
}

export async function eliminarArchivoAccion(ruta: string): Promise<Resultado> {
  await requerirSesion();
  const resultado = await conErrores(async () => {
    await eliminarArchivo(normalizarRuta(ruta));
    return {};
  });
  if (!resultado.error) refrescar();
  return resultado;
}

export async function prepararSubidaAccion(
  carpeta: string,
  nombre: string,
  tipo: string,
  tamano: number,
  sobrescribir: boolean
): Promise<Resultado<{ url: string; tipo: string }>> {
  await requerirSesion();
  return conErrores(async () => {
    const { url, tipo: tipoFinal } = await urlSubida(normalizarRuta(carpeta), nombre, tipo, tamano, sobrescribir);
    return { url, tipo: tipoFinal };
  });
}

/** Se llama al terminar de subir para que el listado del servidor se actualice. */
export async function subidaTerminadaAccion() {
  await requerirSesion();
  refrescar();
}

export async function descargarArchivoAccion(ruta: string): Promise<Resultado<{ url: string }>> {
  await requerirSesion();
  return conErrores(async () => ({ url: await urlDescarga(normalizarRuta(ruta)) }));
}
