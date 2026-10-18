import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { ErrorValidacion } from "@/lib/tareas";
import { almacenConfigurado, listarContenido, normalizarRuta, type Contenido } from "@/lib/almacen";
import { Explorador } from "./explorador";

export const metadata: Metadata = { title: "Archivos · Inspira Nexum" };
export const dynamic = "force-dynamic";

const href = (ruta: string) => (ruta ? `/admin/archivos?ruta=${encodeURIComponent(ruta)}` : "/admin/archivos");

export default async function PaginaArchivos({ searchParams }: { searchParams: Promise<{ ruta?: string }> }) {
  // El proxy ya filtra esta ruta; se valida de nuevo por defensa en profundidad.
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect("/admin/login");

  const { ruta: rutaCruda } = await searchParams;
  let ruta = "";
  try {
    ruta = normalizarRuta(rutaCruda);
  } catch (error) {
    if (!(error instanceof ErrorValidacion)) throw error;
    redirect("/admin/archivos");
  }

  const configurado = almacenConfigurado();
  let contenido: Contenido = { carpetas: [], archivos: [] };
  let errorAlmacen: string | null = null;
  if (configurado) {
    try {
      contenido = await listarContenido(ruta);
    } catch (error) {
      console.error(error);
      errorAlmacen = "No se pudo leer el almacenamiento. Revisa las credenciales y el nombre del bucket.";
    }
  }

  const segmentos = ruta ? ruta.split("/") : [];

  return (
    <>
      <Link href="/admin" className="text-[0.9rem] text-cacao-2 no-underline transition-colors hover:text-cacao">
        ← Panel administrativo
      </Link>
      <h1 className="mt-2 mb-4 text-3xl">Archivos</h1>

      {!configurado ? (
        <p className="rounded-xl border border-oro bg-oro-claro p-4 leading-relaxed">
          El almacenamiento aún no está configurado. Define <code>R2_ACCOUNT_ID</code>,{" "}
          <code>R2_ACCESS_KEY_ID</code>, <code>R2_SECRET_ACCESS_KEY</code> y <code>R2_BUCKET</code> en{" "}
          <code>.env.local</code> y reinicia el servidor.
        </p>
      ) : (
        <>
          <nav className="mb-3 text-cacao-2" aria-label="Ruta">
            <Link href={href("")} className="text-frambuesa no-underline hover:underline">
              Inicio
            </Link>
            {segmentos.map((segmento, i) => (
              <span key={i}>
                {" / "}
                {i === segmentos.length - 1 ? (
                  <strong className="text-cacao">{segmento}</strong>
                ) : (
                  <Link
                    href={href(segmentos.slice(0, i + 1).join("/"))}
                    className="text-frambuesa no-underline hover:underline"
                  >
                    {segmento}
                  </Link>
                )}
              </span>
            ))}
          </nav>
          {errorAlmacen ? (
            <p className="my-2 text-sm text-vino" role="alert">
              {errorAlmacen}
            </p>
          ) : (
            <Explorador
              key={ruta}
              carpetaActual={ruta}
              carpetas={contenido.carpetas}
              archivos={contenido.archivos}
            />
          )}
        </>
      )}
    </>
  );
}
