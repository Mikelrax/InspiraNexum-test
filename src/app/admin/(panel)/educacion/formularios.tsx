"use client";

import { useActionState, useEffect, useState } from "react";
import {
  agregarEstudianteAccion,
  configurarEnlaceAccion,
  crearCursoAccion,
  type EstadoFormulario,
} from "./actions";
import { useCerrarModal } from "./modal";

const estadoInicial: EstadoFormulario = { error: null };

function useCerrarAlTerminar(estado: EstadoFormulario) {
  const cerrar = useCerrarModal();
  useEffect(() => {
    if (estado.ok) cerrar();
  }, [estado, cerrar]);
}

function Pie({ estado, pendiente, texto }: { estado: EstadoFormulario; pendiente: boolean; texto: string }) {
  const cerrar = useCerrarModal();
  return (
    <>
      {estado.error && (
        <p role="alert" className="m-0 rounded-lg bg-bruma px-3 py-2.5 text-[0.9rem] text-magenta-osc">
          {estado.error}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" className="boton boton-fantasma boton-chico whitespace-nowrap" onClick={cerrar}>
          Cancelar
        </button>
        <button
          type="submit"
          className="boton boton-primario boton-chico whitespace-nowrap disabled:cursor-progress"
          disabled={pendiente}
        >
          {pendiente ? "Guardando..." : texto}
        </button>
      </div>
    </>
  );
}

export function FormularioCurso() {
  const [estado, accion, pendiente] = useActionState(crearCursoAccion, estadoInicial);
  useCerrarAlTerminar(estado);

  return (
    <form action={accion} className="grid gap-3.5">
      <label className="grid gap-1.5 text-[0.9rem]">
        <span className="font-semibold">Nombre del curso</span>
        <input className="campo" name="nombre" maxLength={150} placeholder="Ej. Introducción a la repostería" required autoFocus />
      </label>
      <label className="grid gap-1.5 text-[0.9rem]">
        <span className="font-semibold">Instructor (opcional)</span>
        <input className="campo" name="instructor" maxLength={120} />
      </label>
      <label className="grid gap-1.5 text-[0.9rem]">
        <span className="font-semibold">Descripción (opcional)</span>
        <textarea className="campo resize-y" name="descripcion" rows={3} maxLength={1000} />
      </label>
      <Pie estado={estado} pendiente={pendiente} texto="Crear curso" />
    </form>
  );
}

export function FormularioEstudiante({ cursoId }: { cursoId: number }) {
  const [estado, accion, pendiente] = useActionState(
    agregarEstudianteAccion.bind(null, cursoId),
    estadoInicial
  );
  useCerrarAlTerminar(estado);

  return (
    <form action={accion} className="grid gap-3.5">
      <label className="grid gap-1.5 text-[0.9rem]">
        <span className="font-semibold">Nombre del estudiante</span>
        <input className="campo" name="nombre" maxLength={120} autoComplete="off" required autoFocus />
      </label>
      <Pie estado={estado} pendiente={pendiente} texto="Registrar" />
    </form>
  );
}

export function FormularioEnlace({ cursoId, maxUsosActual }: { cursoId: number; maxUsosActual: number | null }) {
  const [estado, accion, pendiente] = useActionState(
    configurarEnlaceAccion.bind(null, cursoId),
    estadoInicial
  );
  const [modo, setModo] = useState<"ilimitado" | "limitado">(maxUsosActual === null ? "ilimitado" : "limitado");
  useCerrarAlTerminar(estado);

  return (
    <form action={accion} className="grid gap-3.5">
      <fieldset className="m-0 grid gap-2 border-0 p-0">
        <label className="flex items-center gap-2 text-[0.95rem]">
          <input
            type="radio"
            className="accent-magenta"
            name="modo"
            value="ilimitado"
            checked={modo === "ilimitado"}
            onChange={() => setModo("ilimitado")}
          />
          Usos ilimitados
        </label>
        <label className="flex items-center gap-2 text-[0.95rem]">
          <input
            type="radio"
            className="accent-magenta"
            name="modo"
            value="limitado"
            checked={modo === "limitado"}
            onChange={() => setModo("limitado")}
          />
          Limitar el número de usos
        </label>
      </fieldset>
      {modo === "limitado" && (
        <label className="grid gap-1.5 text-[0.9rem]">
          <span className="font-semibold">Cantidad máxima de registros</span>
          <input
            className="campo"
            type="number"
            name="maxUsos"
            min={1}
            max={100000}
            defaultValue={maxUsosActual ?? 10}
            required
            autoFocus
          />
        </label>
      )}
      <p className="m-0 text-[0.9rem] text-marino-2">Se genera un enlace nuevo y el contador de usos vuelve a cero.</p>
      <Pie estado={estado} pendiente={pendiente} texto="Generar enlace" />
    </form>
  );
}
