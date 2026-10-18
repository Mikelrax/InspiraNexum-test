"use client";

import { useActionState } from "react";
import { crearTareaAccion, type EstadoFormulario } from "./actions";

const estadoInicial: EstadoFormulario = { error: null };

export function FormularioTarea() {
  const [estado, accion, pendiente] = useActionState(crearTareaAccion, estadoInicial);

  return (
    <form action={accion} className="mb-6 grid grid-cols-[1fr_1fr_auto] gap-2">
      <input
        name="titulo"
        placeholder="Título de la tarea"
        maxLength={200}
        required
        className="campo"
      />
      <input name="descripcion" placeholder="Descripción (opcional)" className="campo" />
      <button type="submit" disabled={pendiente} className="boton boton-primario boton-chico">
        {pendiente ? "Guardando..." : "Agregar"}
      </button>
      {estado.error && <p className="col-span-full text-frambuesa">{estado.error}</p>}
    </form>
  );
}
