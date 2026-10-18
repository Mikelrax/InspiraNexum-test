// Datos editables de la landing. Cambia aquí números, redes y catálogo
// sin tocar los componentes.

// TODO: reemplazar por el número real (formato internacional, sin "+" ni espacios).
export const WHATSAPP = "51900000000";

export const REDES = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  tiktok: "https://www.tiktok.com/",
};

export function enlaceWhatsApp(mensaje: string) {
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
}

export type Marca = {
  id: "dliriz" | "compartiendo-amor" | "personalizate";
  nombre: string;
  lema: string;
  descripcion: string;
  etiquetas: string[];
  imagen: string;
};

export const MARCAS: Marca[] = [
  {
    id: "dliriz",
    nombre: "D'Liriz",
    lema: "Arte y pasión a tu servicio",
    descripcion:
      "Chocolatería artesanal, bombones pintados a mano, queques saludables y bocaditos dulces y salados para cada celebración.",
    etiquetas: ["Chocolatería", "Bombones", "Bocaditos"],
    imagen: "/img/dliriz-bombones.jpg",
  },
  {
    id: "compartiendo-amor",
    nombre: "Compartiendo Amor",
    lema: "Detalles que abrazan",
    descripcion:
      "Arreglos con rosas y peluches, box de golosinas temáticas y globos para sorprender en cada fecha especial.",
    etiquetas: ["Arreglos", "Box temáticos", "Globos"],
    imagen: "/img/arreglo-amor.jpg",
  },
  {
    id: "personalizate",
    nombre: "Personalízate Arequipa",
    lema: "Tu nombre, tu marca, tu estilo",
    descripcion:
      "Cajas premium corporativas con tu logotipo, tazas, esferas y detalles con nombre para regalar con identidad propia.",
    etiquetas: ["Corporativo", "Tazas", "Con logotipo"],
    imagen: "/img/caja-corporativa.jpg",
  },
];

export const CATEGORIAS_DLIRIZ = [
  {
    nombre: "Chocolatería",
    texto: "Tabletas, fondues y chocolate para regalar o derretir de placer.",
    imagen: "/img/dliriz-chocolateria.jpg",
  },
  {
    nombre: "Bombones",
    texto: "Bombones de colores, rellenos y pintados a mano, uno por uno.",
    imagen: "/img/dliriz-bombones.jpg",
  },
  {
    nombre: "Queques saludables",
    texto: "Queques con frutos y harinas nobles: rico sin culpa.",
    imagen: "/img/dliriz-queques.jpg",
  },
  {
    nombre: "Bocaditos dulces y salados",
    texto: "Alfajores, mini postres y piqueos para tus eventos.",
    imagen: "/img/dliriz-bocaditos.jpg",
  },
  {
    nombre: "Bocaditos temáticos",
    texto: "Donas y dulces decorados para baby showers y cumpleaños.",
    imagen: "/img/dliriz-tematicos.jpg",
  },
];

export const PRODUCTOS_AMOR = [
  {
    nombre: "Arreglos con rosas y peluche",
    texto: "Rosas eternas, peluche y topper con dedicatoria.",
    icono: "🌹",
  },
  {
    nombre: "Box de golosinas temáticas",
    texto: "Cajas grabadas llenas de snacks, según la fecha o el gusto.",
    icono: "🍬",
  },
  {
    nombre: "Arreglos con globos",
    texto: "Globos metálicos y de látex que convierten un detalle en fiesta.",
    icono: "🎈",
  },
  {
    nombre: "Sorpresas a domicilio",
    texto: "Lo llevamos a su puerta en Arequipa con tu mensaje.",
    icono: "💌",
  },
];

export const PRODUCTOS_PERSONALIZATE = [
  { nombre: "Cajas premium corporativas", texto: "Kits con tu logotipo para clientes y colaboradores." },
  { nombre: "Tazas personalizadas", texto: "Con nombre, foto o frase; a todo color." },
  { nombre: "Esferas y adornos con nombre", texto: "Para el árbol, el escritorio o la mesa de regalos." },
  { nombre: "Tarjetas y dedicatorias", texto: "Mensajes impresos que completan el regalo." },
];

export type Ocasion = {
  nombre: string;
  // "fija": misma fecha cada año. "domingo": n-ésimo domingo del mes. null: todo el año.
  fecha: { tipo: "fija"; mes: number; dia: number } | { tipo: "domingo"; mes: number; n: number } | null;
  icono: string;
  sugerencia: string;
};

export const OCASIONES: Ocasion[] = [
  { nombre: "San Valentín", fecha: { tipo: "fija", mes: 2, dia: 14 }, icono: "💘", sugerencia: "Arreglo con rosas y peluche" },
  { nombre: "Día de la Madre", fecha: { tipo: "domingo", mes: 5, n: 2 }, icono: "🌷", sugerencia: "Box de bombones y taza con nombre" },
  { nombre: "Día del Padre", fecha: { tipo: "domingo", mes: 6, n: 3 }, icono: "☕", sugerencia: "Taza personalizada y chocolates" },
  { nombre: "Halloween", fecha: { tipo: "fija", mes: 10, dia: 31 }, icono: "🎃", sugerencia: "Box de golosinas con globos" },
  { nombre: "Navidad", fecha: { tipo: "fija", mes: 12, dia: 25 }, icono: "🎄", sugerencia: "Caja premium corporativa" },
  { nombre: "Cumpleaños", fecha: null, icono: "🎂", sugerencia: "Bocaditos dulces y salados" },
  { nombre: "Baby shower", fecha: null, icono: "🍼", sugerencia: "Bocaditos temáticos" },
];

export function fechaEnAnio(ocasion: Ocasion, anio: number): Date | null {
  const f = ocasion.fecha;
  if (!f) return null;
  if (f.tipo === "fija") return new Date(anio, f.mes - 1, f.dia);
  const primero = new Date(anio, f.mes - 1, 1);
  const primerDomingo = 1 + ((7 - primero.getDay()) % 7);
  return new Date(anio, f.mes - 1, primerDomingo + (f.n - 1) * 7);
}

export function proximaFecha(ocasion: Ocasion, hoy: Date): Date | null {
  const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
  const esteAnio = fechaEnAnio(ocasion, hoy.getFullYear());
  if (!esteAnio) return null;
  return esteAnio >= inicioHoy ? esteAnio : fechaEnAnio(ocasion, hoy.getFullYear() + 1);
}

export const MARQUESINA = [
  "Chocolatería",
  "Bombones pintados a mano",
  "Queques saludables",
  "Arreglos con peluche",
  "Box temáticos",
  "Cajas corporativas",
  "Tazas con nombre",
  "Bocaditos para eventos",
  "Globos",
  "Cursos y talleres",
  "Delivery en Arequipa",
];

// Cuarta línea de Inspira Nexum: formación. No es un emprendimiento de producto
// sino la escuela que enseña el oficio detrás de ellos.
export const ALAS = {
  nombre: "Alas hacia el futuro",
  lema: "Capacitación técnico productiva",
  descripcion:
    "Talleres prácticos para aprender un oficio y emprender: catering, chocolatería, gelatina y tartas. Cada módulo termina con una muestra de lo aprendido y certificado para cada participante.",
  cursos: [
    {
      nombre: "Taller de catering",
      texto: "Bocaditos dulces y salados, brochetas, montaje y presentación de mesas para eventos.",
      imagen: "/img/alas/mesa-catering.jpg",
    },
    {
      nombre: "Chocolatería, gelatina y tartas",
      texto: "Chocolate modelado, postres en vaso, gelatinas y tartas para vender o celebrar.",
      imagen: "/img/alas/piano-chocolate.jpg",
    },
    {
      nombre: "Pastelería creativa",
      texto: "Tortas temáticas y queques con acabados de exhibición.",
      imagen: "/img/alas/torta-tematica.jpg",
    },
  ],
  galeria: [
    { src: "/img/alas/clausura-chocolateria.jpg", alt: "Clausura del taller de chocolatería, gelatina y tartas, módulo II 2026", ancho: 1600, alto: 1067 },
    { src: "/img/alas/clausura-catering.jpg", alt: "Clausura del taller de catering, módulo II 2026", ancho: 1440, alto: 960 },
    { src: "/img/alas/estudiante-bocaditos.jpg", alt: "Participante mostrando los bocaditos que preparó", ancho: 1600, alto: 1066 },
    { src: "/img/alas/bocaditos-dorados.jpg", alt: "Mesa de bocaditos dulces y salados sobre bandejas doradas", ancho: 1440, alto: 960 },
    { src: "/img/alas/bocaditos-globos.jpg", alt: "Mesa de catering con jugos, tartaletas y empanaditas", ancho: 1600, alto: 1200 },
    { src: "/img/alas/brochetas.jpg", alt: "Brochetas de pollo con pimientos", ancho: 1200, alto: 1600 },
  ],
  datos: [
    { valor: "Módulo II", detalle: "ya clausurado en 2026" },
    { valor: "100%", detalle: "práctico, con certificado" },
    { valor: "Cupos", detalle: "limitados por taller" },
  ],
};
