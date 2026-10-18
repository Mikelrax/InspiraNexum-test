"use client";

import { startTransition, useActionState, useState } from "react";
import { guardarAsistenciaAccion, type EstadoFormulario } from "../../../actions";

const estadoInicial: EstadoFormulario = { error: null };

type EstudianteFila = { id: number; nombre: string; presente: boolean };

export function AsistenciaForm({
  cursoId,
  claseId,
  estudiantes,
  yaTomada,
}: {
  cursoId: number;
  claseId: number;
  estudiantes: EstudianteFila[];
  yaTomada: boolean;
}) {
  const [estado, accion, pendiente] = useActionState(
    guardarAsistenciaAccion.bind(null, cursoId, claseId),
    estadoInicial
  );
  const [presentes, setPresentes] = useState(() => new Set(estudiantes.filter((e) => e.presente).map((e) => e.id)));
  // Tras guardar, "guardado" vuelve a false en cuanto se cambia algo.
  const [guardado, setGuardado] = useState(false);

  const cambiar = (siguiente: Set<number>) => {
    setPresentes(siguiente);
    setGuardado(false);
  };
  const alternar = (id: number) => {
    const siguiente = new Set(presentes);
    if (!siguiente.delete(id)) siguiente.add(id);
    cambiar(siguiente);
  };

  const mostrarGuardado = estado.ok && guardado;

  return (
    <form
      // Con `action` React reinicia el formulario al terminar y las casillas perderían su marca.
      onSubmit={(evento) => {
        evento.preventDefault();
        const datos = new FormData(evento.currentTarget);
        setGuardado(true);
        startTransition(() => accion(datos));
      }}
      className="grid gap-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="m-0 text-[0.95rem] text-marino-2" aria-live="polite">
          <strong className="text-turquesa">{presentes.size}</strong> asistieron ·{" "}
          <strong className="text-magenta-osc">{estudiantes.length - presentes.size}</strong> faltaron
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="boton boton-fantasma boton-chico whitespace-nowrap"
            onClick={() => cambiar(new Set(estudiantes.map((e) => e.id)))}
          >
            Marcar todos
          </button>
          <button
            type="button"
            className="boton boton-fantasma boton-chico whitespace-nowrap"
            onClick={() => cambiar(new Set())}
          >
            Desmarcar todos
          </button>
        </div>
      </div>

      <ul className="tarjeta m-0 list-none divide-y divide-bruma p-0">
        {estudiantes.map((estudiante) => {
          const presente = presentes.has(estudiante.id);
          return (
            <li key={estudiante.id}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-bruma/60">
                <input
                  type="checkbox"
                  name="presente"
                  value={estudiante.id}
                  checked={presente}
                  onChange={() => alternar(estudiante.id)}
                  className="size-5 shrink-0 cursor-pointer accent-turquesa"
                />
                <span className="flex-1 font-medium">{estudiante.nombre}</span>
                <span
                  className={
                    presente
                      ? "rounded-full bg-turquesa-claro px-2.5 py-0.5 text-[0.78rem] font-semibold text-turquesa"
                      : "rounded-full bg-bruma px-2.5 py-0.5 text-[0.78rem] font-semibold text-magenta-osc"
                  }
                >
                  {presente ? "Asistió" : "Faltó"}
                </span>
              </label>
            </li>
          );
        })}
        {estudiantes.length === 0 && (
          <li className="px-4 py-8 text-center text-marino-2">Este curso aún no tiene estudiantes.</li>
        )}
      </ul>

      {estado.error && (
        <p role="alert" className="m-0 rounded-lg bg-bruma px-3 py-2.5 text-[0.9rem] text-magenta-osc">
          {estado.error}
        </p>
      )}

      <div className="flex flex-wrap items-center justify-end gap-3">
        {mostrarGuardado && !pendiente && (
          <span role="status" className="text-[0.9rem] font-semibold text-turquesa">
            ✓ Asistencia guardada
          </span>
        )}
        <button
          type="submit"
          className="boton boton-primario boton-chico whitespace-nowrap disabled:cursor-progress"
          disabled={pendiente || estudiantes.length === 0}
        >
          {pendiente ? "Guardando..." : yaTomada ? "Actualizar asistencia" : "Guardar asistencia"}
        </button>
      </div>
    </form>
  );
}
