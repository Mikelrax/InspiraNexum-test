import { randomBytes } from "node:crypto";
import type { Database } from "sql.js";
import { consultar, consultarUno, obtenerDb } from "./db";
import { ErrorValidacion } from "./tareas";

// Las tablas se crean aquí (idempotente) para no depender de db.ts, que otros módulos también editan.
const globalParaEsquema = globalThis as unknown as { esquemaEducacion?: Promise<void> };

function crearEsquema(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS cursos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      instructor TEXT NOT NULL DEFAULT '',
      creado_en TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS estudiantes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      curso_id INTEGER NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
      nombre TEXT NOT NULL,
      origen TEXT NOT NULL DEFAULT 'manual',
      creado_en TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Un enlace de registro por curso; max_usos NULL significa ilimitado.
    CREATE TABLE IF NOT EXISTS enlaces_inscripcion (
      curso_id INTEGER PRIMARY KEY REFERENCES cursos(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      max_usos INTEGER,
      usos INTEGER NOT NULL DEFAULT 0,
      activo INTEGER NOT NULL DEFAULT 1,
      actualizado_en TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

async function db(): Promise<Database> {
  const base = await obtenerDb();
  globalParaEsquema.esquemaEducacion ??= Promise.resolve().then(() => {
    // sql.js ejecuta PRAGMA foreign_keys por conexión; se reafirma por si la base se recreó.
    base.run("PRAGMA foreign_keys = ON;");
    crearEsquema(base);
  });
  await globalParaEsquema.esquemaEducacion;
  return base;
}

async function q<T>(sql: string, parametros: (string | number | null)[] = []): Promise<T[]> {
  await db();
  return consultar<T>(sql, parametros);
}

async function q1<T>(sql: string, parametros: (string | number | null)[] = []): Promise<T | null> {
  await db();
  return consultarUno<T>(sql, parametros);
}

// ---------- Tipos ----------

export type Curso = {
  id: number;
  nombre: string;
  descripcion: string;
  instructor: string;
  creadoEn: string;
  estudiantes: number;
};

export type Estudiante = {
  id: number;
  cursoId: number;
  nombre: string;
  origen: "manual" | "enlace";
  creadoEn: string;
};

export type EnlaceInscripcion = {
  cursoId: number;
  token: string;
  maxUsos: number | null;
  usos: number;
  activo: boolean;
};

type FilaCurso = {
  id: number;
  nombre: string;
  descripcion: string;
  instructor: string;
  creado_en: string;
  estudiantes: number;
};

type FilaEstudiante = {
  id: number;
  curso_id: number;
  nombre: string;
  origen: "manual" | "enlace";
  creado_en: string;
};

type FilaEnlace = {
  curso_id: number;
  token: string;
  max_usos: number | null;
  usos: number;
  activo: number;
};

const aCurso = (f: FilaCurso): Curso => ({
  id: f.id,
  nombre: f.nombre,
  descripcion: f.descripcion,
  instructor: f.instructor,
  creadoEn: f.creado_en,
  estudiantes: f.estudiantes,
});

const aEstudiante = (f: FilaEstudiante): Estudiante => ({
  id: f.id,
  cursoId: f.curso_id,
  nombre: f.nombre,
  origen: f.origen,
  creadoEn: f.creado_en,
});

const aEnlace = (f: FilaEnlace): EnlaceInscripcion => ({
  cursoId: f.curso_id,
  token: f.token,
  maxUsos: f.max_usos,
  usos: f.usos,
  activo: f.activo === 1,
});

// ---------- Validación ----------

function texto(valor: unknown, campo: string, max: number, obligatorio: boolean): string {
  if (valor === undefined || valor === null || valor === "") {
    if (obligatorio) throw new ErrorValidacion(`${campo} es obligatorio`);
    return "";
  }
  if (typeof valor !== "string") throw new ErrorValidacion(`${campo} debe ser texto`);
  const limpio = valor.trim().replace(/\s+/g, " ");
  if (obligatorio && limpio.length === 0) throw new ErrorValidacion(`${campo} es obligatorio`);
  if (limpio.length > max) throw new ErrorValidacion(`${campo} no puede superar ${max} caracteres`);
  return limpio;
}

export function validarNombreEstudiante(valor: unknown): string {
  return texto(valor, "El nombre", 120, true);
}

// ---------- Cursos ----------

export async function listarCursos(): Promise<Curso[]> {
  const filas = await q<FilaCurso>(`
    SELECT c.*, (SELECT COUNT(*) FROM estudiantes e WHERE e.curso_id = c.id) AS estudiantes
    FROM cursos c ORDER BY c.id DESC
  `);
  return filas.map(aCurso);
}

export async function obtenerCurso(id: number): Promise<Curso | null> {
  const fila = await q1<FilaCurso>(
    `SELECT c.*, (SELECT COUNT(*) FROM estudiantes e WHERE e.curso_id = c.id) AS estudiantes
     FROM cursos c WHERE c.id = ?`,
    [id]
  );
  return fila ? aCurso(fila) : null;
}

export async function crearCurso(datos: {
  nombre?: unknown;
  descripcion?: unknown;
  instructor?: unknown;
}): Promise<Curso> {
  const nombre = texto(datos.nombre, "El nombre del curso", 150, true);
  const descripcion = texto(datos.descripcion, "La descripción", 1000, false);
  const instructor = texto(datos.instructor, "El instructor", 120, false);
  const fila = await q1<FilaCurso>(
    `INSERT INTO cursos (nombre, descripcion, instructor) VALUES (?, ?, ?)
     RETURNING *, 0 AS estudiantes`,
    [nombre, descripcion, instructor]
  );
  return aCurso(fila!);
}

export async function eliminarCurso(id: number): Promise<boolean> {
  const base = await db();
  // Se borra en cascada a mano: no se asume que foreign_keys esté activo en la conexión.
  base.run("DELETE FROM estudiantes WHERE curso_id = ?", [id]);
  base.run("DELETE FROM enlaces_inscripcion WHERE curso_id = ?", [id]);
  const fila = await q1<{ id: number }>("DELETE FROM cursos WHERE id = ? RETURNING id", [id]);
  return fila !== null;
}

// ---------- Estudiantes ----------

export async function listarEstudiantes(cursoId: number): Promise<Estudiante[]> {
  const filas = await q<FilaEstudiante>(
    "SELECT * FROM estudiantes WHERE curso_id = ? ORDER BY id DESC",
    [cursoId]
  );
  return filas.map(aEstudiante);
}

export async function agregarEstudiante(
  cursoId: number,
  nombre: unknown,
  origen: "manual" | "enlace" = "manual"
): Promise<Estudiante> {
  const limpio = validarNombreEstudiante(nombre);
  if (!(await obtenerCurso(cursoId))) throw new ErrorValidacion("El curso no existe");
  const fila = await q1<FilaEstudiante>(
    "INSERT INTO estudiantes (curso_id, nombre, origen) VALUES (?, ?, ?) RETURNING *",
    [cursoId, limpio, origen]
  );
  return aEstudiante(fila!);
}

export async function eliminarEstudiante(id: number): Promise<boolean> {
  const fila = await q1<{ id: number }>("DELETE FROM estudiantes WHERE id = ? RETURNING id", [id]);
  return fila !== null;
}

// ---------- Enlace dinámico ----------

const nuevoToken = () => randomBytes(18).toString("base64url");

export async function obtenerEnlace(cursoId: number): Promise<EnlaceInscripcion | null> {
  const fila = await q1<FilaEnlace>("SELECT * FROM enlaces_inscripcion WHERE curso_id = ?", [
    cursoId,
  ]);
  return fila ? aEnlace(fila) : null;
}

export function validarMaxUsos(valor: unknown): number | null {
  if (valor === null || valor === undefined || valor === "") return null;
  const n = typeof valor === "number" ? valor : Number(valor);
  if (!Number.isInteger(n) || n < 1 || n > 100000) {
    throw new ErrorValidacion("El límite de usos debe ser un entero entre 1 y 100000");
  }
  return n;
}

/** Crea o reconfigura el enlace del curso: genera un token nuevo y reinicia el contador de usos. */
export async function configurarEnlace(
  cursoId: number,
  maxUsos: number | null
): Promise<EnlaceInscripcion> {
  if (!(await obtenerCurso(cursoId))) throw new ErrorValidacion("El curso no existe");
  const fila = await q1<FilaEnlace>(
    `INSERT INTO enlaces_inscripcion (curso_id, token, max_usos, usos, activo)
     VALUES (?, ?, ?, 0, 1)
     ON CONFLICT(curso_id) DO UPDATE SET
       token = excluded.token, max_usos = excluded.max_usos, usos = 0, activo = 1,
       actualizado_en = datetime('now')
     RETURNING *`,
    [cursoId, nuevoToken(), maxUsos]
  );
  return aEnlace(fila!);
}

/** Invalida el token actual y emite uno nuevo con la misma configuración (usos en cero). */
export async function rotarEnlace(cursoId: number): Promise<EnlaceInscripcion | null> {
  const fila = await q1<FilaEnlace>(
    `UPDATE enlaces_inscripcion SET token = ?, usos = 0, activo = 1, actualizado_en = datetime('now')
     WHERE curso_id = ? RETURNING *`,
    [nuevoToken(), cursoId]
  );
  return fila ? aEnlace(fila) : null;
}

export async function cambiarEstadoEnlace(
  cursoId: number,
  activo: boolean
): Promise<EnlaceInscripcion | null> {
  const fila = await q1<FilaEnlace>(
    `UPDATE enlaces_inscripcion SET activo = ?, actualizado_en = datetime('now')
     WHERE curso_id = ? RETURNING *`,
    [activo ? 1 : 0, cursoId]
  );
  return fila ? aEnlace(fila) : null;
}

export type EstadoEnlacePublico =
  | { estado: "ok"; curso: { id: number; nombre: string }; restantes: number | null }
  | { estado: "agotado" | "inactivo" | "invalido" };

export async function consultarEnlacePublico(token: string): Promise<EstadoEnlacePublico> {
  if (!/^[A-Za-z0-9_-]{10,64}$/.test(token)) return { estado: "invalido" };
  const fila = await q1<FilaEnlace & { nombre: string }>(
    `SELECT l.*, c.nombre FROM enlaces_inscripcion l JOIN cursos c ON c.id = l.curso_id
     WHERE l.token = ?`,
    [token]
  );
  if (!fila) return { estado: "invalido" };
  if (!fila.activo) return { estado: "inactivo" };
  if (fila.max_usos !== null && fila.usos >= fila.max_usos) return { estado: "agotado" };
  return {
    estado: "ok",
    curso: { id: fila.curso_id, nombre: fila.nombre },
    restantes: fila.max_usos === null ? null : fila.max_usos - fila.usos,
  };
}

/**
 * Registra un estudiante usando un token público. El consumo del uso es una única
 * sentencia condicional, así el límite no se puede superar con envíos simultáneos.
 */
export async function inscribirConEnlace(
  token: string,
  nombre: unknown
): Promise<{ curso: string }> {
  const limpio = validarNombreEstudiante(nombre);
  const estado = await consultarEnlacePublico(token);
  if (estado.estado !== "ok") {
    const motivos = {
      invalido: "Este enlace no es válido",
      inactivo: "Este enlace fue desactivado",
      agotado: "Este enlace ya alcanzó su límite de usos",
    };
    throw new ErrorValidacion(motivos[estado.estado]);
  }

  const consumido = await q1<{ curso_id: number }>(
    `UPDATE enlaces_inscripcion SET usos = usos + 1
     WHERE token = ? AND activo = 1 AND (max_usos IS NULL OR usos < max_usos)
     RETURNING curso_id`,
    [token]
  );
  if (!consumido) throw new ErrorValidacion("Este enlace ya alcanzó su límite de usos");

  await q1("INSERT INTO estudiantes (curso_id, nombre, origen) VALUES (?, ?, 'enlace') RETURNING id", [
    consumido.curso_id,
    limpio,
  ]);
  return { curso: estado.curso.nombre };
}
