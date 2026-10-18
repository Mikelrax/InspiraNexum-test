"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type DragEvent, type FormEvent } from "react";
import type { Archivo, Carpeta } from "@/lib/almacen";
import {
  crearCarpetaAccion,
  descargarArchivoAccion,
  eliminarArchivoAccion,
  eliminarCarpetaAccion,
  prepararSubidaAccion,
  renombrarArchivoAccion,
  renombrarCarpetaAccion,
  subidaTerminadaAccion,
  type Resultado,
} from "./actions";

type Subida = { id: number; nombre: string; progreso: number; estado: "subiendo" | "listo" | "error"; error?: string };
type DialogoNombreEstado = {
  titulo: string;
  etiqueta: string;
  valorInicial: string;
  confirmar: string;
  enviar: (nombre: string) => Promise<Resultado>;
};

const href = (ruta: string) => (ruta ? `/admin/archivos?ruta=${encodeURIComponent(ruta)}` : "/admin/archivos");

const claseEnlace = "ml-3 cursor-pointer p-0 text-[0.9rem] text-frambuesa hover:underline";
const claseEnlacePeligro = "ml-3 cursor-pointer p-0 text-[0.9rem] text-vino hover:underline";
const claseCabecera = "border-b border-rubor-2 p-2 text-left text-[0.8rem] font-semibold uppercase text-cacao-2";
const claseCelda = "border-b border-rubor px-2 py-2.5 text-[0.95rem]";

function formatearTamano(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const unidades = ["KB", "MB", "GB"];
  let valor = bytes / 1024;
  let i = 0;
  while (valor >= 1024 && i < unidades.length - 1) {
    valor /= 1024;
    i++;
  }
  return `${valor.toFixed(valor < 10 ? 1 : 0)} ${unidades[i]}`;
}

function formatearFecha(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" });
}

/** Sube un archivo con PUT directo a la URL prefirmada de R2, informando el progreso. */
function subirConProgreso(url: string, archivo: File, tipo: string, onProgreso: (porcentaje: number) => void) {
  return new Promise<void>((resolver, rechazar) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", tipo);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgreso(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolver()
        : rechazar(new Error(`El almacenamiento rechazó la subida (${xhr.status})`));
    xhr.onerror = () =>
      rechazar(new Error("No se pudo conectar con el almacenamiento. Revisa la configuración CORS del bucket."));
    xhr.send(archivo);
  });
}

function DialogoNombre({ estado, onCerrar }: { estado: DialogoNombreEstado; onCerrar: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [nombre, setNombre] = useState(estado.valorInicial);
  const [error, setError] = useState<string | null>(null);
  const [pendiente, iniciar] = useTransition();

  useEffect(() => {
    const dialogo = ref.current;
    if (dialogo && !dialogo.open) dialogo.showModal();
  }, []);

  function enviar(evento: FormEvent) {
    evento.preventDefault();
    iniciar(async () => {
      const resultado = await estado.enviar(nombre);
      if (resultado.error) setError(resultado.error);
      else onCerrar();
    });
  }

  return (
    <dialog
      ref={ref}
      className="rounded-marca border-0 p-0 shadow-marca backdrop:bg-cacao-osc/40"
      onClose={onCerrar}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
    >
      <form className="w-[min(420px,90vw)] p-6" onSubmit={enviar}>
        <h2 className="mb-4 text-xl">{estado.titulo}</h2>
        <label className="flex flex-col gap-1.5">
          <span className="text-[0.9rem] font-semibold">{estado.etiqueta}</span>
          <input
            className="campo"
            autoFocus
            value={nombre}
            maxLength={200}
            onChange={(e) => setNombre(e.target.value)}
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
        {error && <p className="my-2 text-sm text-vino">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="boton boton-fantasma boton-chico" onClick={() => ref.current?.close()}>
            Cancelar
          </button>
          <button type="submit" className="boton boton-primario boton-chico" disabled={pendiente || !nombre.trim()}>
            {pendiente ? "Guardando…" : estado.confirmar}
          </button>
        </div>
      </form>
    </dialog>
  );
}

export function Explorador({
  carpetaActual,
  carpetas,
  archivos,
}: {
  carpetaActual: string;
  carpetas: Carpeta[];
  archivos: Archivo[];
}) {
  const [dialogo, setDialogo] = useState<DialogoNombreEstado | null>(null);
  const [subidas, setSubidas] = useState<Subida[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [arrastrando, setArrastrando] = useState(false);
  const [ocupado, iniciar] = useTransition();
  const entrada = useRef<HTMLInputElement>(null);
  const contador = useRef(0);

  const vacio = carpetas.length === 0 && archivos.length === 0;

  function ejecutar(trabajo: () => Promise<Resultado>) {
    setError(null);
    iniciar(async () => {
      const resultado = await trabajo();
      if (resultado.error) setError(resultado.error);
    });
  }

  function actualizarSubida(id: number, cambios: Partial<Subida>) {
    setSubidas((actuales) => actuales.map((s) => (s.id === id ? { ...s, ...cambios } : s)));
  }

  async function subirArchivos(lista: File[]) {
    setError(null);
    // Las carpetas arrastradas llegan como archivos vacíos sin tipo: no se pueden subir como archivo.
    const archivosValidos = lista.filter((f) => f.size > 0 || f.type !== "");
    const existentes = new Set(archivos.map((a) => a.nombre));

    await Promise.all(
      archivosValidos.map(async (archivo) => {
        const id = contador.current++;
        setSubidas((s) => [...s, { id, nombre: archivo.name, progreso: 0, estado: "subiendo" }]);

        if (existentes.has(archivo.name) && !window.confirm(`"${archivo.name}" ya existe. ¿Reemplazarlo?`)) {
          actualizarSubida(id, { estado: "error", error: "Cancelado: ya existe" });
          return;
        }

        try {
          const preparada = await prepararSubidaAccion(
            carpetaActual,
            archivo.name,
            archivo.type,
            archivo.size,
            existentes.has(archivo.name)
          );
          if (preparada.error !== null) throw new Error(preparada.error);
          await subirConProgreso(preparada.url, archivo, preparada.tipo, (progreso) =>
            actualizarSubida(id, { progreso })
          );
          actualizarSubida(id, { progreso: 100, estado: "listo" });
        } catch (e) {
          actualizarSubida(id, { estado: "error", error: e instanceof Error ? e.message : "Error al subir" });
        }
      })
    );
    await subidaTerminadaAccion();
  }

  async function descargar(ruta: string) {
    setError(null);
    const resultado = await descargarArchivoAccion(ruta);
    if (resultado.error !== null) setError(resultado.error);
    else window.location.assign(resultado.url);
  }

  function alSoltar(evento: DragEvent) {
    evento.preventDefault();
    setArrastrando(false);
    void subirArchivos(Array.from(evento.dataTransfer.files));
  }

  const enCurso = subidas.some((s) => s.estado === "subiendo");

  return (
    <div
      className={`rounded-xl border-2 border-dashed p-4 shadow-suave transition-colors duration-150 ${
        arrastrando ? "border-coral bg-rubor" : "border-transparent bg-white"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setArrastrando(true);
      }}
      onDragLeave={(e) => e.currentTarget === e.target && setArrastrando(false)}
      onDrop={alSoltar}
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          className="boton boton-fantasma boton-chico"
          onClick={() =>
            setDialogo({
              titulo: "Nueva carpeta",
              etiqueta: "Nombre de la carpeta",
              valorInicial: "",
              confirmar: "Crear",
              enviar: (nombre) => crearCarpetaAccion(carpetaActual, nombre),
            })
          }
        >
          Nueva carpeta
        </button>
        <button type="button" className="boton boton-primario boton-chico" onClick={() => entrada.current?.click()}>
          Subir archivos
        </button>
        <input
          ref={entrada}
          type="file"
          multiple
          hidden
          onChange={(e) => {
            void subirArchivos(Array.from(e.target.files ?? []));
            e.target.value = "";
          }}
        />
        {(ocupado || enCurso) && <span className="ml-auto text-sm text-cacao-2">Trabajando…</span>}
      </div>

      {error && (
        <p className="my-2 text-sm text-vino" role="alert">
          {error}
        </p>
      )}

      {subidas.length > 0 && (
        <ul className="mb-4 rounded-xl bg-crema p-3 accent-frambuesa">
          {subidas.map((s) => (
            <li key={s.id} className="flex items-center gap-3 py-1 text-sm">
              <span className="flex-[1_1_40%] truncate">{s.nombre}</span>
              {s.estado === "error" ? (
                <span className="text-vino">{s.error}</span>
              ) : (
                <progress className="flex-[1_1_40%]" value={s.progreso} max={100} />
              )}
              <span className="min-w-11 text-right text-cacao-2">
                {s.estado === "listo" ? "Listo" : s.estado === "subiendo" ? `${s.progreso}%` : ""}
              </span>
            </li>
          ))}
          {!enCurso && (
            <li className="flex items-center gap-3 py-1 text-sm">
              <button type="button" className={claseEnlace} onClick={() => setSubidas([])}>
                Limpiar lista
              </button>
            </li>
          )}
        </ul>
      )}

      {vacio ? (
        <p className="py-8 text-center text-cacao-2">
          Esta carpeta está vacía. Arrastra archivos aquí o usa «Subir archivos».
        </p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className={claseCabecera}>Nombre</th>
              <th className={claseCabecera}>Tamaño</th>
              <th className={claseCabecera}>Modificado</th>
              <th className={claseCabecera} aria-label="Acciones" />
            </tr>
          </thead>
          <tbody>
            {carpetas.map((c) => (
              <tr key={c.ruta} className="hover:bg-crema">
                <td className={claseCelda}>
                  <Link href={href(c.ruta)} className="font-semibold text-cacao no-underline hover:text-frambuesa">
                    📁 {c.nombre}
                  </Link>
                </td>
                <td className={claseCelda}>—</td>
                <td className={claseCelda}>—</td>
                <td className={`${claseCelda} whitespace-nowrap text-right`}>
                  <button
                    type="button"
                    className={claseEnlace}
                    onClick={() =>
                      setDialogo({
                        titulo: "Renombrar carpeta",
                        etiqueta: "Nuevo nombre",
                        valorInicial: c.nombre,
                        confirmar: "Renombrar",
                        enviar: (nombre) => renombrarCarpetaAccion(c.ruta, nombre),
                      })
                    }
                  >
                    Renombrar
                  </button>
                  <button
                    type="button"
                    className={claseEnlacePeligro}
                    onClick={() =>
                      window.confirm(`¿Eliminar la carpeta "${c.nombre}" y TODO su contenido? No se puede deshacer.`) &&
                      ejecutar(() => eliminarCarpetaAccion(c.ruta))
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {archivos.map((a) => (
              <tr key={a.ruta} className="hover:bg-crema">
                <td className={`${claseCelda} break-all`}>📄 {a.nombre}</td>
                <td className={claseCelda}>{formatearTamano(a.tamano)}</td>
                <td className={claseCelda}>{formatearFecha(a.modificado)}</td>
                <td className={`${claseCelda} whitespace-nowrap text-right`}>
                  <button type="button" className={claseEnlace} onClick={() => void descargar(a.ruta)}>
                    Descargar
                  </button>
                  <button
                    type="button"
                    className={claseEnlace}
                    onClick={() =>
                      setDialogo({
                        titulo: "Renombrar archivo",
                        etiqueta: "Nuevo nombre",
                        valorInicial: a.nombre,
                        confirmar: "Renombrar",
                        enviar: (nombre) => renombrarArchivoAccion(a.ruta, nombre),
                      })
                    }
                  >
                    Renombrar
                  </button>
                  <button
                    type="button"
                    className={claseEnlacePeligro}
                    onClick={() =>
                      window.confirm(`¿Eliminar "${a.nombre}"? No se puede deshacer.`) &&
                      ejecutar(() => eliminarArchivoAccion(a.ruta))
                    }
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {dialogo && <DialogoNombre estado={dialogo} onCerrar={() => setDialogo(null)} />}
    </div>
  );
}
