"use client";

import { useActionState } from "react";
import { inscribirseAccion, type EstadoInscripcion } from "./actions";

const estadoInicial: EstadoInscripcion = { error: null };

// Este componente se monta siempre (también cuando el enlace no admite registros) para que
// la confirmación sobreviva si el servidor vuelve a renderizar la página tras el último uso.
export function FormularioInscripcion({
  token,
  curso,
  bloqueo,
}: {
  token: string;
  curso: string | null;
  bloqueo: string | null;
}) {
  const [estado, accion, pendiente] = useActionState(inscribirseAccion.bind(null, token), estadoInicial);

  if (estado.curso) {
    return (
      <div role="status" className="text-center">
        <p className="inline-grid size-[52px] place-items-center rounded-full bg-turquesa-claro text-[1.6rem] font-bold text-turquesa">✓</p>
        <h2 className="my-2 text-[1.3rem]">¡Listo, quedaste registrado!</h2>
        <p className="text-marino-2">Ya formas parte de «{estado.curso}».</p>
      </div>
    );
  }

  if (bloqueo !== null) {
    return (
      <>
        <h1 className="text-[1.5rem]">No se puede registrar</h1>
        <p className="mt-2 mb-6 text-marino-2">{bloqueo}</p>
      </>
    );
  }

  return (
    <>
      <h1 className="text-[1.5rem]">{curso}</h1>
      <p className="mt-2 mb-6 text-marino-2">Escribe tu nombre para registrarte en este curso.</p>
      <form action={accion} className="grid gap-4">
        <label className="grid gap-1.5 text-[0.9rem]">
          <span className="font-semibold">Tu nombre</span>
          <input name="nombre" maxLength={120} autoComplete="name" placeholder="Nombre y apellido" required autoFocus className="campo" />
        </label>
        {estado.error && (
          <p role="alert" className="rounded-xl bg-bruma px-3 py-2.5 text-[0.9rem] text-magenta-osc">
            {estado.error}
          </p>
        )}
        <button type="submit" className="boton boton-primario w-full" disabled={pendiente}>
          {pendiente ? "Registrando..." : "Registrarme"}
        </button>
      </form>
    </>
  );
}
