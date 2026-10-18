// Sesión firmada con HMAC-SHA256 usando Web Crypto, para que funcione tanto
// en el proxy como en el servidor de Node sin dependencias externas.

export const COOKIE_SESION = "admin_session";
export const DURACION_SESION_SEG = 60 * 60 * 8;

export type CargaSesion = { sub: string; exp: number };

const encoder = new TextEncoder();

function obtenerSecreto(): string {
  const secreto = process.env.AUTH_SECRET;
  if (secreto && secreto.length >= 32) return secreto;
  throw new Error("AUTH_SECRET no está definido o tiene menos de 32 caracteres");
}

function aBase64Url(bytes: Uint8Array): string {
  let binario = "";
  for (const byte of bytes) binario += String.fromCharCode(byte);
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function desdeBase64Url(texto: string): Uint8Array<ArrayBuffer> {
  const base64 = texto.replace(/-/g, "+").replace(/_/g, "/");
  const binario = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, "="));
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
  return bytes;
}

function importarClave(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(obtenerSecreto()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function crearToken(sub: string): Promise<string> {
  const carga: CargaSesion = { sub, exp: Math.floor(Date.now() / 1000) + DURACION_SESION_SEG };
  const cuerpo = aBase64Url(encoder.encode(JSON.stringify(carga)));
  const firma = await crypto.subtle.sign("HMAC", await importarClave(), encoder.encode(cuerpo));
  return `${cuerpo}.${aBase64Url(new Uint8Array(firma))}`;
}

export async function verificarToken(token: string | undefined): Promise<CargaSesion | null> {
  if (!token) return null;
  const [cuerpo, firma, ...resto] = token.split(".");
  if (!cuerpo || !firma || resto.length > 0) return null;

  try {
    const valida = await crypto.subtle.verify(
      "HMAC",
      await importarClave(),
      desdeBase64Url(firma),
      encoder.encode(cuerpo)
    );
    if (!valida) return null;

    const carga = JSON.parse(new TextDecoder().decode(desdeBase64Url(cuerpo))) as CargaSesion;
    if (typeof carga.sub !== "string" || typeof carga.exp !== "number") return null;
    return carga.exp > Date.now() / 1000 ? carga : null;
  } catch {
    return null;
  }
}
