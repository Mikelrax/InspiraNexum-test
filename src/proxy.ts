import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_SESION, verificarToken } from "@/lib/sesion";

const RUTA_LOGIN = "/admin/login";

// Next.js 16 renombró "middleware" a "proxy": misma función, nuevo nombre de archivo.
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sesion = await verificarToken(request.cookies.get(COOKIE_SESION)?.value);
  const esLogin = pathname === RUTA_LOGIN;

  if (!sesion && !esLogin) {
    const destino = new URL(RUTA_LOGIN, request.url);
    destino.searchParams.set("next", pathname + search);
    return NextResponse.redirect(destino);
  }

  if (sesion && esLogin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
