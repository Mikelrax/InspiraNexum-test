"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MODULOS } from "@/data/modulos";

// Navegación del panel: resalta el módulo activo según la ruta.
export function NavegacionAdmin() {
  const ruta = usePathname();
  const activo = (href: string) => (href === "/admin" ? ruta === href : ruta.startsWith(href));

  const enlace = (href: string, texto: string) => (
    <Link
      key={href}
      href={href}
      aria-current={activo(href) ? "page" : undefined}
      className="whitespace-nowrap rounded-xl px-3.5 py-2 text-[0.95rem] font-medium text-marino-2 transition-colors hover:bg-bruma aria-[current=page]:bg-bruma aria-[current=page]:font-semibold aria-[current=page]:text-magenta"
    >
      {texto}
    </Link>
  );

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col" aria-label="Módulos">
      {enlace("/admin", "Dashboard")}
      {MODULOS.filter((m) => m.zona === "admin").map((m) => enlace(m.href, m.nombre))}
      <p className="mt-4 hidden px-3.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-marino-2/70 lg:block">
        Enlaces
      </p>
      {MODULOS.filter((m) => m.zona === "publico").map((m) => (
        <Link
          key={m.href}
          href={m.href}
          className="whitespace-nowrap rounded-xl px-3.5 py-2 text-[0.95rem] text-marino-2 transition-colors hover:bg-bruma"
        >
          {m.nombre} <span aria-hidden="true">↗</span>
        </Link>
      ))}
    </nav>
  );
}
