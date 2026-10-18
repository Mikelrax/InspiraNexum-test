import type { Metadata } from "next";
import Link from "next/link";
import { cookies, headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import QRCode from "qrcode";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";
import { listarEstudiantes, obtenerCurso, obtenerEnlace } from "@/lib/educacion";
import { parsearId } from "@/lib/http";
import {
  cambiarEstadoEnlaceAccion,
  eliminarEstudianteAccion,
  rotarEnlaceAccion,
} from "../actions";
import { BotonAccion, CopiarEnlace } from "../controles";
import { FormularioEnlace, FormularioEstudiante } from "../formularios";
import { BotonModal } from "../modal";

export const metadata: Metadata = { title: "Curso · Inspira Nexum" };
export const dynamic = "force-dynamic";

const cabecera =
  "border-b border-bruma bg-lienzo px-4 py-3 text-left align-middle text-[0.78rem] font-semibold tracking-[0.04em] text-marino-2 uppercase";
const celda = "border-b border-bruma px-4 py-3 text-left align-middle";
const celdaVacia = "px-4 py-8 text-center align-middle text-marino-2";

// APP_URL permite fijar el dominio público; sin él se deduce de la petición.
async function origenPublico(): Promise<string> {
  if (process.env.APP_URL) return process.env.APP_URL.replace(/\/+$/, "");
  const cabeceras = await headers();
  const host = cabeceras.get("x-forwarded-host") ?? cabeceras.get("host") ?? "localhost:3000";
  const protocolo =
    cabeceras.get("x-forwarded-proto") ?? (/^(localhost|127\.0\.0\.1)/.test(host) ? "http" : "https");
  return `${protocolo}://${host}`;
}

export default async function PaginaCurso({ params }: { params: Promise<{ id: string }> }) {
  const sesion = await verificarToken((await cookies()).get(COOKIE_SESION)?.value);
  if (!sesion) redirect("/admin/login");

  const id = parsearId((await params).id);
  const curso = id === null ? null : await obtenerCurso(id);
  if (!curso) notFound();

  const [estudiantes, enlace] = await Promise.all([
    listarEstudiantes(curso.id),
    obtenerEnlace(curso.id),
  ]);

  const url = enlace ? `${await origenPublico()}/unirse/${enlace.token}` : null;
  const qr = url
    ? await QRCode.toDataURL(url, { width: 360, margin: 1, errorCorrectionLevel: "M" })
    : null;
  const agotado = enlace !== null && enlace.maxUsos !== null && enlace.usos >= enlace.maxUsos;

  return (
    <div className="grid gap-5">
      <nav>
        <Link
          href="/admin/educacion"
          className="text-[0.9rem] text-marino-2 no-underline transition-colors hover:text-magenta"
        >
          ← Educación
        </Link>
      </nav>

      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[1.75rem]">{curso.nombre}</h1>
          <p className="mt-1 text-marino-2">
            {curso.instructor ? `${curso.instructor} · ` : ""}
            {estudiantes.length} {estudiantes.length === 1 ? "estudiante" : "estudiantes"}
          </p>
          {curso.descripcion && <p className="mt-2 max-w-[60ch]">{curso.descripcion}</p>}
        </div>
        <BotonModal etiqueta="Agregar estudiante" titulo="Agregar estudiante">
          <FormularioEstudiante cursoId={curso.id} />
        </BotonModal>
      </header>

      <section className="tarjeta p-5">
        <div className="mb-3.5 flex items-center justify-between gap-3">
          <h2 className="text-[1.1rem]">Enlace de registro</h2>
          <BotonModal
            etiqueta={enlace ? "Reconfigurar" : "Generar enlace"}
            titulo="Enlace de registro"
            variante={enlace ? "secundario" : "primario"}
          >
            <FormularioEnlace cursoId={curso.id} maxUsosActual={enlace?.maxUsos ?? null} />
          </BotonModal>
        </div>

        {enlace && url && qr ? (
          <div className="flex flex-wrap items-start gap-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr}
              width={180}
              height={180}
              alt="Código QR del enlace de registro"
              className="rounded-lg border border-bruma-2 bg-white p-1.5"
            />
            <div className="grid min-w-[260px] flex-1 gap-3">
              <p>
                <span
                  className={
                    enlace.activo && !agotado
                      ? "inline-block rounded-full bg-turquesa-claro px-2.5 py-0.5 text-[0.78rem] font-semibold text-turquesa"
                      : "inline-block rounded-full bg-bruma px-2.5 py-0.5 text-[0.78rem] font-semibold text-magenta-osc"
                  }
                >
                  {!enlace.activo ? "Desactivado" : agotado ? "Límite alcanzado" : "Activo"}
                </span>{" "}
                <strong>{enlace.usos}</strong> de {enlace.maxUsos ?? "∞"} usos
              </p>
              <CopiarEnlace url={url} />
              <div className="flex flex-wrap justify-start gap-2">
                <BotonAccion
                  accion={rotarEnlaceAccion.bind(null, curso.id)}
                  confirmar="Se generará un enlace nuevo: el enlace y el QR actuales dejarán de funcionar. ¿Continuar?"
                >
                  Rotar enlace
                </BotonAccion>
                <BotonAccion accion={cambiarEstadoEnlaceAccion.bind(null, curso.id, !enlace.activo)}>
                  {enlace.activo ? "Desactivar" : "Activar"}
                </BotonAccion>
              </div>
            </div>
          </div>
        ) : (
          <p className="m-0 text-[0.9rem] text-marino-2">
            Genera un enlace con código QR para que los estudiantes se registren solos. Puedes limitar
            cuántas veces se puede usar o dejarlo ilimitado.
          </p>
        )}
      </section>

      <div className="tarjeta overflow-x-auto">
        <table className="w-full border-collapse text-[0.93rem]">
          <thead>
            <tr>
              <th className={cabecera}>Estudiante</th>
              <th className={cabecera}>Registro</th>
              <th className={cabecera}>Fecha</th>
              <th aria-label="Acciones" className={cabecera} />
            </tr>
          </thead>
          <tbody className="[&>tr:last-child>td]:border-b-0">
            {estudiantes.map((estudiante) => (
              <tr key={estudiante.id}>
                <td className={celda}>{estudiante.nombre}</td>
                <td className={celda}>{estudiante.origen === "enlace" ? "Enlace" : "Manual"}</td>
                <td className={celda}>{estudiante.creadoEn}</td>
                <td className={celda}>
                  <div className="flex justify-end gap-2">
                    <BotonAccion
                      accion={eliminarEstudianteAccion.bind(null, curso.id, estudiante.id)}
                      confirmar={`¿Quitar a ${estudiante.nombre} del curso?`}
                      peligro
                    >
                      Quitar
                    </BotonAccion>
                  </div>
                </td>
              </tr>
            ))}
            {estudiantes.length === 0 && (
              <tr>
                <td colSpan={4} className={celdaVacia}>
                  Sin estudiantes todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
