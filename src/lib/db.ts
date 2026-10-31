import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import initSqlJs, { type BindParams, type Database } from "sql.js";

// SQLite (sql.js) vive en memoria. Si DB_PATH está definido, la base se carga de ese
// archivo al arrancar y se vuelve a escribir (con un pequeño retardo) tras cada cambio,
// para que cursos, estudiantes y asistencias sobrevivan a un reinicio del servidor.
// Sin DB_PATH el comportamiento es el de siempre: todo se pierde al reiniciar.

const RETARDO_GUARDADO_MS = 1000;

const globalForDb = globalThis as unknown as {
  dbPromise?: Promise<Database>;
  guardadoPendiente?: ReturnType<typeof setTimeout>;
  salidaRegistrada?: boolean;
};

const rutaArchivo = () => {
  const ruta = process.env.DB_PATH?.trim();
  return ruta ? path.resolve(ruta) : null;
};

function crearEsquemaTareas(db: Database) {
  db.run(`
    CREATE TABLE IF NOT EXISTS tareas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL DEFAULT '',
      completada INTEGER NOT NULL DEFAULT 0,
      creada_en TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}

function sembrarTareas(db: Database) {
  db.run(`
    INSERT INTO tareas (titulo, descripcion) VALUES
      ('Configurar el proyecto', 'Monolito Next.js con SQLite en memoria'),
      ('Diseñar el modelo de datos', 'Definir tablas y relaciones'),
      ('Publicar la primera versión', '');
  `);
}

/** Escribe la base al disco de forma atómica (archivo temporal + rename). */
function guardarAhora(db: Database, ruta: string) {
  if (globalForDb.guardadoPendiente) {
    clearTimeout(globalForDb.guardadoPendiente);
    globalForDb.guardadoPendiente = undefined;
  }
  try {
    // export() cierra y reabre la conexión: se pierden los pragmas y el hook de cambios.
    const datos = db.export();
    configurarConexion(db, ruta);
    mkdirSync(path.dirname(ruta), { recursive: true });
    const temporal = `${ruta}.tmp`;
    writeFileSync(temporal, datos);
    renameSync(temporal, ruta);
  } catch (error) {
    console.error(`No se pudo guardar la base de datos en ${ruta}`, error);
  }
}

function programarGuardado(db: Database, ruta: string) {
  if (globalForDb.guardadoPendiente) return;
  globalForDb.guardadoPendiente = setTimeout(() => {
    globalForDb.guardadoPendiente = undefined;
    guardarAhora(db, ruta);
  }, RETARDO_GUARDADO_MS);
  // No mantiene vivo el proceso solo por un guardado pendiente; la salida lo vacía.
  globalForDb.guardadoPendiente.unref?.();
}

function configurarConexion(db: Database, ruta: string | null) {
  db.run("PRAGMA foreign_keys = ON;");
  if (ruta) db.updateHook(() => programarGuardado(db, ruta));
}

function registrarGuardadoAlSalir(db: Database, ruta: string) {
  if (globalForDb.salidaRegistrada) return;
  globalForDb.salidaRegistrada = true;
  // "exit" corre también cuando Next llama a process.exit() en su apagado; el guardado es síncrono.
  process.once("exit", () => {
    if (globalForDb.guardadoPendiente) guardarAhora(db, ruta);
  });
  // Si nadie más atiende las señales, se convierten en una salida normal para que "exit" se dispare.
  for (const senal of ["SIGINT", "SIGTERM"] as const) {
    if (process.listenerCount(senal) === 0) process.once(senal, () => process.exit(0));
  }
}

async function crearBaseDeDatos(): Promise<Database> {
  const SQL = await initSqlJs({
    locateFile: (archivo) => path.join(process.cwd(), "node_modules", "sql.js", "dist", archivo),
  });

  const ruta = rutaArchivo();
  const existente = ruta !== null && existsSync(ruta);
  const db = existente ? new SQL.Database(readFileSync(ruta)) : new SQL.Database();

  crearEsquemaTareas(db);
  if (!existente) sembrarTareas(db);
  configurarConexion(db, ruta);

  if (ruta) {
    registrarGuardadoAlSalir(db, ruta);
    // Primer arranque: se crea el archivo aunque aún no haya cambios.
    if (!existente) programarGuardado(db, ruta);
  }

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
