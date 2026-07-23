# EduTrauma Instructores — instructores.edutrauma.net

Portal privado del equipo docente EduTrauma. Cada instructor entra con correo y clave, y ve **solo los cursos que tiene asignados**: guía de ejecución del curso desde la visión del instructor + checklists (antes / día del curso / cierre) con progreso guardado por persona.

Misma línea visual y lógica que [EduTrauma Tools](https://tools.edutrauma.net) (`design/edutrauma-ui.css` canónico), con una capa adicional de autenticación y roles.

## Arquitectura

```
GitHub Pages (este repo, público — SOLO el cascarón, sin contenido)
      │
      ▼
Supabase «edutrauma-instructores» (proyecto zbvxigtajjvakakbhalo)
  ├─ Auth: email + clave por instructor
  ├─ Tablas: cursos · perfiles · asignaciones · secciones · progreso
  ├─ RLS: cada instructor solo lee sus cursos asignados; progreso solo propio
  └─ Edge function «admin-instructores»: crear cuentas, asignar cursos,
     resetear claves, eliminar (solo rol admin)
```

El contenido de guías/checklists vive en la tabla `secciones` (JSONB), **nunca en el repo** — por eso el repo puede ser público (GitHub Pages free) sin exponer material interno.

## Roles

| Rol | Puede |
|---|---|
| `instructor` | Ver sus cursos asignados, marcar checklists, cambiar su clave |
| `admin` (Elías) | Todo lo anterior en todos los cursos + gestionar instructores desde la tarjeta «Instructores» del hub |

## Modelo de contenido (tabla `secciones`)

- `tipo = 'guia'` → `contenido = [{"titulo","texto"}]` (texto admite saltos de línea)
- `tipo = 'checklist'` → `contenido = [{"id","texto","detalle"}]` — `id` estable por ítem (el progreso se guarda por `seccion_id + item_id`)

Editar contenido hoy: SQL en Supabase (o pedírselo a Claude). Editor in-app para admin: pendiente.

## Convenciones del ecosistema (heredadas de ET Tools)

- `design/edutrauma-ui.css` es canónico — se copia desde EduTrauma_Tools, no se edita aquí.
- SW **network-first** siempre; subir `CACHE` en `sw.js` en **cada deploy**.
- Colores solo vía tokens `--et-*`.
- DNS: CNAME `instructores` → `eliasadolfo.github.io` en el panel DNS de **Kajabi**.

## Deploy

```bash
git push   # GitHub Pages publica automáticamente
```

Antes de cada push: subir versión de `CACHE` en `sw.js`.
