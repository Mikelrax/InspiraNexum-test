import { createHash, timingSafeEqual } from "node:crypto";
import { crearLimitador } from "./limite";

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

const VENTANA_MS = 15 * 60 * 1000;
// Por IP se corta pronto; el límite de la cuenta es más alto pero no depende de la IP,
// así que falsificar x-forwarded-for no permite probar contraseñas sin fin.
const porIp = crearLimitador("login-ip", 5, VENTANA_MS);
const porCuenta = crearLimitador("login-cuenta", 20, VENTANA_MS);
const CUENTA = "admin";

export function intentosAgotados(ip: string): boolean {
  return porIp.agotado(ip) || porCuenta.agotado(CUENTA);
}

export function registrarIntentoFallido(ip: string) {
  porIp.registrar(ip);
  porCuenta.registrar(CUENTA);
}

export function limpiarIntentos(ip: string) {
  porIp.limpiar(ip);
  porCuenta.limpiar(CUENTA);
}
