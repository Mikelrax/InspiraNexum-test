import type { CSSProperties } from "react";

// Retraso escalonado para animaciones de entrada: se lee como var(--retraso).
export const retraso = (ms: number) => ({ "--retraso": `${ms}ms` }) as CSSProperties;
