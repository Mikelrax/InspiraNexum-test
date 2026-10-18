"use client";

import { useActionState } from "react";
import { iniciarSesionAccion, type EstadoLogin } from "./actions";

const estadoInicial: EstadoLogin = { error: null };

export function LoginForm({ destino }: { destino: string }) {
  const [estado, accion, pendiente] = useActionState(iniciarSesionAccion, estadoInicial);

  return (
    <form action={accion} className="grid gap-4">
      <input type="hidden" name="next" value={destino} />

      <label className="grid gap-1.5 text-[0.9rem]">
        <span className="font-semibold">Correo electrónico</span>
        <input type="email" name="email" defaultValue={estado.email} autoComplete="username" placeholder="admin@empresa.com" required autoFocus className="campo" />
      </label>

      <label className="grid gap-1.5 text-[0.9rem]">
        <span className="font-semibold">Contraseña</span>
        <input type="password" name="password" autoComplete="current-password" placeholder="••••••••" required className="campo" />
      </label>

      {estado.error && (
        <p role="alert" className="rounded-xl bg-bruma px-3 py-2.5 text-[0.9rem] text-magenta-osc">
          {estado.error}
        </p>
      )}

      <button type="submit" className="boton boton-primario w-full" disabled={pendiente}>
        {pendiente ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
