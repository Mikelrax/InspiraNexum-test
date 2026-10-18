import type { Metadata } from "next";
import { Logo } from "@/components/Logo";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Acceso administrativo · Inspira Nexum" };

export default async function LoginAdmin({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="grid min-h-screen grid-cols-[1fr_1fr] bg-crema max-[800px]:grid-cols-[1fr] max-[800px]:grid-rows-[140px_1fr]">
      <section className="flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[380px]">
          <div className="mb-6">
            <Logo />
          </div>
          <h1 className="text-[1.75rem]">Panel administrativo</h1>
          <p className="mt-1.5 mb-7 text-cacao-2">Ingresa tus credenciales para continuar.</p>
          <LoginForm destino={next ?? "/admin"} />
        </div>
      </section>

      <aside
        className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-coral),var(--color-frambuesa),var(--color-vino),var(--color-oro),var(--color-pino),var(--color-coral))] bg-[length:400%_400%] bg-center animate-[brillo-texto_9s_ease_infinite_alternate] max-[800px]:order-[-1]"
        aria-hidden="true"
      >
        <span className="absolute top-[8%] left-[10%] h-[340px] w-[340px] animate-[burbuja_14s_ease-in-out_infinite] rounded-full bg-white/[0.18] blur-[40px]" />
        <span className="absolute right-[8%] bottom-[12%] h-[260px] w-[260px] animate-[burbuja_11s_ease-in-out_infinite_reverse] rounded-full bg-white/[0.18] blur-[40px]" />
        <span className="absolute top-[55%] left-[40%] h-[180px] w-[180px] animate-[burbuja_17s_ease-in-out_infinite] rounded-full bg-white/[0.18] blur-[40px]" />
      </aside>
    </main>
  );
}
