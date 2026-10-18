import { db, obtenerCurso, q, q1, texto } from "./educacion";
import { ErrorValidacion } from "./tareas";

// ---------- Tipos ----------

export type Clase = {
  id: number;
  cursoId: number;
  titulo: string;
  fecha: string; // YYYY-MM-DD
  asistenciaTomada: boolean;
  presentes: number;
  faltas: number;
};

type FilaClase = {
  id: number;
  curso_id: number;
  titulo: string;
  fecha: string;
  asistencia_tomada_en: string | null;
  presentes: number;
  faltas: number;
};

const aClase = (f: FilaClase): Clase => ({
  id: f.id,
  cursoId: f.curso_id,
  titulo: f.titulo,
  fecha: f.fecha,
  asistenciaTomada: f.asistencia_tomada_en !== null,
  presentes: f.presentes,
  faltas: f.faltas,
});

const SELECT_CLASE = `
  SELECT c.*,
    COALESCE((SELECT SUM(presente) FROM asistencias a WHERE a.clase_id = c.id), 0) AS presentes,
    (SELECT COUNT(*) FROM asistencias a WHERE a.clase_id = c.id AND a.presente = 0) AS faltas
  FROM clases c`;

// ---------- Fechas ----------

/** Fecha de hoy (YYYY-MM-DD) en la zona horaria de la operación, no la del servidor. */
export function hoy(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
}

export function esFechaValida(valor: unknown): valor is string {
  if (typeof valor !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
  const fecha = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().startsWith(valor);
}

// ---------- Clases ----------

export async function listarClases(cursoId: number): Promise<Clase[]> {
  const filas = await q<FilaClase>(`${SELECT_CLASE} WHERE c.curso_id = ? ORDER BY c.fecha DESC, c.id DESC`, [
    cursoId,
  ]);
  return filas.map(aClase);
}

export async function obtenerClase(cursoId: number, claseId: number): Promise<Clase | null> {
  const fila = await q1<FilaClase>(`${SELECT_CLASE} WHERE c.id = ? AND c.curso_id = ?`, [claseId, cursoId]);
  return fila ? aClase(fila) : null;
}

export async function crearClase(
  cursoId: number,
  datos: { titulo?: unknown; fecha?: unknown }
): Promise<Clase> {
  if (!(await obtenerCurso(cursoId))) throw new ErrorValidacion("El curso no existe");
  const titulo = texto(datos.titulo, "El título de la clase", 150, true);
  if (!esFechaValida(datos.fecha)) throw new ErrorValidacion("La fecha no es válida");
  const fila = await q1<{ id: number }>(
    "INSERT INTO clases (curso_id, titulo, fecha) VALUES (?, ?, ?) RETURNING id",
    [cursoId, titulo, datos.fecha]
  );
  return (await obtenerClase(cursoId, fila!.id))!;
}

export async function eliminarClase(cursoId: number, claseId: number): Promise<boolean> {
  const base = await db();
  const clase = await obtenerClase(cursoId, claseId);
  if (!clase) return false;
  base.run("DELETE FROM asistencias WHERE clase_id = ?", [claseId]);
  base.run("DELETE FROM clases WHERE id = ?", [claseId]);
  return true;
}

// ---------- Asistencia ----------

/** Estado guardado por estudiante: true asistió, false faltó, ausente del mapa = sin registro. */
export async function obtenerAsistencia(claseId: number): Promise<Map<number, boolean>> {
  const filas = await q<{ estudiante_id: number; presente: number }>(
    "SELECT estudiante_id, presente FROM asistencias WHERE clase_id = ?",
    [claseId]
  );
  return new Map(filas.map((f) => [f.estudiante_id, f.presente === 1]));
}

/**
 * Guarda la asistencia completa de una clase: todo estudiante inscrito queda como asistió
 * (si está en `presentes`) o faltó. Los ids ajenos al curso se ignoran.
 */
export async function guardarAsistencia(
  cursoId: number,
  claseId: number,
  presentes: number[]
): Promise<void> {
  const clase = await obtenerClase(cursoId, claseId);
  if (!clase) throw new ErrorValidacion("La clase no existe");
  const inscritos = await q<{ id: number }>("SELECT id FROM estudiantes WHERE curso_id = ?", [cursoId]);
  const marcados = new Set(presentes);

  const base = await db();
  base.run("BEGIN");
  try {
    for (const { id } of inscritos) {
      base.run(
        `INSERT INTO asistencias (clase_id, estudiante_id, presente) VALUES (?, ?, ?)
         ON CONFLICT(clase_id, estudiante_id) DO UPDATE SET presente = excluded.presente`,
        [claseId, id, marcados.has(id) ? 1 : 0]
      );
    }
    base.run("UPDATE clases SET asistencia_tomada_en = datetime('now') WHERE id = ?", [claseId]);
    base.run("COMMIT");
  } catch (error) {
    base.run("ROLLBACK");
    throw error;
  }
}

// ---------- Reporte ----------

export type FiltroReporte = { desde: string | null; hasta: string | null };

export type FilaReporte = {
  estudianteId: number;
  nombre: string;
  /** Por clase (mismo orden que `clases`): true asistió, false faltó, null sin registro. */
  asistencia: (boolean | null)[];
  presentes: number;
  faltas: number;
  /** Porcentaje 0-100 sobre las clases con registro del estudiante; null si no tiene ninguna. */
  porcentaje: number | null;
};

export type Reporte = {
  clases: Clase[];
  filas: FilaReporte[];
  /** Clases del rango a las que aún no se les tomó asistencia (no cuentan en el reporte). */
  sinTomar: number;
  porcentajeGeneral: number | null;
};

const porcentaje = (presentes: number, total: number) =>
  total === 0 ? null : Math.round((presentes * 1000) / total) / 10;

/**
 * Cruza estudiantes × clases con asistencia tomada. Una clase solo cuenta para quien tiene
 * registro en ella, así quien se inscribe después no arrastra faltas de clases anteriores.
 */
export async function generarReporte(cursoId: number, filtro: FiltroReporte): Promise<Reporte> {
  const condiciones = ["c.curso_id = ?"];
  const parametros: (string | number)[] = [cursoId];
  if (filtro.desde) {
    condiciones.push("c.fecha >= ?");
    parametros.push(filtro.desde);
  }
  if (filtro.hasta) {
    condiciones.push("c.fecha <= ?");
    parametros.push(filtro.hasta);
  }

  const todas = (
    await q<FilaClase>(`${SELECT_CLASE} WHERE ${condiciones.join(" AND ")} ORDER BY c.fecha, c.id`, parametros)
  ).map(aClase);
  const clases = todas.filter((c) => c.asistenciaTomada);

  const estudiantes = await q<{ id: number; nombre: string }>(
    "SELECT id, nombre FROM estudiantes WHERE curso_id = ? ORDER BY nombre COLLATE NOCASE, id",
    [cursoId]
  );
  const registros = await q<{ clase_id: number; estudiante_id: number; presente: number }>(
    `SELECT a.clase_id, a.estudiante_id, a.presente FROM asistencias a
     JOIN clases c ON c.id = a.clase_id WHERE ${condiciones.join(" AND ")}`,
    parametros
  );
  const mapa = new Map(registros.map((r) => [`${r.clase_id}:${r.estudiante_id}`, r.presente === 1]));

  let totalPresentes = 0;
  let totalRegistros = 0;
  const filas = estudiantes.map<FilaReporte>((e) => {
    const asistencia = clases.map((c) => mapa.get(`${c.id}:${e.id}`) ?? null);
    const presentes = asistencia.filter((v) => v === true).length;
    const faltas = asistencia.filter((v) => v === false).length;
    totalPresentes += presentes;
    totalRegistros += presentes + faltas;
    return {
      estudianteId: e.id,
      nombre: e.nombre,
      asistencia,
      presentes,
      faltas,
      porcentaje: porcentaje(presentes, presentes + faltas),
    };
  });

  return {
    clases,
    filas,
    sinTomar: todas.length - clases.length,
    porcentajeGeneral: porcentaje(totalPresentes, totalRegistros),
  };
}

// ---------- CSV ----------

function celdaCsv(valor: string | number | null): string {
  let cadena = valor === null ? "" : String(valor);
  // Evita que Excel interprete nombres como fórmulas (=, +, -, @).
  if (/^[=+\-@\t\r]/.test(cadena)) cadena = `'${cadena}`;
  return /[",\n\r]/.test(cadena) ? `"${cadena.replace(/"/g, '""')}"` : cadena;
}

export function reporteACsv(reporte: Reporte): string {
  const encabezado = [
    "Estudiante",
    ...reporte.clases.map((c) => `${c.fecha} ${c.titulo}`),
    "Asistencias",
    "Faltas",
    "% asistencia",
  ];
  const lineas = reporte.filas.map((f) => [
    f.nombre,
    ...f.asistencia.map((v) => (v === null ? "" : v ? "Asistió" : "Faltó")),
    f.presentes,
    f.faltas,
    f.porcentaje,
  ]);
  const cuerpo = [encabezado, ...lineas].map((fila) => fila.map(celdaCsv).join(",")).join("\r\n");
  // BOM para que Excel abra bien los acentos.
  return `﻿${cuerpo}\r\n`;
}
