# Claudio · Organizador de proyectos

App para organizar proyectos y tareas con tablero kanban. Construida con React 19, TypeScript, Vite y Tailwind CSS.

## Funcionalidades

- **Proyectos**: crea, selecciona y elimina proyectos, cada uno con su color.
- **Tablero kanban**: tres columnas (Por hacer, En curso, Hechas) con arrastrar y soltar.
- **Tareas**: título, descripción, prioridad (alta/media/baja) y fecha límite, con aviso de tareas vencidas.
- **Búsqueda**: filtra las tareas del proyecto por título o descripción.
- **Persistencia local**: todo se guarda automáticamente en el navegador (localStorage) — sin servidor ni cuentas.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # comprobación de tipos + build de producción
npm run preview    # servir el build localmente
```

## Prueba de humo

Con el build servido en `http://localhost:4173` (`npm run preview`):

```bash
node scripts/smoke.mjs
```

Abre la app en Chromium, crea un proyecto y una tarea, y captura una pantalla.
