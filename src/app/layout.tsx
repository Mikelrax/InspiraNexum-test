import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Great_Vibes, Outfit } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--fuente-display",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--fuente-script",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--fuente-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inspira Nexum · Detalles que conectan | Arequipa",
  description:
    "Chocolatería D'Liriz, arreglos Compartiendo Amor y regalos Personalízate Arequipa: detalles hechos a mano para cada ocasión, con delivery en Arequipa.",
};

export const viewport: Viewport = {
  themeColor: "#fff7f2",
};

// Marca <html> antes del primer pintado para que las animaciones de entrada
// solo oculten contenido cuando JavaScript está disponible.
const scriptAnimaciones = `document.documentElement.classList.add("js")`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${fraunces.variable} ${greatVibes.variable} ${outfit.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: scriptAnimaciones }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
