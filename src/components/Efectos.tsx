"use client";

import { useEffect, useRef, useState, type PointerEvent as EventoPuntero, type ReactNode } from "react";

// Observa todos los elementos con [data-reveal] y les añade data-visible
// cuando entran en pantalla. Un solo observer para toda la página.
export function AnimacionesScroll() {
  useEffect(() => {
    const elementos = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) {
            (entrada.target as HTMLElement).dataset.visible = "";
            observer.unobserve(entrada.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}

// Mueve capas con [data-profundidad] siguiendo el puntero (efecto parallax).
export function Parallax({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const contenedor = ref.current;
    if (!contenedor || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const mover = (evento: PointerEvent) => {
      const caja = contenedor.getBoundingClientRect();
      const x = (evento.clientX - caja.left) / caja.width - 0.5;
      const y = (evento.clientY - caja.top) / caja.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        contenedor.style.setProperty("--px", x.toFixed(3));
        contenedor.style.setProperty("--py", y.toFixed(3));
      });
    };
    const reiniciar = () => {
      contenedor.style.setProperty("--px", "0");
      contenedor.style.setProperty("--py", "0");
    };
    window.addEventListener("pointermove", mover);
    document.addEventListener("pointerleave", reiniciar);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerleave", reiniciar);
    };
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

// Tarjeta que se inclina en 3D hacia el puntero y proyecta un brillo.
export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const mover = (evento: EventoPuntero<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || evento.pointerType !== "mouse") return;
    const caja = el.getBoundingClientRect();
    const x = (evento.clientX - caja.left) / caja.width;
    const y = (evento.clientY - caja.top) / caja.height;
    el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  };

  const salir = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <div ref={ref} className={`tilt ${className ?? ""}`} onPointerMove={mover} onPointerLeave={salir}>
      {children}
    </div>
  );
}

// Cuenta de 0 al valor final cuando el número entra en pantalla.
export function Contador({ hasta, sufijo = "" }: { hasta: number; sufijo?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [valor, setValor] = useState(hasta);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setValor(0);
    let frame = 0;
    const observer = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return;
      observer.disconnect();
      const inicio = performance.now();
      const paso = (ahora: number) => {
        const t = Math.min(1, (ahora - inicio) / 1400);
        setValor(Math.round(hasta * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(paso);
      };
      frame = requestAnimationFrame(paso);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [hasta]);

  return (
    <span ref={ref}>
      {valor}
      {sufijo}
    </span>
  );
}
