import type { ReactNode } from "react";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { cerrarSesionAccion } from "@/app/admin/login/actions";
import { Logo } from "@/components/Logo";
import { NavegacionAdmin } from "@/components/admin/NavegacionAdmin";

// Carcasa común de todos los módulos del panel. El login queda fuera de este
// grupo de rutas, así que no hereda la barra lateral.
export default async function LayoutPanel({ children }: { children: ReactNode }) {
  // El proxy ya filtra /admin; se valida de nuevo por defensa en profundidad.
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect("/admin/login");

  return (
    <div className="min-h-svh bg-lienzo lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="flex flex-col gap-4 border-b border-bruma-2 bg-white px-4 py-4 lg:sticky lg:top-0 lg:h-svh lg:border-r lg:border-b-0 lg:py-6">
        <Link href="/admin" className="flex items-center gap-2 px-2" aria-label="Inspira Nexum, panel">
          <Logo />
        </Link>
        <NavegacionAdmin />
        <div className="mt-auto hidden border-t border-bruma-2 pt-4 lg:block">
          <p className="truncate px-2 text-sm text-marino-2">{sesion.sub}</p>
          <form action={cerrarSesionAccion} className="mt-2">
            <button type="submit" className="boton boton-fantasma boton-chico w-full">
              Cerrar sesión
            </button>
          </form>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-5xl px-5 py-8 lg:px-10 lg:py-10">
        {children}
        <form action={cerrarSesionAccion} className="mt-10 lg:hidden">
          <button type="submit" className="boton boton-fantasma boton-chico">
            Cerrar sesión
          </button>
        </form>
      </main>
    </div>
  );
}
