import { listarTareas } from "@/lib/tareas";
import { alternarTareaAccion, eliminarTareaAccion } from "./actions";
import { FormularioTarea } from "./formulario-tarea";

export const dynamic = "force-dynamic";

export default async function Inicio() {
  const tareas = await listarTareas();
  const pendientes = tareas.filter((tarea) => !tarea.completada).length;

  return (
    <div className="min-h-screen bg-crema text-cacao">
      <main className="mx-auto max-w-2xl px-4 py-12">
        <header>
          <h1 className="text-[2rem]">Inspira Nexum</h1>
          <p className="mt-1 mb-6 text-cacao-2">
            {tareas.length} tareas · {pendientes} pendientes · SQLite en memoria
          </p>
        </header>

        <FormularioTarea />

        <ul className="m-0 grid list-none gap-2 p-0">
          {tareas.map((tarea) => (
            <li
              key={tarea.id}
              className="tarjeta flex items-center gap-3 px-4 py-3"
            >
              <form action={alternarTareaAccion.bind(null, tarea.id)}>
                <button
                  type="submit"
                  className="h-6 w-6 rounded-md border-2 border-frambuesa bg-white font-bold text-frambuesa"
                  aria-label="Alternar estado"
                >
                  {tarea.completada ? "✓" : ""}
                </button>
              </form>
              <div className="flex flex-1 flex-col">
                <strong
                  className={tarea.completada ? "text-cacao-2 line-through" : ""}
                >
                  {tarea.titulo}
                </strong>
                {tarea.descripcion && (
                  <span className="text-[0.9rem] text-cacao-2">
                    {tarea.descripcion}
                  </span>
                )}
              </div>
              <form action={eliminarTareaAccion.bind(null, tarea.id)}>
                <button
                  type="submit"
                  className="border-0 bg-transparent text-[1.4rem] text-vino hover:text-frambuesa"
                  aria-label="Eliminar tarea"
                >
                  ×
                </button>
              </form>
            </li>
          ))}
          {tareas.length === 0 && (
            <li className="p-6 text-center text-cacao-2">
              No hay tareas todavía
            </li>
          )}
        </ul>
      </main>
    </div>
  );
}
