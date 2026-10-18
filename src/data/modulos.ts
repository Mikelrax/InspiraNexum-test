// Registro único de módulos de la app. El panel (/admin), la navegación lateral
// y cualquier enlace cruzado leen de aquí: para añadir un módulo, se añade una entrada.

export type Modulo = {
  id: "educacion" | "archivos" | "tareas" | "branding" | "sitio";
  nombre: string;
  descripcion: string;
  href: string;
  // Color de acento (clases Tailwind completas para que el compilador las detecte).
  acento: { fondo: string; texto: string; borde: string };
  // "admin" requiere sesión; "publico" es accesible sin ella.
  zona: "admin" | "publico";
};

export const MODULOS: Modulo[] = [
  {
    id: "educacion",
    nombre: "Educación",
    descripcion: "Cursos, estudiantes y enlaces de registro",
    href: "/admin/educacion",
    acento: { fondo: "bg-bruma", texto: "text-magenta", borde: "hover:border-magenta" },
    zona: "admin",
  },
  {
    id: "archivos",
    nombre: "Archivos",
    descripcion: "Almacén de archivos y carpetas en Cloudflare R2",
    href: "/admin/archivos",
    acento: { fondo: "bg-turquesa-claro", texto: "text-turquesa", borde: "hover:border-turquesa" },
    zona: "admin",
  },
  {
    id: "tareas",
    nombre: "Tareas",
    descripcion: "Lista de pendientes del equipo",
    href: "/tareas",
    acento: { fondo: "bg-dorado-claro", texto: "text-marino", borde: "hover:border-dorado" },
    zona: "publico",
  },
  {
    id: "branding",
    nombre: "Manual de marca",
    descripcion: "Paleta, tipografía, logotipo y movimiento",
    href: "/branding",
    acento: { fondo: "bg-bruma-2", texto: "text-magenta-osc", borde: "hover:border-magenta-osc" },
    zona: "publico",
  },
  {
    id: "sitio",
    nombre: "Sitio web",
    descripcion: "Página pública de Inspira Nexum",
    href: "/",
    acento: { fondo: "bg-lienzo", texto: "text-celeste-osc", borde: "hover:border-celeste" },
    zona: "publico",
  },
];
