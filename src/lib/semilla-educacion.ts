import type { Database } from "sql.js";

// Datos de relleno para probar Educación en desarrollo. La base es en memoria, así que se
// vuelven a cargar en cada arranque. No corren en producción ni con SEMILLA_EDUCACION=0.

type CursoSemilla = {
  nombre: string;
  instructor: string;
  descripcion: string;
  estudiantes: string[];
  /** Clases con asistencia tomada, de la más antigua a la más reciente. */
  clases: { titulo: string; haceDias: number }[];
  /** Probabilidad de asistir; da perfiles distintos de asistencia por curso. */
  asistencia: number;
  /** Clase futura o reciente sin asistencia tomada todavía. */
  clasePendiente?: { titulo: string; haceDias: number };
  /** Estudiantes de este índice en adelante se inscribieron después de la primera clase. */
  tardios?: number;
  enlace?: { maxUsos: number | null; usos: number };
};

const CURSOS: CursoSemilla[] = [
  {
    nombre: "Chocolatería artesanal",
    instructor: "Lucía Valdivia",
    descripcion: "Temperado, bombones rellenos y presentación para regalo.",
    estudiantes: [
      "Camila Quispe Mamani",
      "Diego Salas Cáceres",
      "Valeria Huamán Condori",
      "Mateo Paredes Ruelas",
      "Sofía Cornejo Delgado",
      "Rodrigo Zeballos Pinto",
      "Andrea Choque Apaza",
      "Luis Fernando Béjar",
      "Isabella Medina Ticona",
    ],
    clases: [
      { titulo: "Historia del cacao y selección de materia prima", haceDias: 35 },
      { titulo: "Temperado de chocolate", haceDias: 28 },
      { titulo: "Bombones rellenos: ganaches", haceDias: 21 },
      { titulo: "Moldeado y desmoldado", haceDias: 14 },
      { titulo: "Empaque y presentación", haceDias: 7 },
    ],
    clasePendiente: { titulo: "Costos y precio de venta", haceDias: 0 },
    asistencia: 0.85,
    tardios: 8,
    enlace: { maxUsos: null, usos: 3 },
  },
  {
    nombre: "Arreglos florales y detalles",
    instructor: "Marcela Neyra",
    descripcion: "Diseño de arreglos con flores, globos y cajas sorpresa.",
    estudiantes: [
      "Fabiola Rondón Yucra",
      "Jhon Anccasi Flores",
      "Daniela Torres Gamarra",
      "Kevin Lazo Ramos",
      "Brenda Mendoza Alca",
      "Paolo Linares Núñez",
      "Nicole Aguilar Cuba",
      "Gabriel Ponce Ccama",
    ],
    clases: [
      { titulo: "Tipos de flores y conservación", haceDias: 30 },
      { titulo: "Teoría del color", haceDias: 23 },
      { titulo: "Ramo en espiral", haceDias: 16 },
      { titulo: "Cajas con flores", haceDias: 9 },
    ],
    asistencia: 0.7,
    enlace: { maxUsos: 12, usos: 2 },
  },
  {
    nombre: "Personalización de regalos",
    instructor: "Renzo Llerena",
    descripcion: "Sublimado, grabado y diseño básico para productos personalizados.",
    estudiantes: [
      "Alexandra Vizcarra Soto",
      "Bruno Cárdenas Mogrovejo",
      "Carolina Ortiz Zúñiga",
      "Esteban Herrera Pacheco",
      "Fernanda Gutiérrez Arce",
      "Ignacio Salazar Bellido",
      "Julieta Cuadros Vilca",
      "Martín Ccallo Huanca",
      "Natalia Rivera Ayala",
      "Óscar Velásquez Peralta",
    ],
    clases: [
      { titulo: "Introducción al diseño con plantillas", haceDias: 42 },
      { titulo: "Sublimado en tazas", haceDias: 35 },
      { titulo: "Sublimado en textiles", haceDias: 28 },
      { titulo: "Grabado láser: materiales", haceDias: 21 },
      { titulo: "Atención y cotización al cliente", haceDias: 14 },
      { titulo: "Proyecto final: pedido personalizado", haceDias: 7 },
    ],
    asistencia: 0.92,
  },
  {
    nombre: "Marketing para emprendedores",
    instructor: "Patricia Salinas",
    descripcion: "Redes sociales, fotografía de producto y ventas por WhatsApp.",
    estudiantes: [
      "Adriana Collado Mamani",
      "Bernardo Acosta Tapia",
      "Claudia Pinto Rivas",
      "Dante Huarca Coaquira",
      "Elena Mogollón Vera",
      "Franco Del Carpio",
    ],
    clases: [
      { titulo: "Propuesta de valor", haceDias: 18 },
      { titulo: "Fotografía de producto con el celular", haceDias: 11 },
      { titulo: "Catálogo de WhatsApp Business", haceDias: 4 },
    ],
    clasePendiente: { titulo: "Publicidad pagada en redes", haceDias: -3 },
    asistencia: 0.55,
  },
  {
    nombre: "Taller de cartas y caligrafía",
    instructor: "Inés Bustamante",
    descripcion: "Curso nuevo: aún sin estudiantes ni clases.",
    estudiantes: [],
    clases: [],
    asistencia: 1,
  },
];

// Generador pseudoaleatorio determinista (mulberry32): mismos datos en cada arranque.
function generador(semilla: number) {
  let estado = semilla;
  return () => {
    estado = (estado + 0x6d2b79f5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function fechaHace(dias: number): string {
  const hoy = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima" }).format(new Date());
  const fecha = new Date(`${hoy}T00:00:00Z`);
  fecha.setUTCDate(fecha.getUTCDate() - dias);
  return fecha.toISOString().slice(0, 10);
}

export function sembrarEducacion(db: Database) {
  if (process.env.NODE_ENV === "production" || process.env.SEMILLA_EDUCACION === "0") return;
  const existentes = db.exec("SELECT COUNT(*) FROM cursos")[0].values[0][0] as number;
  if (existentes > 0) return;

  const azar = generador(20261018);
  db.run("BEGIN");
  try {
    CURSOS.forEach((curso, indiceCurso) => {
      db.run("INSERT INTO cursos (nombre, descripcion, instructor) VALUES (?, ?, ?)", [
        curso.nombre,
        curso.descripcion,
        curso.instructor,
      ]);
      const cursoId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;

      const idsEstudiantes = curso.estudiantes.map((nombre, i) => {
        // Una parte entra por enlace y el resto de forma manual.
        const origen = i % 3 === 2 ? "enlace" : "manual";
        db.run("INSERT INTO estudiantes (curso_id, nombre, origen) VALUES (?, ?, ?)", [cursoId, nombre, origen]);
        return db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
      });

      curso.clases.forEach((clase, indiceClase) => {
        db.run(
          "INSERT INTO clases (curso_id, titulo, fecha, asistencia_tomada_en) VALUES (?, ?, ?, ?)",
          [cursoId, clase.titulo, fechaHace(clase.haceDias), `${fechaHace(clase.haceDias)} 21:00:00`]
        );
        const claseId = db.exec("SELECT last_insert_rowid()")[0].values[0][0] as number;
        idsEstudiantes.forEach((estudianteId, i) => {
          // Los tardíos no tienen registro en la primera clase: no la cursaron.
          if (curso.tardios !== undefined && i >= curso.tardios && indiceClase === 0) return;
          // Cada estudiante tiene su propio "nivel" de constancia alrededor del promedio del curso.
          const constancia = Math.min(0.98, Math.max(0.15, curso.asistencia + ((i * 37 + indiceCurso * 11) % 21 - 10) / 60));
          db.run("INSERT INTO asistencias (clase_id, estudiante_id, presente) VALUES (?, ?, ?)", [
            claseId,
            estudianteId,
            azar() < constancia ? 1 : 0,
          ]);
        });
      });

      if (curso.clasePendiente) {
        db.run("INSERT INTO clases (curso_id, titulo, fecha) VALUES (?, ?, ?)", [
          cursoId,
          curso.clasePendiente.titulo,
          fechaHace(curso.clasePendiente.haceDias),
        ]);
      }

      if (curso.enlace) {
        db.run(
          "INSERT INTO enlaces_inscripcion (curso_id, token, max_usos, usos, activo) VALUES (?, ?, ?, ?, 1)",
          [cursoId, `semilla-curso-${cursoId}-abcdefghij`, curso.enlace.maxUsos, curso.enlace.usos]
        );
      }
    });
    db.run("COMMIT");
  } catch (error) {
    db.run("ROLLBACK");
    throw error;
  }
}
