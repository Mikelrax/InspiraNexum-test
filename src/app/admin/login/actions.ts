"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  credencialesValidas,
  intentosAgotados,
  limpiarIntentos,
  registrarIntentoFallido,
} from "@/lib/admin";
import { COOKIE_SESION, DURACION_SESION_SEG, crearToken } from "@/lib/sesion";

export type EstadoLogin = { error: string | null; email?: string };

// Solo se permiten rutas internas del panel para evitar redirecciones abiertas.
function destinoSeguro(valor: FormDataEntryValue | null): string {
  if (typeof valor === "string" && /^\/admin(?:[/?#]|$)/.test(valor) && !valor.startsWith("/admin/login")) {
    return valor;
  }
  return "/admin";
}

export async function iniciarSesionAccion(
  _estado: EstadoLogin,
  formData: FormData
): Promise<EstadoLogin> {
  const email = formData.get("email");
  const password = formData.get("password");
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return { error: "Ingresa tu correo y contraseña", email: typeof email === "string" ? email : undefined };
  }

  const cabeceras = await headers();
  const ip = cabeceras.get("x-forwarded-for")?.split(",")[0].trim() || "local";

  if (intentosAgotados(ip)) {
    return { error: "Demasiados intentos fallidos. Inténtalo de nuevo en 15 minutos", email };
  }

  if (!credencialesValidas(email, password)) {
    registrarIntentoFallido(ip);
    return { error: "Correo o contraseña incorrectos", email };
  }

  limpiarIntentos(ip);
  (await cookies()).set(COOKIE_SESION, await crearToken(email.trim().toLowerCase()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DURACION_SESION_SEG,
  });

  redirect(destinoSeguro(formData.get("next")));
}

export async function cerrarSesionAccion() {
  (await cookies()).delete(COOKIE_SESION);
  redirect("/admin/login");
}
