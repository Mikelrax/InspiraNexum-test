// Limitador de intentos en memoria (una instancia del servidor). Sirve para frenar
// fuerza bruta y registros automáticos sin depender de servicios externos.

type Registro = { cantidad: number; reinicio: number };

const MAX_CLAVES = 5000;

const globalParaLimites = globalThis as unknown as { limitesEnMemoria?: Map<string, Map<string, Registro>> };
const limites = (globalParaLimites.limitesEnMemoria ??= new Map());

export type Limitador = {
  /** true si la clave ya agotó sus intentos en la ventana actual. */
  agotado(clave: string): boolean;
  /** Suma un intento a la clave. */
  registrar(clave: string): void;
  /** Suma un intento y devuelve true si con él se supera el máximo. */
  consumir(clave: string): boolean;
  limpiar(clave: string): void;
};

export function crearLimitador(nombre: string, maximo: number, ventanaMs: number): Limitador {
  let registros = limites.get(nombre);
  if (!registros) {
    registros = new Map<string, Registro>();
    limites.set(nombre, registros);
  }
  const mapa = registros;

  // Evita que claves inventadas (p. ej. IPs falsas) hagan crecer el mapa sin fin.
  const podar = (ahora: number) => {
    if (mapa.size < MAX_CLAVES) return;
    for (const [clave, registro] of mapa) if (registro.reinicio < ahora) mapa.delete(clave);
    if (mapa.size >= MAX_CLAVES) mapa.delete(mapa.keys().next().value!);
  };

  const vigente = (clave: string, ahora: number) => {
    const registro = mapa.get(clave);
    if (registro && registro.reinicio < ahora) {
      mapa.delete(clave);
      return undefined;
    }
    return registro;
  };

  const registrar = (clave: string) => {
    const ahora = Date.now();
    const registro = vigente(clave, ahora);
    if (registro) {
      registro.cantidad++;
      return registro.cantidad;
    }
    podar(ahora);
    mapa.set(clave, { cantidad: 1, reinicio: ahora + ventanaMs });
    return 1;
  };

  return {
    agotado: (clave) => (vigente(clave, Date.now())?.cantidad ?? 0) >= maximo,
    registrar: (clave) => void registrar(clave),
    consumir: (clave) => registrar(clave) > maximo,
    limpiar: (clave) => void mapa.delete(clave),
  };
}

/**
 * IP del cliente según las cabeceras del proxy. x-real-ip la fija el proxy de confianza
 * (Vercel, nginx); x-forwarded-for puede traer valores inventados por el cliente, por eso
 * los límites sensibles no deben depender solo de ella.
 */
export function ipCliente(cabeceras: Headers): string {
  return (
    cabeceras.get("x-real-ip")?.trim() ||
    cabeceras.get("x-forwarded-for")?.split(",")[0].trim() ||
    "local"
  );
}
