import path from "node:path";
import initSqlJs, { type BindParams, type Database } from "sql.js";

const globalForDb = globalThis as unknown as { dbPromise?: Promise<Database> };

async function crearBaseDeDatos(): Promise<Database> {
  const SQL = await initSqlJs({
    locateFile: (archivo) => path.join(process.cwd(), "node_modules", "sql.js", "dist", archivo),
  });

  const db = new SQL.Database();

  db.run(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      completada INTEGER NOT NULL DEFAULT 0,
      creada_en TEXT NOT NULL DEFAULT (datetime('now'))
    );

    INSERT INTO tareas (titulo, descripcion) VALUES
      ('Configurar el proyecto', 'Monolito Next.js con SQLite en memoria'),
      ('Diseñar el modelo de datos', 'Definir tablas y relaciones'),
      ('Publicar la primera versión', '');
  `);

  return db;
}

export function obtenerDb(): Promise<Database> {
  globalForDb.dbPromise ??= crearBaseDeDatos();
  return globalForDb.dbPromise;
}

export async function consultar<T>(sql: string, parametros: BindParams = []): Promise<T[]> {
  const db = await obtenerDb();
  const sentencia = db.prepare(sql);
  try {
    sentencia.bind(parametros);
    const filas: T[] = [];
    while (sentencia.step()) {
      filas.push(sentencia.getAsObject() as T);
    }
    return filas;
  } finally {
    sentencia.free();
  }
}

export async function consultarUno<T>(sql: string, parametros: BindParams = []): Promise<T | null> {
  const filas = await consultar<T>(sql, parametros);
  return filas[0] ?? null;
}
