import { consultar, consultarUno } from "./db";

type FilaTarea = {
  id: number;
  titulo: string;
  descripcion: string;
  completada: number;
  creada_en: string;
};

export type Tarea = {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
  creadaEn: string;
};

export type DatosTarea = {
  titulo?: unknown;
  descripcion?: unknown;
  completada?: unknown;
};

export class ErrorValidacion extends Error {}

function aTarea(fila: FilaTarea): Tarea {
  return {
    id: fila.id,
    titulo: fila.titulo,
    descripcion: fila.descripcion,
    completada: fila.completada === 1,
    creadaEn: fila.creada_en,
  };
}

function validarTitulo(valor: unknown): string {
  if (typeof valor !== "string" || valor.trim().length === 0) {
    throw new ErrorValidacion("El título es obligatorio");
  }
  if (valor.trim().length > 200) {
    throw new ErrorValidacion("El título no puede superar 200 caracteres");
  }
  return valor.trim();
}

function validarDescripcion(valor: unknown): string {
  if (valor === undefined || valor === null) return "";
  if (typeof valor !== "string") {
    throw new ErrorValidacion("La descripción debe ser texto");
  }
  return valor.trim();
}

function validarCompletada(valor: unknown): number {
  if (typeof valor !== "boolean") {
    throw new ErrorValidacion("El campo completada debe ser booleano");
  }
  return valor ? 1 : 0;
}

export async function listarTareas(): Promise<Tarea[]> {
  const filas = await consultar<FilaTarea>(
    "SELECT * FROM tareas ORDER BY completada ASC, id DESC"
  );
  return filas.map(aTarea);
}

export async function obtenerTarea(id: number): Promise<Tarea | null> {
  const fila = await consultarUno<FilaTarea>("SELECT * FROM tareas WHERE id = ?", [id]);
  return fila ? aTarea(fila) : null;
}

export async function crearTarea(datos: DatosTarea): Promise<Tarea> {
  const titulo = validarTitulo(datos.titulo);
  const descripcion = validarDescripcion(datos.descripcion);
  const fila = await consultarUno<FilaTarea>(
    "INSERT INTO tareas (titulo, descripcion) VALUES (?, ?) RETURNING *",
    [titulo, descripcion]
  );
  return aTarea(fila!);
}

export async function actualizarTarea(id: number, datos: DatosTarea): Promise<Tarea | null> {
  const actual = await obtenerTarea(id);
  if (!actual) return null;

  const titulo = datos.titulo !== undefined ? validarTitulo(datos.titulo) : actual.titulo;
  const descripcion =
    datos.descripcion !== undefined ? validarDescripcion(datos.descripcion) : actual.descripcion;
  const completada =
    datos.completada !== undefined ? validarCompletada(datos.completada) : actual.completada ? 1 : 0;

  const fila = await consultarUno<FilaTarea>(
    "UPDATE tareas SET titulo = ?, descripcion = ?, completada = ? WHERE id = ? RETURNING *",
    [titulo, descripcion, completada, id]
  );
  return fila ? aTarea(fila) : null;
}

export async function alternarTarea(id: number): Promise<Tarea | null> {
  const fila = await consultarUno<FilaTarea>(
    "UPDATE tareas SET completada = 1 - completada WHERE id = ? RETURNING *",
    [id]
  );
  return fila ? aTarea(fila) : null;
}

export async function eliminarTarea(id: number): Promise<boolean> {
  const fila = await consultarUno<{ id: number }>(
    "DELETE FROM tareas WHERE id = ? RETURNING id",
    [id]
  );
  return fila !== null;
}
