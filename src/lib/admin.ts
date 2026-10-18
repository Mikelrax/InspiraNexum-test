import { createHash, timingSafeEqual } from "node:crypto";

const INTENTOS_MAXIMOS = 5;
const VENTANA_MS = 15 * 60 * 1000;

const globalForLimite = globalThis as unknown as {
  intentosFallidos?: Map<string, { cantidad: number; reinicio: number }>;
};
const intentos = (globalForLimite.intentosFallidos ??= new Map());

// Se comparan hashes de longitud fija para que la comparación sea en tiempo constante.
function igual(a: string, b: string): boolean {
  const hash = (valor: string) => createHash("sha256").update(valor).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function credencialesValidas(email: string, password: string): boolean {
  const emailAdmin = process.env.ADMIN_EMAIL;
  const passwordAdmin = process.env.ADMIN_PASSWORD;
  if (!emailAdmin || !passwordAdmin) {
    console.error("ADMIN_EMAIL y ADMIN_PASSWORD deben estar definidos en el entorno");
    return false;
  }
  const emailOk = igual(email.trim().toLowerCase(), emailAdmin.trim().toLowerCase());
  const passwordOk = igual(password, passwordAdmin);
  return emailOk && passwordOk;
}

export function intentosAgotados(clave: string): boolean {
  const registro = intentos.get(clave);
  if (!registro) return false;
  if (registro.reinicio < Date.now()) {
    intentos.delete(clave);
    return false;
  }
  return registro.cantidad >= INTENTOS_MAXIMOS;
}

export function registrarIntentoFallido(clave: string) {
  const ahora = Date.now();
  const registro = intentos.get(clave);
  if (!registro || registro.reinicio < ahora) {
    intentos.set(clave, { cantidad: 1, reinicio: ahora + VENTANA_MS });
  } else {
    registro.cantidad++;
  }
}

export function limpiarIntentos(clave: string) {
  intentos.delete(clave);
}
