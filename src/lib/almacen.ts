import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ErrorValidacion } from "./tareas";

// Almacén de archivos sobre Cloudflare R2 (API compatible con S3).
// R2 no tiene carpetas reales: una carpeta es un prefijo "a/b/" y, para que
// las carpetas vacías existan, se guarda un objeto vacío cuya clave termina en "/".

export const TAMANO_MAXIMO_ARCHIVO = 500 * 1024 * 1024; // 500 MB
const VIGENCIA_URL_SEG = 15 * 60;
const MAX_NOMBRE = 200;
const MAX_RUTA = 900;

export type Carpeta = { nombre: string; ruta: string };
export type Archivo = { nombre: string; ruta: string; tamano: number; modificado: string | null };
export type Contenido = { carpetas: Carpeta[]; archivos: Archivo[] };

// ---------------------------------------------------------------- configuración

export function almacenConfigurado(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET
  );
}

const globalForR2 = globalThis as unknown as { clienteR2?: S3Client };

function cliente(): S3Client {
  if (!almacenConfigurado()) {
    throw new ErrorValidacion("El almacén no está configurado: faltan las variables R2_* en el entorno");
  }
  return (globalForR2.clienteR2 ??= new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
    // Los checksums opcionales del SDK nuevo rompen las URLs prefirmadas que usa el navegador con R2.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  }));
}

const bucket = () => process.env.R2_BUCKET!;

// ---------------------------------------------------------------- validación de rutas

/** Normaliza una ruta de carpeta ("a/b") rechazando traversal, rutas absolutas y caracteres de control. Devuelve "" para la raíz. */
export function normalizarRuta(valor: unknown): string {
  if (valor === undefined || valor === null || valor === "") return "";
  if (typeof valor !== "string") throw new ErrorValidacion("Ruta inválida");
  const segmentos = valor.split("/").filter((s) => s !== "");
  if (segmentos.length === 0) return "";
  segmentos.forEach(validarNombre);
  const ruta = segmentos.join("/");
  if (ruta.length > MAX_RUTA) throw new ErrorValidacion("La ruta es demasiado larga");
  return ruta;
}

/** Valida el nombre de un archivo o carpeta (un solo segmento). */
export function validarNombre(valor: unknown): string {
  if (typeof valor !== "string") throw new ErrorValidacion("El nombre es obligatorio");
  const nombre = valor.trim();
  if (!nombre) throw new ErrorValidacion("El nombre es obligatorio");
  if (nombre.length > MAX_NOMBRE) throw new ErrorValidacion(`El nombre no puede superar ${MAX_NOMBRE} caracteres`);
  if (nombre === "." || nombre === "..") throw new ErrorValidacion("Nombre no permitido");
  if (/[/\\]/.test(nombre)) throw new ErrorValidacion("El nombre no puede contener / ni \\");
  if (/[\u0000-\u001f\u007f]/.test(nombre)) throw new ErrorValidacion("El nombre contiene caracteres no permitidos");
  return nombre;
}

const unir = (carpeta: string, nombre: string) => (carpeta ? `${carpeta}/${nombre}` : nombre);
const carpetaPadre = (ruta: string) => ruta.split("/").slice(0, -1).join("/");
const ultimoSegmento = (ruta: string) => ruta.split("/").at(-1) ?? "";
const origenCopia = (clave: string) => `${bucket()}/${clave.split("/").map(encodeURIComponent).join("/")}`;

// ---------------------------------------------------------------- lectura

export async function listarContenido(carpeta: string): Promise<Contenido> {
  const prefijo = carpeta ? `${carpeta}/` : "";
  const carpetas: Carpeta[] = [];
  const archivos: Archivo[] = [];
  let token: string | undefined;

  do {
    const respuesta = await cliente().send(
      new ListObjectsV2Command({ Bucket: bucket(), Prefix: prefijo, Delimiter: "/", ContinuationToken: token })
    );
    for (const p of respuesta.CommonPrefixes ?? []) {
      if (!p.Prefix) continue;
      const ruta = p.Prefix.slice(0, -1);
      carpetas.push({ nombre: ultimoSegmento(ruta), ruta });
    }
    for (const o of respuesta.Contents ?? []) {
      // El propio marcador de la carpeta actual no es un archivo.
      if (!o.Key || o.Key === prefijo || o.Key.endsWith("/")) continue;
      archivos.push({
        nombre: o.Key.slice(prefijo.length),
        ruta: o.Key,
        tamano: o.Size ?? 0,
        modificado: o.LastModified?.toISOString() ?? null,
      });
    }
    token = respuesta.NextContinuationToken;
  } while (token);

  const porNombre = (a: { nombre: string }, b: { nombre: string }) =>
    a.nombre.localeCompare(b.nombre, "es", { sensitivity: "base", numeric: true });
  return { carpetas: carpetas.sort(porNombre), archivos: archivos.sort(porNombre) };
}

async function listarClaves(prefijo: string): Promise<string[]> {
  const claves: string[] = [];
  let token: string | undefined;
  do {
    const respuesta = await cliente().send(
      new ListObjectsV2Command({ Bucket: bucket(), Prefix: prefijo, ContinuationToken: token })
    );
    for (const o of respuesta.Contents ?? []) if (o.Key) claves.push(o.Key);
    token = respuesta.NextContinuationToken;
  } while (token);
  return claves;
}

async function existeObjeto(clave: string): Promise<boolean> {
  try {
    await cliente().send(new HeadObjectCommand({ Bucket: bucket(), Key: clave }));
    return true;
  } catch (error) {
    const e = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (e.name === "NotFound" || e.$metadata?.httpStatusCode === 404) return false;
    throw error;
  }
}

async function existeCarpeta(ruta: string): Promise<boolean> {
  const respuesta = await cliente().send(
    new ListObjectsV2Command({ Bucket: bucket(), Prefix: `${ruta}/`, MaxKeys: 1 })
  );
  return (respuesta.KeyCount ?? 0) > 0;
}

// ---------------------------------------------------------------- carpetas

export async function crearCarpeta(padre: string, nombreCrudo: unknown): Promise<void> {
  const nombre = validarNombre(nombreCrudo);
  const ruta = unir(padre, nombre);
  if (ruta.length > MAX_RUTA) throw new ErrorValidacion("La ruta es demasiado larga");
  if ((await existeCarpeta(ruta)) || (await existeObjeto(ruta))) {
    throw new ErrorValidacion(`Ya existe un elemento llamado "${nombre}" aquí`);
  }
  await cliente().send(new PutObjectCommand({ Bucket: bucket(), Key: `${ruta}/`, Body: "" }));
}

async function eliminarClaves(claves: string[]) {
  for (let i = 0; i < claves.length; i += 1000) {
    const lote = claves.slice(i, i + 1000);
    const respuesta = await cliente().send(
      new DeleteObjectsCommand({ Bucket: bucket(), Delete: { Objects: lote.map((Key) => ({ Key })), Quiet: true } })
    );
    if (respuesta.Errors?.length) {
      throw new Error(`No se pudieron borrar ${respuesta.Errors.length} objetos: ${respuesta.Errors[0].Message}`);
    }
  }
}

/** Elimina la carpeta y todo su contenido. */
export async function eliminarCarpeta(ruta: string): Promise<void> {
  if (!ruta) throw new ErrorValidacion("No se puede eliminar la raíz");
  await eliminarClaves(await listarClaves(`${ruta}/`));
}

/** Renombra una carpeta copiando cada objeto bajo el nuevo prefijo y borrando los originales. */
export async function renombrarCarpeta(ruta: string, nombreNuevoCrudo: unknown): Promise<void> {
  if (!ruta) throw new ErrorValidacion("No se puede renombrar la raíz");
  const nombreNuevo = validarNombre(nombreNuevoCrudo);
  const destino = unir(carpetaPadre(ruta), nombreNuevo);
  if (destino === ruta) return;
  if (destino.length > MAX_RUTA) throw new ErrorValidacion("La ruta es demasiado larga");
  if ((await existeCarpeta(destino)) || (await existeObjeto(destino))) {
    throw new ErrorValidacion(`Ya existe un elemento llamado "${nombreNuevo}" aquí`);
  }

  const origen = `${ruta}/`;
  const claves = await listarClaves(origen);
  if (claves.length === 0) throw new ErrorValidacion("La carpeta ya no existe");

  // Se copia primero todo y solo entonces se borra: si algo falla, no se pierde nada.
  for (const clave of claves) {
    await cliente().send(
      new CopyObjectCommand({
        Bucket: bucket(),
        Key: `${destino}/${clave.slice(origen.length)}`,
        CopySource: origenCopia(clave),
      })
    );
  }
  await eliminarClaves(claves);
}

// ---------------------------------------------------------------- archivos

export async function eliminarArchivo(ruta: string): Promise<void> {
  if (!ruta) throw new ErrorValidacion("Ruta inválida");
  await cliente().send(new DeleteObjectCommand({ Bucket: bucket(), Key: ruta }));
}

export async function renombrarArchivo(ruta: string, nombreNuevoCrudo: unknown): Promise<void> {
  if (!ruta) throw new ErrorValidacion("Ruta inválida");
  const nombreNuevo = validarNombre(nombreNuevoCrudo);
  const destino = unir(carpetaPadre(ruta), nombreNuevo);
  if (destino === ruta) return;
  if ((await existeObjeto(destino)) || (await existeCarpeta(destino))) {
    throw new ErrorValidacion(`Ya existe un elemento llamado "${nombreNuevo}" aquí`);
  }
  await cliente().send(new CopyObjectCommand({ Bucket: bucket(), Key: destino, CopySource: origenCopia(ruta) }));
  await cliente().send(new DeleteObjectCommand({ Bucket: bucket(), Key: ruta }));
}

/** URL temporal para que el navegador suba el archivo directo a R2, sin pasar por el servidor. */
export async function urlSubida(
  carpeta: string,
  nombreCrudo: unknown,
  tipoCrudo: unknown,
  tamano: unknown,
  sobrescribir: boolean
): Promise<{ url: string; ruta: string; tipo: string }> {
  const nombre = validarNombre(nombreCrudo);
  if (typeof tamano !== "number" || !Number.isInteger(tamano) || tamano < 0) {
    throw new ErrorValidacion("Tamaño de archivo inválido");
  }
  if (tamano > TAMANO_MAXIMO_ARCHIVO) {
    throw new ErrorValidacion(`"${nombre}" supera el máximo de ${TAMANO_MAXIMO_ARCHIVO / 1024 / 1024} MB`);
  }
  const ruta = unir(carpeta, nombre);
  if (ruta.length > MAX_RUTA) throw new ErrorValidacion("La ruta es demasiado larga");
  if (await existeCarpeta(ruta)) throw new ErrorValidacion(`Ya existe una carpeta llamada "${nombre}"`);
  if (!sobrescribir && (await existeObjeto(ruta))) {
    throw new ErrorValidacion(`Ya existe un archivo llamado "${nombre}"`);
  }

  const tipo = typeof tipoCrudo === "string" && tipoCrudo ? tipoCrudo.slice(0, 200) : "application/octet-stream";
  const url = await getSignedUrl(
    cliente(),
    new PutObjectCommand({ Bucket: bucket(), Key: ruta, ContentType: tipo, ContentLength: tamano }),
    { expiresIn: VIGENCIA_URL_SEG }
  );
  return { url, ruta, tipo };
}

/** URL temporal de descarga (fuerza "guardar como" con el nombre original). */
export async function urlDescarga(ruta: string): Promise<string> {
  if (!ruta) throw new ErrorValidacion("Ruta inválida");
  const nombre = ultimoSegmento(ruta);
  return getSignedUrl(
    cliente(),
    new GetObjectCommand({
      Bucket: bucket(),
      Key: ruta,
      ResponseContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(nombre)}`,
    }),
    { expiresIn: VIGENCIA_URL_SEG }
  );
}
