import type { Metadata } from "next";
import { consultarEnlacePublico } from "@/lib/educacion";
import { Logo } from "@/components/Logo";
import { FormularioInscripcion } from "./formulario-inscripcion";

export const metadata: Metadata = {
  title: "Registro al curso · Inspira Nexum",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const MENSAJES = {
  invalido: "Este enlace no es válido. Pide uno nuevo a quien te lo compartió.",
  inactivo: "Este enlace está desactivado por ahora.",
  agotado: "Este enlace ya alcanzó su límite de registros.",
} as const;

export default async function PaginaUnirse({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const enlace = await consultarEnlacePublico(token);

  return (
    <div className="flex min-h-screen items-center justify-center bg-lienzo px-4 py-6">
      <main className="tarjeta w-full max-w-[400px] px-6 py-7">
        <div className="mb-5">
          <Logo />
        </div>
        <FormularioInscripcion
          token={token}
          curso={enlace.estado === "ok" ? enlace.curso.nombre : null}
          bloqueo={enlace.estado === "ok" ? null : MENSAJES[enlace.estado]}
        />
      </main>
    </div>
  );
}
