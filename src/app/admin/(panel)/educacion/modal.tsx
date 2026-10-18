"use client";

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";

const ContextoModal = createContext<() => void>(() => {});

/** Los formularios dentro de un BotonModal usan esto para cerrarlo al terminar. */
export const useCerrarModal = () => useContext(ContextoModal);

function Dialogo({ titulo, onCerrar, children }: { titulo: string; onCerrar: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialogo = ref.current;
    if (dialogo && !dialogo.open) dialogo.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="m-auto w-[min(440px,calc(100vw-32px))] rounded-2xl border-0 bg-white p-0 font-body text-tinta shadow-marca backdrop:bg-marino-osc/50"
      onClose={onCerrar}
      onClick={(evento) => {
        // Un clic directo sobre el <dialog> (no sobre su contenido) es un clic en el fondo.
        if (evento.target === ref.current) ref.current?.close();
      }}
    >
      <div className="grid gap-4 p-[22px]">
        <div className="flex items-center justify-between">
          <h2 className="text-[1.2rem]">{titulo}</h2>
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent text-[1.6rem] leading-none text-marino-2 transition-colors hover:text-magenta"
            onClick={() => ref.current?.close()}
            aria-label="Cerrar"
          >
            ×
          </button>
        </div>
        <ContextoModal.Provider value={() => ref.current?.close()}>{children}</ContextoModal.Provider>
      </div>
    </dialog>
  );
}

/** Botón que abre un modal. El contenido solo se monta mientras está abierto, así los formularios nacen limpios. */
export function BotonModal({
  etiqueta,
  titulo,
  variante = "primario",
  children,
}: {
  etiqueta: string;
  titulo: string;
  variante?: "primario" | "secundario";
  children: ReactNode;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <>
      <button
        type="button"
        className={
          variante === "primario"
            ? "boton boton-primario boton-chico whitespace-nowrap"
            : "boton boton-fantasma boton-chico whitespace-nowrap"
        }
        onClick={() => setAbierto(true)}
      >
        {etiqueta}
      </button>
      {abierto && (
        <Dialogo titulo={titulo} onCerrar={() => setAbierto(false)}>
          {children}
        </Dialogo>
      )}
    </>
  );
}
