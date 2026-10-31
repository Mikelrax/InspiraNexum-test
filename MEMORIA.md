# Memoria de mejoras continuas — InspiraNexum

> Registro de avance de las rondas automáticas de revisión (bugs, seguridad, UX,
> funcionalidades). Cada ronda añade una sección; el backlog de abajo se mantiene
> al día para que la siguiente ronda (humana o IA) sepa por dónde seguir.
> Rama de trabajo: `claude/busy-fermat-60q2tk` (nunca directo a `main`).

## Cómo verificar

```bash
npm ci
npx tsc --noEmit      # tipos
npx next build        # build completo
```

No hay tests ni ESLint configurados todavía (ver backlog).

## Ronda 1 — 2026-10-31

**Hecho**

1. **Persistencia opcional de la base (`DB_PATH`)** — `src/lib/db.ts`.
   La base sql.js era solo en memoria: cada reinicio/despliegue borraba cursos,
   estudiantes, enlaces y asistencias. Ahora, si `DB_PATH` está definido:
   - al arrancar se carga el archivo si existe (y no se vuelven a sembrar las tareas demo);
   - cada cambio (detectado con `updateHook` de SQLite) programa un guardado a 1 s;
   - el guardado es atómico (`.tmp` + `rename`) y se vacía en el evento `exit`
     (SIGINT/SIGTERM incluidos), así un cambio justo antes de apagar no se pierde;
   - `export()` de sql.js reabre la conexión, por eso se re-aplican `PRAGMA foreign_keys`
     y el hook tras cada guardado.
   Sin `DB_PATH` el comportamiento es idéntico al anterior. Documentado en `.env.example`;
   `*.sqlite` añadido a `.gitignore`.
   Verificado: crear tarea → reiniciar → sigue; borrar y apagar en <1 s → el borrado persiste.

2. **Límite de intentos de login no evadible** — `src/lib/limite.ts`, `src/lib/admin.ts`.
   El límite era solo por IP tomada de `x-forwarded-for`, que el cliente puede inventar:
   cambiando la cabecera en cada petición se podían probar contraseñas sin fin.
   Ahora hay un límite por IP (5 / 15 min) **y** uno por cuenta (20 / 15 min) que no
   depende de la IP. `ipCliente()` prefiere `x-real-ip`. Los mapas en memoria se podan
   (máx. 5000 claves) para que IPs inventadas no hagan crecer la memoria sin fin.
   El límite de `/unirse/[token]` usa el mismo limitador compartido.

3. **Borrar estudiante acotado a su curso** — `eliminarEstudiante(cursoId, id)` en
   `src/lib/educacion.ts`. Antes ignoraba el curso y borraba cualquier id recibido.

## Backlog / ideas pendientes (priorizadas)

- [ ] **Decidir sobre `/tareas` y `/api/tareas`**: son públicos *y escribibles* sin sesión
      (cualquiera puede crear/borrar tareas, y el dashboard del admin cuenta esas tareas).
      Opciones: exigir sesión para escribir, o mover el módulo bajo `/admin`. Requiere
      decisión del dueño (el registro de módulos lo marca como `zona: "publico"`).
- [ ] Cerrar sesión no invalida el token (es HMAC sin estado, dura 8 h). Valorar una
      "versión de sesión" en la base para poder revocar.
- [ ] Añadir ESLint (`eslint-config-next`) y un script `lint`.
- [ ] Añadir tests mínimos (validaciones de `almacen.normalizarRuta`, `clases.esFechaValida`,
      `celdaCsv`, `generarReporte`) — Node 22 ya ejecuta `.ts` con type-stripping.
- [ ] Revisar UX del explorador de archivos (`archivos/explorador.tsx`) y formularios de
      educación: confirmaciones de borrado, estados de carga, accesibilidad de modales.
- [ ] `renombrarCarpeta` copia objeto a objeto en serie: lento con muchas claves; se podría
      paralelizar con un límite de concurrencia.
