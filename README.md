# Claudio · Organizador de proyectos

App para organizar proyectos y tareas con tablero kanban. Construida con React 19, TypeScript, Vite y Tailwind CSS.

**App en línea**: https://nextro-ai.github.io/Claudio/

## Funcionalidades

- **Proyectos**: crea, selecciona y elimina proyectos, cada uno con su color.
- **Tablero kanban**: tres columnas (Por hacer, En curso, Hechas). Arrastrar y soltar en escritorio; botones ◀ ▶ en móvil.
- **Tareas**: título, descripción, prioridad (alta/media/baja) y fecha límite, con aviso de tareas vencidas.
- **Progreso**: barra de avance del proyecto en la cabecera.
- **Sonidos**: efectos sintetizados con WebAudio (crear, mover, completar, borrar), con botón para silenciar.
- **Celebraciones**: confeti al completar una tarea y fanfarria con lluvia de confeti al terminar todas las del proyecto.
- **Modo oscuro**: conmutable y recordado entre sesiones.
- **Búsqueda**: filtra las tareas del proyecto por título o descripción.
- **PWA**: instalable en el móvil ("Añadir a pantalla de inicio") y funciona sin conexión.
- **Persistencia local**: todo se guarda en el navegador (localStorage). Botones de exportar/importar para mover tus datos entre dispositivos.

## Desarrollo

```bash
npm install
npm run dev        # servidor de desarrollo
npm run build      # comprobación de tipos + build de producción
npm run preview    # servir el build localmente
```

## Despliegue

Cada push a `main` publica automáticamente en GitHub Pages mediante `.github/workflows/deploy.yml`.

## Prueba de humo

Con el build servido (`npm run preview`):

```bash
node scripts/smoke.mjs
```

Abre la app en Chromium y prueba el flujo completo: crear proyecto y tarea, modo oscuro y vista móvil con botones de mover. Deja capturas `captura-*.png`.
